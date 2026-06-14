import { BaseScraper } from "./base-scraper";
import { logger } from "@/lib/logger";
import { ParsingError } from "@/lib/scraper-error";
import { prisma } from "@/lib/db";
import * as cheerio from "cheerio";

// 1. Define Data Structures
export interface RawFighter {
  ufcId?: string | null;
  name: string;
  age?: number | string;
  height?: number | string;
  reach?: number | string;
  weightClass?: string;
  wins: number | string;
  losses: number | string;
  draws: number | string;
  imageUrl?: string | null;
}

export interface ParsedFighter {
  ufcId: string | null;
  name: string;
  age: number | null;
  height: number | null;
  reach: number | null;
  weightClass: string | null;
  wins: number;
  losses: number;
  draws: number;
  imageUrl: string | null;
}

// 2. Generate 90 Mock Fighters (Simulating 10 fighters retiring/becoming inactive)
function generateMockFighters(): RawFighter[] {
  const firstNames = ["Jon", "Conor", "Khabib", "Islam", "Leon", "Kamaru", "Israel", "Alex", "Max", "Ilia"];
  const lastNames = ["Jones", "McGregor", "Nurmagomedov", "Makhachev", "Edwards", "Usman", "Adesanya", "Pereira", "Holloway", "Topuria"];
  const weightClasses = ["Heavyweight", "Light Heavyweight", "Middleweight", "Welterweight", "Lightweight", "Featherweight", "Bantamweight", "Flyweight"];

  const fighters: RawFighter[] = [];

  for (let i = 0; i < 90; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / 10) % lastNames.length];

    const uniqueName = `${firstName} ${lastName} ${i > 0 ? `Mk${i}` : ''}`.trim();

    fighters.push({
      ufcId: `/athlete/${uniqueName.toLowerCase().replace(/ /g, '-')}`,
      name: uniqueName,
      age: 20 + (i % 20),
      height: 60 + (i % 20),
      reach: 65 + (i % 20),
      weightClass: weightClasses[i % weightClasses.length],
      wins: 10 + (i % 15),
      losses: i % 5,
      draws: i % 2,
      imageUrl: null,
    });
  }

  return fighters;
}

function getSlugCandidates(ufcId: string, name: string): string[] {
  const candidates = new Set<string>();
  const clean = (s: string) => s.toLowerCase().replace(/['"’‘“”\.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const cleanWithHyphen = (s: string) => s.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  let originalSlug = ufcId;
  if (originalSlug.startsWith("/athlete/")) {
    originalSlug = originalSlug.replace("/athlete/", "");
  }
  candidates.add(clean(originalSlug));
  candidates.add(cleanWithHyphen(originalSlug));
  
  const nameCleaned = name.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
  const parts = nameCleaned.split(/\s+/);
  
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    candidates.add(`${clean(first)}-${clean(last)}`);
    candidates.add(parts.map(clean).filter(Boolean).join("-"));
    candidates.add(`${clean(first)}${clean(last)}`);
  }
  candidates.add(clean(name));
  candidates.add(cleanWithHyphen(name));
  
  return Array.from(candidates).map(slug => `/athlete/${slug}`);
}

async function verifyUfcAthleteActive(ufcId: string, name: string): Promise<boolean> {
  const slugs = getSlugCandidates(ufcId, name);
  for (const slug of slugs) {
    const url = `https://www.ufc.com${slug}`;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(6000)
      });
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        const heroText = $(".hero-profile__division, .hero-profile__tag, .hero-profile__division-body").text().toLowerCase();
        if (heroText.includes("former athlete")) {
          return false;
        }
        return true;
      }
    } catch (error) {
      return true; // default to true on error to avoid false retirement
    }
  }
  return false;
}

export class FighterScraper extends BaseScraper<ParsedFighter[]> {
  private useMock: boolean;

  constructor(useMock: boolean = true) {
    super("FighterScraper", { maxRetries: 3, delayBetweenRequestsMs: 1000, timeoutMs: 30000 });
    this.useMock = useMock;
  }

