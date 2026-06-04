import * as cheerio from "cheerio";
import { RawFight } from "../fight-card-scraper";
import { logger } from "@/lib/logger";

export class UfcFightParser {
  public parse(html: string, eventId: string): RawFight[] {
    const $ = cheerio.load(html);
    const fights: RawFight[] = [];

    // Broaden search to ensure we catch all prelims and early prelims across different site layouts
    const fightCards = $('.c-listing-fight, .c-listing-matchup, .fight-card, li.l-listing__item, tr[itemprop="subEvent"], .fightCardBout, .b-fight-details__table-row, .l-listing__item');
    
    logger.debug(`[UfcFightParser] Found ${fightCards.length} potential fights in HTML`);

    fightCards.each((i, el) => {
      const $el = $(el);
      
      let f1NameEl = $el.find('.c-listing-fight__corner-name--red, .c-listing-matchup__corner-name--red, .details-content__name--red').first();
      let f2NameEl = $el.find('.c-listing-fight__corner-name--blue, .c-listing-matchup__corner-name--blue, .details-content__name--blue').first();
      
      if (f1NameEl.length === 0 || f2NameEl.length === 0) {
        const cornerNames = $el.find('.c-listing-fight__corner-name, .c-listing-matchup__corner-name, .b-fight-details__table-text, .fighter-name');
        if (cornerNames.length >= 2) {
          f1NameEl = $(cornerNames[0]);
          f2NameEl = $(cornerNames[1]);
        }
      }
      
      const fighter1Name = f1NameEl.text().trim().replace(/\s+/g, ' ');
      const fighter2Name = f2NameEl.text().trim().replace(/\s+/g, ' ');
      
      const fighter1UfcId = f1NameEl.closest('a').attr('href') || f1NameEl.find('a').attr('href') || null;
      const fighter2UfcId = f2NameEl.closest('a').attr('href') || f2NameEl.find('a').attr('href') || null;

      const weightClass = $el.find('.c-listing-fight__class-text, .c-listing-fight__class, .weight-class, .b-fight-details__table-text:eq(6)').first().text().trim();
      
      const isMainCard = $el.closest('.main-card, #main-card, .c-listing-fight--main-card').length > 0 || i < 5;
      const isTitleFight = $el.find('.c-listing-fight__title-bout, .title-bout, img[src*="belt"]').length > 0 || weightClass.toLowerCase().includes('title');

      if (fighter1Name && fighter2Name && fighter1Name !== fighter2Name && fighter1Name !== "Fighter" && fighter2Name !== "Fighter") {
        const f1Won = $el.find('.c-listing-fight__corner--red .c-listing-fight__outcome--win, .c-listing-matchup__corner--red .c-listing-matchup__outcome--win, .b-fight-details__table-text:contains("W")').first().length > 0;
        const f2Won = $el.find('.c-listing-fight__corner--blue .c-listing-fight__outcome--win, .c-listing-matchup__corner--blue .c-listing-matchup__outcome--win').length > 0;
        
        let winnerName: string | null = null;
        // If parsing a completed row that explicitly marks winner
        if (f1Won && !f2Won) winnerName = fighter1Name;
        if (f2Won && !f1Won) winnerName = fighter2Name;

        let method: string | null = null;
        let endingRound: number | null = null;
        let endingTime: string | null = null;

        $el.find('.c-listing-fight__result').each((_, resEl) => {
          const label = $(resEl).find('.c-listing-fight__result-label').text().trim().toLowerCase();
          const val = $(resEl).find('.c-listing-fight__result-text').text().trim();
          if (label === 'method') method = val;
          if (label === 'round') endingRound = parseInt(val, 10) || null;
          if (label === 'time') endingTime = val;
        });

        fights.push({
          eventId,
          fighter1Name,
          fighter2Name,
          fighter1UfcId,
          fighter2UfcId,
          weightClass: weightClass || "Catchweight",
          isMainCard,
          isTitleFight,
          winnerName,
          method,
          endingRound,
          endingTime
        });
      }
    });

    if (fights.length === 0) {
      logger.warn("[UfcFightParser] Could not find specific fight classes. Attempting fallback text parsing...");
      
      $('h4, h3, strong').each((i, el) => {
        const text = $(el).text().trim();
        if (text.toLowerCase().includes(' vs ') || text.toLowerCase().includes(' vs. ')) {
          const parts = text.split(/ vs\.? /i);
          if (parts.length === 2 && parts[0].length > 2 && parts[1].length > 2) {
             fights.push({
               eventId,
               fighter1Name: parts[0].trim(),
               fighter2Name: parts[1].trim(),
               fighter1UfcId: null,
               fighter2UfcId: null,
               weightClass: "TBD",
               isMainCard: i < 5,
               isTitleFight: false,
             });
          }
        }
      });
    }

    return fights;
  }
}
