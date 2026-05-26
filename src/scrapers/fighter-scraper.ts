import { BaseScraper } from "./base-scraper";
import { logger } from "@/lib/logger";
import { ParsingError } from "@/lib/scraper-error";
import { prisma } from "@/lib/db";

// 1. Define Data Structures
export interface RawFighter {
  name: string;
  age?: number | string;
  height?: number | string;
  reach?: number | string;
  weightClass?: string;
  wins: number | string;
  losses: number | string;
  draws: number | string;
}

export interface ParsedFighter {
  name: string;
  age: number | null;
  height: number | null;
  reach: number | null;
  weightClass: string | null;
  wins: number;
  losses: number;
  draws: number;
}

// 2. Generate 90 Mock Fighters (Simulating 10 fighters retiring/becoming inactive)
function generateMockFighters(): RawFighter[] {
  const firstNames = ["Jon", "Conor", "Khabib", "Islam", "Leon", "Kamaru", "Israel", "Alex", "Max", "Ilia"];
  const lastNames = ["Jones", "McGregor", "Nurmagomedov", "Makhachev", "Edwards", "Usman", "Adesanya", "Pereira", "Holloway", "Topuria"];
  const weightClasses = ["Heavyweight", "Light Heavyweight", "Middleweight", "Welterweight", "Lightweight", "Featherweight", "Bantamweight", "Flyweight"];

  const fighters: RawFighter[] = [];
  
  // Generating only 90 instead of 100 so the archiving logic can catch the 10 missing fighters
  for (let i = 0; i < 90; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / 10) % lastNames.length];
    
    // Add a suffix to ensure uniqueness for all 100 since there are only 10x10 combinations
    const uniqueName = `${firstName} ${lastName} ${i > 0 ? `Mk${i}` : ''}`.trim();

    fighters.push({
      name: uniqueName,
      age: 20 + (i % 20),
      height: 60 + (i % 20), // inches
      reach: 65 + (i % 20), // inches
      weightClass: weightClasses[i % weightClasses.length],
      wins: 10 + (i % 15),
      losses: i % 5,
      draws: i % 2,
    });
  }

  return fighters;
}

export class FighterScraper extends BaseScraper<ParsedFighter[]> {
  private useMock: boolean;

  constructor(useMock: boolean = true) {
    super("FighterScraper", { maxRetries: 3, delayBetweenRequestsMs: 1000 });
    this.useMock = useMock;
  }

  protected async execute(): Promise<ParsedFighter[]> {
    logger.info(`[${this.scraperName}] Starting execution. Mock mode: ${this.useMock}`);

    // A. Fetch
    const rawData = await this.fetchData();

    // B. Parse & Validate
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

    // C. Store in Database with Deduplication & Archiving
    await this.saveToDatabase(parsedFighters);

    return parsedFighters;
  }

  private async fetchData(): Promise<RawFighter[]> {
    if (this.useMock) {
      logger.debug(`[${this.scraperName}] Generating 90 mock fighters (to trigger archiving of 10).`);
      await this.sleep(500); // Simulate network
      return generateMockFighters();
    }

    throw new Error("Live scraping not implemented yet.");
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
      name: raw.name.trim(),
      age: parseNumber(raw.age),
      height: parseNumber(raw.height),
      reach: parseNumber(raw.reach),
      weightClass: raw.weightClass ? raw.weightClass.trim() : null,
      wins: parseNumber(raw.wins) ?? 0,
      losses: parseNumber(raw.losses) ?? 0,
      draws: parseNumber(raw.draws) ?? 0,
    };
  }

  private validate(parsed: ParsedFighter): void {
    if (parsed.name.length < 2) {
      throw new ParsingError(`Fighter name too short: ${parsed.name}`);
    }
    if (parsed.wins < 0 || parsed.losses < 0 || parsed.draws < 0) {
      throw new ParsingError(`Fighter records cannot be negative: ${parsed.name}`);
    }
  }

  private async saveToDatabase(fighters: ParsedFighter[]): Promise<void> {
    logger.info(`[${this.scraperName}] Upserting ${fighters.length} fighters to database...`);
    
    let savedCount = 0;
    const scrapedNames = new Set<string>();
    
    // Process in batches for performance
    for (const fighter of fighters) {
      scrapedNames.add(fighter.name);
      try {
        // Upsert by unique name field, ensuring isActive is true
        await prisma.fighter.upsert({
          where: { name: fighter.name },
          update: {
            age: fighter.age,
            height: fighter.height,
            reach: fighter.reach,
            weightClass: fighter.weightClass,
            wins: fighter.wins,
            losses: fighter.losses,
            draws: fighter.draws,
            isActive: true, // They appeared in the scrape, so they are active
          },
          create: {
            name: fighter.name,
            age: fighter.age,
            height: fighter.height,
            reach: fighter.reach,
            weightClass: fighter.weightClass,
            wins: fighter.wins,
            losses: fighter.losses,
            draws: fighter.draws,
            isActive: true,
          }
        });
        savedCount++;
      } catch (error) {
        logger.error(`[${this.scraperName}] Failed to save fighter: ${fighter.name}`, error);
      }
    }

    logger.info(`[${this.scraperName}] Successfully saved/updated ${savedCount} fighters.`);
    
    // Archiving Step
    // Fetch all fighters currently in the database
    const allFighters = await prisma.fighter.findMany({ select: { id: true, name: true, isActive: true } });
    
    let archivedCount = 0;
    for (const dbFighter of allFighters) {
      // If a fighter is currently active in the DB but wasn't in our scraped list, they are now inactive
      if (dbFighter.isActive && !scrapedNames.has(dbFighter.name)) {
        await prisma.fighter.update({
          where: { id: dbFighter.id },
          data: { isActive: false }
        });
        archivedCount++;
      }
    }
    
    if (archivedCount > 0) {
      logger.info(`[${this.scraperName}] Archived ${archivedCount} inactive fighters.`);
    }
  }
}
