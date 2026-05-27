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
    logger.info(`[${this.scraperName}] Saving ${events.length} events to database via transaction...`);
    
    try {
      const eventNames = events.map(e => e.name);
      
      // Fetch all existing events in one query
      const existingEvents = await prisma.event.findMany({
        where: { name: { in: eventNames } }
      });
      
      const existingMap = new Map(existingEvents.map(e => [e.name, e.id]));
      const operations = [];

      for (const event of events) {
        const existingId = existingMap.get(event.name);

        if (existingId) {
          operations.push(
            prisma.event.update({
              where: { id: existingId },
              data: {
                date: event.date,
                location: event.location,
                isUpcoming: event.isUpcoming
              }
            })
          );
        } else {
          operations.push(
            prisma.event.create({
              data: {
                name: event.name,
                date: event.date,
                location: event.location,
                isUpcoming: event.isUpcoming
              }
            })
          );
        }
      }

      await prisma.$transaction(operations, { timeout: 30000 });
      logger.info(`[${this.scraperName}] Successfully saved/updated ${events.length} events in the database.`);
    } catch (error) {
      logger.error(`[${this.scraperName}] Database save transaction failed completely.`, error);
      throw error;
    }
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