  protected async execute(): Promise<ParsedFighter[]> {
    logger.info(`[${this.scraperName}] Starting execution. Mock mode: ${this.useMock}`);

    const rawData = await this.fetchData();

    const parsedFighters: ParsedFighter[] = [];
    for (const raw of rawData) {
      try {
        const parsed = this.parse(raw);
        this.validate(parsed);
        parsedFighters.push(parsed);
      } catch (error) {
        logger.warn(`[${this.scraperName}] Skipping invalid fighter: ${raw.name}`, { error });
      }
    }

    await this.saveToDatabase(parsedFighters);

    return parsedFighters;
  }

  private async fetchData(): Promise<RawFighter[]> {
    if (this.useMock) {
      logger.debug(`[${this.scraperName}] Generating 90 mock fighters (to trigger archiving of 10).`);
      await this.sleep(500);
      return generateMockFighters();
    }

    logger.info(`[${this.scraperName}] Starting live scraping of UFC athletes...`);
    const fighters: RawFighter[] = [];
    let page = 0;
    let hasMore = true;
    const maxPages = 400;

    while (hasMore && page < maxPages) {
      const url = `https://www.ufc.com/athletes/all?page=${page}`;
      logger.info(`[${this.scraperName}] Fetching page ${page}: ${url}`);

      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
          signal: AbortSignal.timeout(this.timeoutMs),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const elements = $(".c-listing-athlete-flipcard");

        if (elements.length === 0) {
          hasMore = false;
          break;
        }

        elements.each((_, el) => {
          const nameEl = $(el).find(".c-listing-athlete__name").first();
          if (!nameEl.length) return;

          const name = nameEl.text().trim().replace(/\s+/g, " ");
          const ufcId = nameEl.closest("a").attr("href") || null;
          
          const weightClass = $(el).find(".c-listing-athlete__title .field__item").text().trim() ||
            $(el).find(".c-listing-athlete__title").text().trim();
          const recordText = $(el).find(".c-listing-athlete__record").text().trim();

          let wins = "0";
          let losses = "0";
          let draws = "0";

          if (recordText) {
            const match = recordText.match(/(\d+)-(\d+)-(\d+)/);
            if (match) {
              wins = match[1];
              losses = match[2];
              draws = match[3];
            }
          }

          const imgNode = $(el).find(".c-listing-athlete__thumbnail img");
          let imgUrl = imgNode.attr("src") || imgNode.attr("data-src") || null;

          if (imgUrl && imgUrl.includes("no-profile-image")) {
            imgUrl = null;
          }

          if (imgUrl && imgUrl.startsWith("/")) {
            imgUrl = `https://www.ufc.com${imgUrl}`;
          }

          fighters.push({
            ufcId,
            name,
            weightClass: weightClass || undefined,
            wins,
            losses,
            draws,
            imageUrl: imgUrl,
          });
        });

        page++;
        await this.sleep(this.delayBetweenRequestsMs);
      } catch (error) {
        logger.error(`[${this.scraperName}] Error scraping page ${page}`, error);
        throw error;
      }
    }

