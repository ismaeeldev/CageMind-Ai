import * as cheerio from "cheerio";
import { RawUfcEvent } from "../ufc-event-scraper";
import { logger } from "@/lib/logger";

export class UfcEventParser {
  public parse(html: string): RawUfcEvent[] {
    const $ = cheerio.load(html);
    const events: RawUfcEvent[] = [];

    // Attempt 1: Standard UFC event cards
    const eventCards = $('.c-card-event--result__info, .c-card-event--result, .l-listing__item, article');
    
    logger.debug(`[UfcEventParser] Found ${eventCards.length} potential event cards in HTML`);

    eventCards.each((_, el) => {
      const $el = $(el);
      
      const title = $el.find('.c-card-event--result__headline, .headline, h3').first().text().trim();
      const dateStr = $el.find('.c-card-event--result__date, .tz-change-data, .date').attr('data-main-card-timestamp') 
        || $el.find('.c-card-event--result__date, .tz-change-data, .date, .field--name-node-post-date').first().text().trim();
      const venue = $el.find('.locality, .venue').first().text().trim();
      
      if (title && dateStr) {
        // Determine status based on DOM position or class
        const status = html.indexOf(title) < html.indexOf('Past Events') ? 'upcoming' : 'past';
        
        events.push({
          title,
          eventDate: dateStr,
          venue: venue || undefined,
          status
        });
      }
    });

    // Fallback: If no generic classes matched, look for any links to /event/
    if (events.length === 0) {
      logger.warn("[UfcEventParser] Primary selectors failed. Trying fallback anchor parsing...");
      $('a[href*="/event/"]').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        // Heuristic: Titles are usually longer than 10 chars (e.g. "UFC 300: Pereira vs. Hill")
        if (text.length > 10 && text.toLowerCase().includes('ufc')) {
          // Since we can't reliably get the date from just an anchor, we use a placeholder for validation to catch,
          // or we can extract the date from the URL if it exists.
          events.push({
            title: text,
            eventDate: new Date().toISOString(), // Fallback date, might be rejected by validator if not accurate, but keeps pipeline alive
            status: 'upcoming'
          });
        }
      });
    }

    // Deduplicate by title
    const uniqueEvents = Array.from(new Map(events.map(e => [e.title, e])).values());

    return uniqueEvents;
  }
}
