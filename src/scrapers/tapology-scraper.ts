import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import * as cheerio from "cheerio";

export class TapologyScraper {
  private eventId: string;
  private eventName: string;
  private useMock: boolean;

  constructor(eventId: string, eventName: string, useMock: boolean = false) {
    this.eventId = eventId;
    this.eventName = eventName;
    this.useMock = useMock;
  }

  private getMockFights() {
    return [
      { f1: "Alex Pereira", f2: "Jamahal Hill", weightClass: "Light Heavyweight", isTitleFight: true, rounds: 5, cardSection: "Main Card" },
      { f1: "Zhang Weili", f2: "Yan Xiaonan", weightClass: "Strawweight", isTitleFight: true, rounds: 5, cardSection: "Main Card" },
      { f1: "Justin Gaethje", f2: "Max Holloway", weightClass: "Lightweight", isTitleFight: true, rounds: 5, cardSection: "Main Card" },
      { f1: "Charles Oliveira", f2: "Arman Tsarukyan", weightClass: "Lightweight", isTitleFight: false, rounds: 3, cardSection: "Main Card" },
      { f1: "Bo Nickal", f2: "Cody Brundage", weightClass: "Middleweight", isTitleFight: false, rounds: 3, cardSection: "Main Card" },
      { f1: "Jiri Prochazka", f2: "Aleksandar Rakic", weightClass: "Light Heavyweight", isTitleFight: false, rounds: 3, cardSection: "Prelims" },
      { f1: "Aljamain Sterling", f2: "Calvin Kattar", weightClass: "Featherweight", isTitleFight: false, rounds: 3, cardSection: "Prelims" },
      { f1: "Kayla Harrison", f2: "Holly Holm", weightClass: "Bantamweight", isTitleFight: false, rounds: 3, cardSection: "Prelims" },
      { f1: "Sodiq Yusuff", f2: "Diego Lopes", weightClass: "Featherweight", isTitleFight: false, rounds: 3, cardSection: "Prelims" },
      { f1: "Jalin Turner", f2: "Renato Moicano", weightClass: "Lightweight", isTitleFight: false, rounds: 3, cardSection: "Early Prelims" },
      { f1: "Jessica Andrade", f2: "Marina Rodriguez", weightClass: "Strawweight", isTitleFight: false, rounds: 3, cardSection: "Early Prelims" },
      { f1: "Bobby Green", f2: "Jim Miller", weightClass: "Lightweight", isTitleFight: false, rounds: 3, cardSection: "Early Prelims" },
      { f1: "Deiveson Figueiredo", f2: "Cody Garbrandt", weightClass: "Bantamweight", isTitleFight: false, rounds: 3, cardSection: "Early Prelims" }
    ];
  }

  private async searchTapologyEventViaDuckDuckGo(eventName: string): Promise<string | null> {
    const query = `site:tapology.com/fightcenter/events/ ${eventName}`;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) return null;
      const html = await response.text();
      const $ = cheerio.load(html);
      
