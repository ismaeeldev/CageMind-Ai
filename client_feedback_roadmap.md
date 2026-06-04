# Client Feedback & Roadmap

This document outlines the client's latest feedback points and the proposed technical solutions for each.

## 1. Rankings & Elo Engine Enhancements
**Feedback:** Change the Elo engine to favor UFC fights over non-UFC fights. Factor in major upsets and undefeated status more heavily. On the Rankings tab, fix broken photos, make fighters clickable to their profile, and add a sort/filter for retired vs. current fighters.
**Solution:**
- **Elo Engine:** Update `src/lib/elo.ts` to include a `promotionWeight` multiplier (e.g., 1.5x for UFC). Introduce an `upsetMultiplier` based on pre-fight odds/Elo diff, and an `undefeatedBonus` for fighters with 0 losses.
- **Rankings UI:** Fix the image rendering logic in the Rankings table. Wrap each row in a `<Link href="/fighters/[id]">`. Add a state toggle to filter by `status === "active"` or `"retired"`.

## 2. Fighter Duplication Sweep
**Feedback:** Fix duplicates of fighters (e.g., Belal Muhammad, Ilia Topuria, Alex Pereira) that cause the wrong card to appear in events and predictions.
**Solution:** 
- Write a database migration/deduplication script (`scripts/dedupe-fighters.ts`).
- The script will identify duplicate names (using fuzzy matching/normalization), merge their `Fight` relations to the canonical ID (the one with the most data or highest Elo), and delete the duplicates.

## 3. Full Event Card Scraping
**Feedback:** Upcoming events only show the main event (except UFC Freedom 250). Need full prelims, early prelims, and main card.
**Solution:** 
- Update the `FightCardScraper` logic. Currently, it might be halting after the featured bout or failing to parse the HTML structure of the lower card. Ensure it iterates through the entire fight list on the source page (UFC.com or Tapology) and saves all bouts.

## 4. Prediction Engine Logic Adjustments
**Feedback:** Decisions should not predict a round. The engine needs to know that main events and title fights are 5 rounds, not 3.
**Solution:** 
- Update the prediction parsing logic: if `predictedMethod === "DEC"`, strip out any predicted round data.
- Update the prompt or the frontend calculation to pass `isTitleFight` and `isMainEvent` flags to the AI, explicitly stating a 5-round maximum.

## 5. Incorrect Fighter Names & Scraper Duplicates
**Feedback:** Manuel Torres is listed as Eduardo Matias Torres. Make sure the AI/scraper checks things and doesn't create duplicates.
**Solution:** 
- Manually update the existing incorrect record in the database.
- Improve the scraper's upsert logic. Instead of just matching by exact string, normalize names (remove accents, lowercase) or use a unique source ID (like a Tapology ID) to prevent creating new records for slight name variations.

## 6. Live Odds Integration
**Feedback:** Odds show as N/A. Pull real odds from FanDuel/major sportsbooks and add them to the Edge Finder and Parlay Builder.
**Solution:** 
- Integrate an external odds API (like The-Odds-API) into a daily cron job.
- Map the odds to the corresponding `eventId` and `fighterId` in our database.
- Feed these live odds into the prediction engine, edge finder, and parlay builder.

## 7. Relocate Parlay Builder
**Feedback:** Move the parlay builder into the predictions tab as a clickable tab.
**Solution:** 
- Extract the `ParlayBuilder` component and integrate it into `/predictions/page.tsx` using a tabbed layout (e.g., "AI Predictions" | "Parlay Builder").

## 8. Reset Back-Tested Results & Rename Tab
**Feedback:** Remove back-tested results, reset statistics, rename the tab to "Past Event Results". Add new events automatically.
**Solution:** 
- Clear the `PerformanceRecord` table in the database to wipe old backtests.
- Rename the `/performance` route/UI to "Past Event Results".
- Set up a post-event cron job that evaluates the AI's picks against the actual results, calculates ROI and accuracy, and inserts a new record into the database.

## 9. Parlay Builder "Copy to Sportsbook"
**Feedback:** The copy button does nothing. Make it copy to a sportsbook.
**Solution:** 
- Since deep-linking directly into a specific bet slip (like FanDuel) can be complex and fragile, the most robust solution is to generate a formatted text summary of the parlay to the user's clipboard, or use a universal affiliate link generator if available.

## 10. Fix Spider Charts on Events Tab
**Feedback:** The spider charts for fights do not work.
**Solution:** 
- Debug the `FighterSpiderChart` component. Ensure that the radar chart library (likely Recharts) isn't crashing due to `null` or `undefined` physical attributes (reach, height, etc.). Add fallback values or conditional rendering.

## 11. Paywall the Full Events Tab
**Feedback:** Make the full events tab fall under the paywall.
**Solution:** 
- In `/events/page.tsx` and `/events/[id]/page.tsx`, use `getServerSession` to check if the user is premium.
- If not premium, only show a limited view (e.g., past events only, or just the main event) and render a premium locked overlay for the rest of the page.

## 12. PWA/Web App Top Bar Clickability
**Feedback:** The menu button in the top right is not clickable because it sits behind the iOS/Android device status bar (time and battery).
**Solution:** 
- Add CSS safe-area-inset padding to the top navbar. In Tailwind, this can be achieved by adding `pt-[env(safe-area-inset-top)]` to the main header container, ensuring the menu button is pushed down into the interactive safe zone.
