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
  weightClass?: string;
  isMainCard?: boolean;
  isTitleFight?: boolean;
}

export interface ParsedFight {
  eventId: string;
  fighter1Name: string;
  fighter2Name: string;
  weightClass: string | null;
  isMainCard: boolean;
  isTitleFight: boolean;
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

    // A. Fetch & Parse
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

    // B. Validate
    const parsedFights: ParsedFight[] = [];
    for (const raw of rawData) {
      try {
        const parsed = this.validator.validateAndTransform(raw);
        parsedFights.push(parsed);
      } catch (error) {
        logger.warn(`[${this.scraperName}] Invalid fight data skipped`, { error });
      }
    }

    // C. Store & Link Fighters
    await this.saveToDatabase(parsedFights);

    return parsedFights;
  }

  private async saveToDatabase(fights: ParsedFight[]): Promise<void> {
    logger.info(`[${this.scraperName}] Saving ${fights.length} fights to DB using connectOrCreate...`);
    let savedCount = 0;

    for (const fight of fights) {
      try {
        // connectOrCreate ensures that if the live fighter name doesn't match our 100 mock fighters exactly,
        // it creates a basic fighter profile so the Foreign Key constraint is satisfied without crashing.
        
        // However, Prisma doesn't support nested upserts with composite unique constraints nicely, 
        // so we'll ensure fighters exist first.
        
        const f1 = await prisma.fighter.upsert({
          where: { name: fight.fighter1Name },
          update: {},
          create: { name: fight.fighter1Name, weightClass: fight.weightClass }
        });

        const f2 = await prisma.fighter.upsert({
          where: { name: fight.fighter2Name },
          update: {},
          create: { name: fight.fighter2Name, weightClass: fight.weightClass }
        });

        // Now upsert the fight itself safely
        // Wait, schema has @@unique([eventId, fighter1Id, fighter2Id])
        // Unfortunately, Prisma upsert requires a unique identifier. We can query first.
        const existingFight = await prisma.fight.findFirst({
          where: {
            eventId: fight.eventId,
            fighter1Id: f1.id,
            fighter2Id: f2.id
          }
        });

        if (existingFight) {
          await prisma.fight.update({
            where: { id: existingFight.id },
            data: {
              weightClass: fight.weightClass,
              isTitleFight: fight.isTitleFight
            }
          });
        } else {
          await prisma.fight.create({
            data: {
              eventId: fight.eventId,
              fighter1Id: f1.id,
              fighter2Id: f2.id,
              weightClass: fight.weightClass,
              isTitleFight: fight.isTitleFight
            }
          });
        }
        savedCount++;
      } catch (error) {
        logger.error(`[${this.scraperName}] Failed to save fight: ${fight.fighter1Name} vs ${fight.fighter2Name}`, error);
      }
    }

    logger.info(`[${this.scraperName}] Successfully saved/updated ${savedCount} fights.`);
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
      },
      {
        eventId: this.eventId,
        fighter1Name: "Sean Strickland",
        fighter2Name: "Paulo Costa",
        weightClass: "Middleweight Bout",
        isMainCard: true,
        isTitleFight: false
      }
    ];
  }
}