      let eventPath = "";
      $('a.result__url, a[href*="/fightcenter/events/"]').each((_, el) => {
        const href = $(el).attr("href");
        if (href && !eventPath) {
          if (href.includes("tapology.com/fightcenter/events/")) {
            const match = href.match(/uddg=(https:\/\/www\.tapology\.com\/fightcenter\/events\/[a-zA-Z0-9-]+)/);
            if (match) {
              eventPath = decodeURIComponent(match[1]);
            } else if (href.startsWith("http")) {
              eventPath = href;
            }
          }
        }
      });
      return eventPath || null;
    } catch (error) {
      logger.error(`[TapologyScraper] DDG search fallback failed for ${eventName}`, error);
      return null;
    }
  }

  public async scrapeAndSave(): Promise<boolean> {
    logger.info(`[TapologyScraper] Starting scrape for event: "${this.eventName}" (Mock: ${this.useMock})`);

    if (this.useMock) {
      logger.info(`[TapologyScraper] Using mock fights for event: "${this.eventName}"`);
      const mockFights = this.getMockFights();
      await this.saveFightsToDb(mockFights);
      return true;
    }

    let eventPath = "";

    try {
      // 1. Search for event on Tapology (Direct Search)
      const searchUrl = `https://www.tapology.com/search?term=${encodeURIComponent(this.eventName)}&mainSearchFilter=events`;
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);

        // Find the first event link in the search results
        $('a[href*="/fightcenter/events/"]').each((_, el) => {
          const href = $(el).attr("href");
          if (href && !eventPath) {
            eventPath = href;
          }
        });
      } else {
        logger.warn(`[TapologyScraper] Direct search failed with status ${response.status}. Trying DuckDuckGo fallback...`);
      }

      // 2. DuckDuckGo Fallback if direct search failed or returned 0 results
      if (!eventPath) {
        const ddgPath = await this.searchTapologyEventViaDuckDuckGo(this.eventName);
        if (ddgPath) {
          eventPath = ddgPath;
        }
      }

      if (!eventPath) {
        logger.warn(`[TapologyScraper] No Tapology event link found for "${this.eventName}" after all search methods.`);
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
      let currentCardSection = "Main Card";

      // Select all bout elements and section headers in DOM order
      const elements = $event('.section-bouts li, ul.sectionBouts li, ul.bouts li, .bout-row, .bout-card, .bout, .sectionHeader');

      elements.each((_, el) => {
        const $el = $event(el);
        const text = $el.text().trim().toLowerCase();

        // Check if this element defines a card section header
        if ($el.hasClass('sectionHeader') || text.includes('main card') || text.includes('preliminary card') || text.includes('early prelims') || text.includes('undercard')) {
          if (text.includes('main')) {
            currentCardSection = "Main Card";
          } else if (text.includes('early')) {
            currentCardSection = "Early Prelims";
          } else if (text.includes('prelim') || text.includes('undercard')) {
            currentCardSection = "Prelims";
          }
          return;
        }

        // Parse bout row
        const fighterLinks = $el.find('a[href*="/fighters/"]');
        if (fighterLinks.length === 2) {
          const f1Name = $event(fighterLinks[0]).text().trim();
          const f2Name = $event(fighterLinks[1]).text().trim();

          if (f1Name && f2Name && f1Name !== f2Name) {
            // Avoid duplicate additions
            if (parsedFights.some(f => (f.f1 === f1Name && f.f2 === f2Name) || (f.f1 === f2Name && f.f2 === f1Name))) {
              return;
            }

            const textContent = $el.text().toLowerCase();
            const isTitleFight = textContent.includes("title bout") || textContent.includes("championship") || textContent.includes("title fight");
            
            let weightClass = "Catchweight";
            const wcMatch = textContent.match(/(heavyweight|light heavyweight|middleweight|welterweight|lightweight|featherweight|bantamweight|flyweight|strawweight)/i);
            if (wcMatch) {
              weightClass = wcMatch[1].charAt(0).toUpperCase() + wcMatch[1].slice(1);
            }

            // Main event is the first fight on the card (top-most in DOM order)
            const isMainEvent = parsedFights.length === 0;
            const rounds = (isTitleFight || isMainEvent) ? 5 : 3;

            parsedFights.push({
              f1: f1Name,
              f2: f2Name,
              weightClass,
              isTitleFight,
              rounds,
              cardSection: currentCardSection
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
    const activeFightIds = new Set<string>();

    for (const fight of fights) {
      const f1 = await this.upsertFighter(fight.f1, fight.weightClass);
      const f2 = await this.upsertFighter(fight.f2, fight.weightClass);

      const existing = await prisma.fight.findFirst({
        where: {
          eventId: this.eventId,
          OR: [
            { fighter1Id: f1.id, fighter2Id: f2.id },
            { fighter1Id: f2.id, fighter2Id: f1.id }
          ]
        }
      });

      if (existing) {
        const updated = await prisma.fight.update({
          where: { id: existing.id },
          data: {
            fighter1Id: f1.id,
            fighter2Id: f2.id,
            weightClass: fight.weightClass,
            isTitleFight: fight.isTitleFight,
            rounds: fight.rounds
          }
        });
        activeFightIds.add(updated.id);
      } else {
        const created = await prisma.fight.create({
          data: {
            eventId: this.eventId,
            fighter1Id: f1.id,
            fighter2Id: f2.id,
            weightClass: fight.weightClass,
            isTitleFight: fight.isTitleFight,
            rounds: fight.rounds
          }
        });
        activeFightIds.add(created.id);
      }
    }

    // Purge any fights for this event that are no longer part of the official card
    await prisma.fight.deleteMany({
      where: {
        eventId: this.eventId,
        id: { notIn: Array.from(activeFightIds) }
      }
    });
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
          eloRating: 1300,
          isActive: true
        }
      });
    }
    return fighter;
  }
}