    return fighters;
  }

  private parse(raw: RawFighter): ParsedFighter {
    if (!raw.name) {
      throw new ParsingError("Missing required field: name");
    }

    const parseNumber = (val: any): number | null => {
      if (val === undefined || val === null || val === "") return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    return {
      ufcId: raw.ufcId ? raw.ufcId.trim() : null,
      name: raw.name.trim(),
      age: parseNumber(raw.age),
      height: parseNumber(raw.height),
      reach: parseNumber(raw.reach),
      weightClass: raw.weightClass ? raw.weightClass.trim() : null,
      wins: parseNumber(raw.wins) ?? 0,
      losses: parseNumber(raw.losses) ?? 0,
      draws: parseNumber(raw.draws) ?? 0,
      imageUrl: raw.imageUrl ? raw.imageUrl.trim() : null,
    };
  }

  private validate(parsed: ParsedFighter): void {
    if (parsed.name.length < 2) {
      throw new ParsingError(`Fighter name too short: ${parsed.name}`);
    }
  }

  private async saveToDatabase(fighters: ParsedFighter[]): Promise<void> {
    logger.info(`[${this.scraperName}] Upserting ${fighters.length} fighters to database in batches...`);

    const scrapedIds = new Set<string>();
    const batchSize = 10;

    for (let i = 0; i < fighters.length; i += batchSize) {
      const batch = fighters.slice(i, i + batchSize);
      const upsertOperations = [];

      for (const fighter of batch) {
        if (fighter.ufcId) scrapedIds.add(fighter.ufcId);
        
        // We use an async operation per item to handle the fallback logic
        upsertOperations.push((async () => {
          const existing = fighter.ufcId 
            ? await prisma.fighter.findUnique({ where: { ufcId: fighter.ufcId } })
            : await prisma.fighter.findFirst({ where: { name: fighter.name } });

          const data = {
            name: fighter.name,
            ufcId: fighter.ufcId,
            age: fighter.age,
            height: fighter.height,
            reach: fighter.reach,
            weightClass: fighter.weightClass,
            wins: fighter.wins,
            losses: fighter.losses,
            draws: fighter.draws,
            imageUrl: fighter.imageUrl,
            isActive: true,
          };

          if (existing) {
            return prisma.fighter.update({
              where: { id: existing.id },
              data
            });
          } else {
            return prisma.fighter.create({
              data
            });
          }
        })());
      }

      try {
        await Promise.all(upsertOperations);
      } catch (error) {
        logger.error(`[${this.scraperName}] Failed to upsert batch starting at index ${i}`, error);
      }
    }

    logger.info(`[${this.scraperName}] Successfully saved/updated all ${fighters.length} fighters.`);

    // Archiving Step
    logger.info(`[${this.scraperName}] Archiving missing fighters...`);
    try {
      const activeDbFighters = await prisma.fighter.findMany({
        where: { isActive: true },
        select: { id: true, name: true, ufcId: true }
      });

      // Upcoming Fight Immunity
      const upcomingFights = await prisma.fight.findMany({
        where: {
          event: { isUpcoming: true }
        },
        select: { fighter1Id: true, fighter2Id: true }
      });
      const upcomingFighterIds = new Set(upcomingFights.flatMap(f => [f.fighter1Id, f.fighter2Id]));

      const scrapedNamesSet = new Set(fighters.map(f => f.name.toLowerCase()));
      const scrapedUfcIdsSet = new Set(fighters.map(f => f.ufcId?.toLowerCase()).filter(Boolean));

      const retiredFighterIds: string[] = [];

      for (const dbFighter of activeDbFighters) {
        const hasMatchingName = scrapedNamesSet.has(dbFighter.name.toLowerCase());
        const hasMatchingUfcId = dbFighter.ufcId && scrapedUfcIdsSet.has(dbFighter.ufcId.toLowerCase());

        if (!hasMatchingName && !hasMatchingUfcId) {
          if (upcomingFighterIds.has(dbFighter.id)) {
            logger.info(`[${this.scraperName}] Athlete ${dbFighter.name} is immune from archiving due to an upcoming fight.`);
            continue;
          }
          
          if (dbFighter.ufcId) {
            const isStillActive = await verifyUfcAthleteActive(dbFighter.ufcId, dbFighter.name);
            if (isStillActive) {
              logger.info(`[${this.scraperName}] Athlete ${dbFighter.name} is verified active via UFC page. Skipping archiving.`);
              continue;
            }
          }
          
          retiredFighterIds.push(dbFighter.id);
        }
      }

      if (retiredFighterIds.length > 0) {
        const batchSize = 100;
        for (let i = 0; i < retiredFighterIds.length; i += batchSize) {
          const chunk = retiredFighterIds.slice(i, i + batchSize);
          await prisma.fighter.updateMany({
            where: { id: { in: chunk } },
            data: { isActive: false }
          });
        }
        logger.info(`[${this.scraperName}] Archived ${retiredFighterIds.length} inactive fighters.`);
      }
    } catch (error) {
      logger.error(`[${this.scraperName}] Failed to archive missing fighters`, error);
    }
  }
}
