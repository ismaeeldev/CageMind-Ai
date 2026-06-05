import { BaseScraper } from "./base-scraper";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { UfcSourceAdapter } from "./adapters/ufc-source-adapter";
import { UfcFightParser } from "./parsers/ufc-fight-parser";
import { UfcFightValidator } from "./validators/ufc-fight-validator";

export interface RawFight {
  eventId: string;
  fighter1Name: string;
  fighter2Name: string;
  fighter1UfcId?: string | null;
  fighter2UfcId?: string | null;
  weightClass?: string;
  isMainCard?: boolean;
  isTitleFight?: boolean;
  winnerName?: string | null;
  method?: string | null;
  endingRound?: number | null;
  endingTime?: string | null;
}

export interface ParsedFight {
  eventId: string;
  fighter1Name: string;
  fighter2Name: string;
  fighter1UfcId: string | null;
  fighter2UfcId: string | null;
  weightClass: string | null;
  isMainCard: boolean;
  isTitleFight: boolean;
  winnerName: string | null;
  method: string | null;
  endingRound: number | null;
  endingTime: string | null;
}

export class FightCardScraper extends BaseScraper<ParsedFight[]> {
  private useMock: boolean;
  private eventUrl: string;
  private eventId: string;
  private adapter: UfcSourceAdapter;
  private parser: UfcFightParser;
  private validator: UfcFightValidator;

  constructor(eventUrl: string, eventId: string, useMock: boolean = false) {
    super(`FightCardScraper-${eventId}`, { maxRetries: 2, delayBetweenRequestsMs: 1500 });
    this.eventUrl = eventUrl;
    this.eventId = eventId;
    this.useMock = useMock;
    this.adapter = new UfcSourceAdapter();
    this.parser = new UfcFightParser();
    this.validator = new UfcFightValidator();
  }

  protected async execute(): Promise<ParsedFight[]> {
    logger.info(`[${this.scraperName}] Fetching fight card from ${this.eventUrl}`);

    let rawData: RawFight[] = [];

    try {
      if (this.useMock) {
        rawData = this.getMockData();
      } else {
        const html = await this.adapter.fetchHtml(this.eventUrl);
        rawData = this.parser.parse(html, this.eventId);
      }
    } catch (error) {
      logger.error(`[${this.scraperName}] Failed to fetch or parse fights`, error);
      throw error;
    }

    if (rawData.length === 0) {
      logger.warn(`[${this.scraperName}] Found 0 fights on the card.`);
      return [];
    }

    const ALIASES: Record<string, string> = {
      "eduardo matias torres": "Manuel Torres",
      "belal muhamed": "Belal Muhammad",
      "belal muhammad": "Belal Muhammad",
      "alex pereria": "Alex Pereira",
      "illia topuria": "Ilia Topuria",
      "elizeu zaleski dos santos": "Elizeu Zaleski dos Santos",
      "aieman zahabi": "Aiemann Zahabi",
      "aiemann zahabi": "Aiemann Zahabi",
      "sean o'malley": "Sean O'Malley",
      "sean o’malley": "Sean O'Malley",
      "sean omalley": "Sean O'Malley",
      "gabriel bonfim": "Gabriel Bonfim",
      "deiveson figuereido": "Deiveson Figueiredo",
      "deiveson figueiredo": "Deiveson Figueiredo"
    };

    const parsedFights: ParsedFight[] = [];
    for (const raw of rawData) {
      try {
        const parsed = this.validator.validateAndTransform(raw) as any;
        
        let f1Name = raw.fighter1Name;
        let f2Name = raw.fighter2Name;
        let wName = raw.winnerName;

        if (f1Name && ALIASES[f1Name.toLowerCase()]) f1Name = ALIASES[f1Name.toLowerCase()];
        if (f2Name && ALIASES[f2Name.toLowerCase()]) f2Name = ALIASES[f2Name.toLowerCase()];
        if (wName && ALIASES[wName.toLowerCase()]) wName = ALIASES[wName.toLowerCase()];

        parsedFights.push({
          ...parsed,
          fighter1Name: f1Name,
          fighter2Name: f2Name,
          winnerName: wName,
          fighter1UfcId: raw.fighter1UfcId || null,
          fighter2UfcId: raw.fighter2UfcId || null,
        });
      } catch (error) {
        logger.warn(`[${this.scraperName}] Invalid fight data skipped`, { error });
      }
    }

    await this.saveToDatabase(parsedFights);

    return parsedFights;
  }

