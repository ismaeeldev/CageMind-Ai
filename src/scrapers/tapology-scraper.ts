import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import * as cheerio from "cheerio";

export class TapologyScraper {
  private eventId: string;
  private eventName: string;

  constructor(eventId: string, eventName: string) {
    this.eventId = eventId;
    this.eventName = eventName;
  }

  public async scrapeAndSave(): Promise<boolean> {
    logger.info(`[TapologyScraper] Starting scrape for event: "${this.eventName}"`);

    try {
      // 1. Search for event on Tapology
      const searchUrl = `https://www.tapology.com/search?term=${encodeURIComponent(this.eventName)}&mainSearchFilter=events`;
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`Failed to search event on Tapology. Status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Find the first event link in the search results
      let eventPath = "";
      $('a[href*="/fightcenter/events/"]').each((_, el) => {
        const href = $(el).attr("href");
        if (href && !eventPath) {
          eventPath = href;
        }
      });

      if (!eventPath) {
        logger.warn(`[TapologyScraper] No Tapology event link found for "${this.eventName}"`);
        return false;
      }

      const eventUrl = eventPath.startsWith("http") ? eventPath : `https://www.tapology.com${eventPath}`;
      logger.info(`[TapologyScraper] Found event URL: ${eventUrl}`);

      // 2. Fetch the event page
      const eventResponse = await fetch(eventUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!eventResponse.ok) {
        throw new Error(`Failed to fetch event page from Tapology. Status: ${eventResponse.status}`);
      }

      const eventHtml = await eventResponse.text();
      const $event = cheerio.load(eventHtml);

      const parsedFights: any[] = [];

      // Find all bout elements / containers
      // On Tapology, each fight card entry contains links to two fighters
      $event('li, tr, div').each((i, el) => {
        const fighterLinks = $event(el).find('a[href*="/fighters/"]');
        // A bout row typically links to exactly 2 fighters
        if (fighterLinks.length === 2) {
          const f1Name = $event(fighterLinks[0]).text().trim();
          const f2Name = $event(fighterLinks[1]).text().trim();

          if (f1Name && f2Name && f1Name !== f2Name) {
            // Avoid duplicate additions
            if (parsedFights.some(f => (f.f1 === f1Name && f.f2 === f2Name) || (f.f1 === f2Name && f.f2 === f1Name))) {
              return;
            }

            // Extract weight class/bout info if available in siblings
            const text = $event(el).text().toLowerCase();
            const isTitleFight = text.includes("title bout") || text.includes("championship");
            
            let weightClass = "Catchweight";
            const wcMatch = text.match(/(heavyweight|light heavyweight|middleweight|welterweight|lightweight|featherweight|bantamweight|flyweight|strawweight)/i);
            if (wcMatch) {
              weightClass = wcMatch[1].charAt(0).toUpperCase() + wcMatch[1].slice(1);
            }

            // Estimate card order / main card status
            // Top bouts on the page are usually the Main Card
            const isMainCard = parsedFights.length < 5;

            parsedFights.push({
              f1: f1Name,
              f2: f2Name,
              weightClass,
              isTitleFight,
              isMainCard
            });
          }
        }
      });

      if (parsedFights.length === 0) {
        logger.warn(`[TapologyScraper] Scraped 0 fights from event page.`);
        return false;
      }

      logger.info(`[TapologyScraper] Successfully scraped ${parsedFights.length} fights from Tapology. Saving to database...`);
      await this.saveFightsToDb(parsedFights);
      return true;
    } catch (error) {
      logger.error(`[TapologyScraper] Failed to scrape Tapology:`, error);
      return false;
    }
  }

  private async saveFightsToDb(fights: any[]): Promise<void> {
    for (const fight of fights) {
      // 1. Ensure/upsert fighters exist
      const f1 = await this.upsertFighter(fight.f1, fight.weightClass);
      const f2 = await this.upsertFighter(fight.f2, fight.weightClass);

      // 2. Create fight if not exists
      const existing = await prisma.fight.findFirst({
        where: {
          eventId: this.eventId,
          OR: [
            { fighter1Id: f1.id, fighter2Id: f2.id },
            { fighter1Id: f2.id, fighter2Id: f1.id }
          ]
        }
      });

      if (!existing) {
        await prisma.fight.create({
          data: {
            eventId: this.eventId,
            fighter1Id: f1.id,
            fighter2Id: f2.id,
            weightClass: fight.weightClass,
            isTitleFight: fight.isTitleFight,
            rounds: fight.isTitleFight ? 5 : 3
          }
        });
      }
    }
  }

  private async upsertFighter(name: string, weightClass: string) {
    let fighter = await prisma.fighter.findFirst({
      where: { name: { equals: name, mode: "insensitive" } }
    });

    if (!fighter) {
      fighter = await prisma.fighter.create({
        data: {
          name,
          weightClass,
          eloRating: 1500,
          isActive: true
        }
      });
    }
    return fighter;
  }
}
