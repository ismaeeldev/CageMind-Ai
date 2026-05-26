import { BaseScraper } from "./base-scraper";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
import { UfcSourceAdapter } from "./adapters/ufc-source-adapter";
import { UfcEventParser } from "./parsers/ufc-event-parser";
import { UfcEventValidator } from "./validators/ufc-event-validator";

export interface RawUfcEvent {
  title: string;
  eventDate: string;
  venue?: string;
  status: string;
}

export interface ParsedUfcEvent {
  name: string;
  date: Date;
  location: string | null;
  isUpcoming: boolean;
}

export class UfcEventScraper extends BaseScraper<ParsedUfcEvent[]> {
  private useMock: boolean;
  private adapter: UfcSourceAdapter;
  private parser: UfcEventParser;
  private validator: UfcEventValidator;

  constructor(useMock: boolean = false) {
    super("UfcEventScraper", { maxRetries: 3, delayBetweenRequestsMs: 2000 });
    this.useMock = useMock;
    this.adapter = new UfcSourceAdapter();
    this.parser = new UfcEventParser();
    this.validator = new UfcEventValidator();
  }

  protected async execute(): Promise<ParsedUfcEvent[]> {
    logger.info(`[${this.scraperName}] Starting execution. Mock mode: ${this.useMock}`);

    let rawData: RawUfcEvent[] = [];

    // A. Fetch
    try {
      if (this.useMock) {
        logger.debug(`[${this.scraperName}] Using mock data.`);
        rawData = this.getMockData();
      } else {
        const html = await this.adapter.fetchHtml();
        rawData = this.parser.parse(html);
      }
    } catch (error) {
      logger.error(`[${this.scraperName}] Failed to fetch or parse data`, error);
      throw error; // Let BaseScraper handle retries for network errors
    }

    if (rawData.length === 0) {
      logger.warn(`[${this.scraperName}] Scraper returned 0 events.`);
      return [];
    }

    // B. Validate
    const parsedEvents: ParsedUfcEvent[] = [];
    for (const raw of rawData) {
      try {
        const parsed = this.validator.validateAndTransform(raw);
        parsedEvents.push(parsed);
      } catch (error) {
        logger.warn(`[${this.scraperName}] Skipping invalid event: ${raw.title}`, { error });
      }
    }

    // C. Store
    try {
      await this.saveToDatabase(parsedEvents);
    } catch (error) {
       logger.error(`[${this.scraperName}] Database save failed completely.`, error);
       // We log but do not crash the app. The BaseScraper wraps this in a try-catch anyway.
       throw error; 
    }

    return parsedEvents;
  }

  private async saveToDatabase(events: ParsedUfcEvent[]): Promise<void> {
    logger.info(`[${this.scraperName}] Saving ${events.length} events to database...`);
    
    let savedCount = 0;
    for (const event of events) {
      try {
        const existing = await prisma.event.findFirst({
          where: { name: event.name }
        });

        if (existing) {
          await prisma.event.update({
            where: { id: existing.id },
            data: {
              date: event.date,
              location: event.location,
              isUpcoming: event.isUpcoming
            }
          });
          logger.debug(`[${this.scraperName}] Updated event: ${event.name}`);
        } else {
          await prisma.event.create({
            data: {
              name: event.name,
              date: event.date,
              location: event.location,
              isUpcoming: event.isUpcoming
            }
          });
          logger.debug(`[${this.scraperName}] Created new event: ${event.name}`);
        }
        savedCount++;
      } catch (error) {
        logger.error(`[${this.scraperName}] Failed to save event: ${event.name}`, error);
      }
    }

    logger.info(`[${this.scraperName}] Successfully saved/updated ${savedCount} events in the database.`);
  }

  private getMockData(): RawUfcEvent[] {
    return [
      {
        title: "UFC 305: Du Plessis vs. Adesanya",
        eventDate: "2024-08-17T22:00:00.000Z",
        venue: "RAC Arena, Perth, Australia",
        status: "upcoming"
      }
    ];
  }
}