  private async saveToDatabase(fights: ParsedFight[]): Promise<void> {
    logger.info(`[${this.scraperName}] Saving ${fights.length} fights to DB sequentially...`);
    
    const uniqueFightsMap = new Map<string, ParsedFight>();
    for (const fight of fights) {
      const key = `${fight.fighter1Name}_${fight.fighter2Name}`;
      const reverseKey = `${fight.fighter2Name}_${fight.fighter1Name}`;
      if (!uniqueFightsMap.has(key) && !uniqueFightsMap.has(reverseKey)) {
        uniqueFightsMap.set(key, fight);
      }
    }
    const uniqueFights = Array.from(uniqueFightsMap.values());
    logger.info(`[${this.scraperName}] Deduplicated to ${uniqueFights.length} unique fights.`);

    // 1. Upsert All Fighters
    for (const fight of uniqueFights) {
      await this.upsertFighter(fight.fighter1Name, fight.fighter1UfcId, fight.weightClass);
      await this.upsertFighter(fight.fighter2Name, fight.fighter2UfcId, fight.weightClass);
    }

    // 2. Fetch all fighters to get their IDs
    const names = uniqueFights.flatMap(f => [f.fighter1Name, f.fighter2Name]);
    const ufcIds = uniqueFights.flatMap(f => [f.fighter1UfcId, f.fighter2UfcId]).filter(Boolean) as string[];

    const dbFighters = await prisma.fighter.findMany({
      where: { 
        OR: [
          { name: { in: names } },
          { ufcId: { in: ufcIds } }
        ]
      }
    });

    const fighterIdByNameMap = new Map(dbFighters.map(f => [f.name, f.id]));
    const fighterIdByUfcIdMap = new Map(dbFighters.filter(f => f.ufcId).map(f => [f.ufcId!, f.id]));

    // 3. Fetch all existing fights for this event
    const existingFights = await prisma.fight.findMany({
      where: { eventId: this.eventId }
    });
    
    const existingFightMap = new Map(
      existingFights.map(f => [`${f.fighter1Id}_${f.fighter2Id}`, f.id])
    );

    // 4. Update/Create Fights sequentially
    let processedCount = 0;

    for (const fight of uniqueFights) {
      const f1Id = (fight.fighter1UfcId ? fighterIdByUfcIdMap.get(fight.fighter1UfcId) : null) || fighterIdByNameMap.get(fight.fighter1Name);
      const f2Id = (fight.fighter2UfcId ? fighterIdByUfcIdMap.get(fight.fighter2UfcId) : null) || fighterIdByNameMap.get(fight.fighter2Name);

      if (!f1Id || !f2Id) {
        logger.warn(`[${this.scraperName}] Missing fighter ID for ${fight.fighter1Name} or ${fight.fighter2Name}`);
        continue;
      }

      let winnerId = null;
      if (fight.winnerName) {
        if (fight.winnerName === fight.fighter1Name) winnerId = f1Id;
        else if (fight.winnerName === fight.fighter2Name) winnerId = f2Id;
        else winnerId = fighterIdByNameMap.get(fight.winnerName) || null;
      }

      const key = `${f1Id}_${f2Id}`;
      const existingFightId = existingFightMap.get(key);

      try {
        if (existingFightId) {
          await prisma.fight.update({
            where: { id: existingFightId },
            data: {
              weightClass: fight.weightClass,
              isTitleFight: fight.isTitleFight,
              winnerId: winnerId,
              method: fight.method,
              endingRound: fight.endingRound,
              endingTime: fight.endingTime,
            }
          });
        } else {
          await prisma.fight.create({
            data: {
              eventId: fight.eventId,
              fighter1Id: f1Id,
              fighter2Id: f2Id,
              weightClass: fight.weightClass,
              isTitleFight: fight.isTitleFight,
              winnerId: winnerId,
              method: fight.method,
              endingRound: fight.endingRound,
              endingTime: fight.endingTime,
            }
          });
        }
        processedCount++;
      } catch (error) {
        logger.error(`[${this.scraperName}] Failed to save fight record: ${fight.fighter1Name} vs ${fight.fighter2Name}`, error);
      }
    }

    logger.info(`[${this.scraperName}] Successfully saved/updated ${processedCount} fights.`);
  }

  private async upsertFighter(name: string, ufcId: string | null, weightClass: string | null) {
    try {
      const existing = ufcId 
        ? await prisma.fighter.findUnique({ where: { ufcId } })
        : await prisma.fighter.findFirst({ where: { name } });

      if (existing) {
        // Only update if ufcId was missing and we now have it
        if (ufcId && !existing.ufcId) {
          await prisma.fighter.update({
            where: { id: existing.id },
            data: { ufcId }
          });
        }
      } else {
        await prisma.fighter.create({
          data: { name, ufcId, weightClass }
        });
      }
    } catch (error) {
      logger.error(`[${this.scraperName}] Failed to upsert fighter: ${name}`, error);
    }
  }

  private getMockData(): RawFight[] {
    return [
      {
        eventId: this.eventId,
        fighter1Name: "Islam Makhachev",
        fighter2Name: "Dustin Poirier",
        weightClass: "Lightweight Title Bout",
        isMainCard: true,
        isTitleFight: true
      }
    ];
  }
}
