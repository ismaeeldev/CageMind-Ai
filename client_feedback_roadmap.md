# Client Feedback & Implementation Roadmap

This document captures the analysis, problem breakdown, root causes, proposed solutions, and verification/test cases for the latest batch of client feedback.

---

## 1. Fighter Status (Active vs. Retired)

### Problem Description
Some fighters are correctly showing as "Retired" (inactive) in the directory, but the majority of retired fighters are incorrectly appearing as "Active".

### Root Cause Analysis
1. **Fighter Scraper Incompleteness**: In `FighterScraper` (`src/scrapers/fighter-scraper.ts`), fighters are scraped from `https://www.ufc.com/athletes/all`. If a fighter is no longer on the active roster, they are omitted from the scraped list.
2. **Archiving Logic Limitation**: The scraper marks missing fighters as inactive using:
   ```typescript
   prisma.fighter.updateMany({
     where: {
       isActive: true,
       ufcId: { notIn: Array.from(scrapedIds), not: null }
     },
     data: { isActive: false }
   });
   ```
   If a fighter in the database does not have a `ufcId` (which happens for fighters imported via the event or fight-card scrapers, or past event logs), their `ufcId` is `null`. They are excluded from this archiving step and remain marked as `isActive: true` indefinitely.
3. **No Tapology Status Scrape**: The `TapologyScraper` and database seeding defaults new fighters to `isActive: true` without validating their actual career status.

### Proposed Solution
1. **Enhance Archiving Rule**: Update the archiving query to flag fighters as inactive if they are missing from the scraped list *or* if they haven't had a fight in a long time (e.g., 2+ years).
2. **Scrape Tapology Career Status**: When importing or scraping fight cards, query the fighter's Tapology profile and parse the "Status" field (e.g., "Retired", "Active", "Discharged").
3. **Admin Status Synchronization Tool**: Provide a script `sync-fighter-status.ts` to scan the database and update `isActive` based on fight history and Tapology profile scraping.

### Verification / Test Case
* **Unit Test**: A script `tests/test-fighter-status.ts` that inserts a mock retired fighter (e.g., "Khabib Nurmagomedov" with no active fights or marked as retired) and verifies the status synchronization correctly flags them as `isActive: false`.

---

## 2. ELO Engine: UFC Entry Rating & Fight Exclusivity

### Problem Description
Fighters entering the UFC should start with a baseline ELO rating of exactly `1300` points. They should only gain or lose ELO points in UFC fights, while non-UFC fights should result in a `0` ELO change.

### Root Cause Analysis
1. **Initial Seeding**: In `src/lib/elo.ts`, `seedElo` calculates ratings based on career records (wins/losses/age), seeding them around 1450.
2. **Non-UFC Weighting**: In `calculateEloDelta` (`src/lib/elo.ts`), non-UFC fights currently have a 1.0x impact:
   ```typescript
   if (outcome.isUFCFight) {
     dA = Math.round(dA * 2.0);
   } else {
     dA = Math.round(dA * 1.0);
   }
   ```
   This shifts ratings for non-UFC matches, violating the ufc-only ELO progression requirement.

### Proposed Solution
1. **Reset Starting ELO**: Modify `seedElo` to return exactly `1300`. Update the Prisma schema `Fighter` model default value for `eloRating` from `1500` to `1300`.
2. **UFC Exclusive Shifts**: Modify `calculateEloDelta` in `src/lib/elo.ts` to return `0` if `outcome.isUFCFight` is false.
3. **Recalculation**: Run `recalculateAllElo` chronologically to rebuild the ELO history from the new 1300 baseline.

### Verification / Test Case
* **ELO Test Script**: Run `tests/test-elo-ufc.ts` to verify:
  * A fighter's initial rating is 1300.
  * A UFC fight modifies the ratings of both fighters (underdog/finish bonuses active).
  * A non-UFC fight returns a delta of exactly `0` for both fighters.

---

## 3. Scraper: Tapology Fightcenter Card Ingestion

### Problem Description
The events page currently loads a disorganized mix of fights instead of the true main card, prelims, and early prelims.

### Root Cause Analysis
1. **Parsing Heuristics**: `TapologyScraper` (`src/scrapers/tapology-scraper.ts`) parses the event page using generic cheerio queries (`$event('li, tr, div')`) which grabs unrelated sidebar matches, promotions, or advertisements.
2. **Lack of Card Sections**: It does not split the card into "Main Card", "Preliminary Card", and "Early Prelims".

### Proposed Solution
1. **Target Tapology Card Selectors**: Rewrite the parser to scrape from the specific list container on Tapology's fightcenter pages (e.g., `.section-bouts`, `.bout-row`, `.bout-card`).
2. **Order Preservation**: Follow the exact DOM order from top to bottom (which represents Main Event down to Early Prelims).
3. **Past Card Backfill**: Create a script `backfill-past-cards.ts` to re-scrape and overwrite incorrect fight rosters for completed events.

### Verification / Test Case
* **Scraper Test**: Run `tests/test-tapology-scraper.ts` on a specific event page (e.g., UFC 300) and assert that:
  * The total number of fights matches the official count.
  * The main card fights appear at the top.
  * No unrelated fights are imported.

---

## 4. Fight Card Details (Title Bouts, Fight Nights & Round Count)

### Problem Description
1. Sean O'Malley vs. Aieman Zahabi disappeared from UFC 250.
2. Belal Muhammad vs. Gabriel Bonfim was incorrectly labeled as a title fight.
3. Fight Night main events are incorrectly marked as title fights, even though they should just be 5-round non-title fights.

### Root Cause Analysis
1. **Missing Fighters / Merges**: Name mismatches (e.g., "Aieman Zahabi" or "Sean O'Malley") cause validation to drop fights if name mappings fail.
2. **Title Heuristic**: The current parser flags any 5-round fight or main event as a title bout if `rounds === 5` or if it's the main event. It fails to distinguish between a "5-round Main Event" and a "Championship Title Bout".

### Proposed Solution
1. **Tapology Title Flag**: Parse the title bout text specifically from the bout row headers on Tapology (e.g., check for the presence of "Title", "Championship", or "UFC Belt").
2. **Round Logic**:
   * Explicitly set `rounds = 5` for any Main Event (the first/top fight on the card) and Title Bouts.
   * Ensure `isTitleFight = false` for non-title main events.
3. **Aliases Dictionary**: Expand name matching aliases in `FightCardScraper` to handle accent marks and minor spelling changes.

### Verification / Test Case
* **Bout Assertions**: Run a verification script that checks specific fights in the database:
  * Assert "Belal Muhammad vs. Gabriel Bonfim" is `isTitleFight: false`.
  * Assert Fight Night main events have `rounds: 5` and `isTitleFight: false`.

---

## 5. Past Events & Statistics Processing

### Problem Description
Past events are missing from the "Past Events" tab, and metrics/statistics (predictions count, correct picks, ELO performance) are not fully updated.

### Root Cause Analysis
1. **Scraper Pipeline Gap**: Scraped events are stored as upcoming, but when they occur, they are not marked as completed with results unless manually processed.
2. **Missing Card Details**: Past events in the DB have incomplete fight cards (only 1-2 fights instead of the full card).

### Proposed Solution
1. **Post-Event Processing Pipeline**: Run the scraper to fetch completed card results (including methods of victory, ending rounds, and winner IDs) and apply ELO adjustments.
2. **Stats Update Job**: Run a script to aggregate stats (ROI, Win Rate, total prediction counts) and update the `PastEvent` dashboard state.

### Verification / Test Case
* **Pipeline Run**: Execute `src/jobs/post-event-processor.ts` locally and verify that ROI and correct picks percentages update in the database.

---

## 6. Past Events: ROI Formula Correction

### Problem Description
The ROI (Return on Investment) calculation on the Past Events tab does not load or calculate correctly.

### Root Cause Analysis
1. **ROI Formula**: ROI is calculated as `(Net Profit / Total Wagered) * 100`.
2. **Null Values**: If odds are null or predictions don't match, division by zero or NaN values creep in, causing the calculation to fail on the frontend.

### Proposed Solution
1. **Safe ROI Utility**: Implement a robust calculation helper that defaults to `0` when wagers are zero and handles both positive/negative moneyline math correctly.
2. **Database Schema Enforcement**: Ensure all calculated metrics are stored as floats/decimals instead of raw unparsed strings.

### Verification / Test Case
* **Math Validation**: Run `tests/test-roi.ts` to verify ROI computations against static predictions and actual fight results.

---

## 7. Past Events Interactivity (Prediction Details view)

### Problem Description
Users cannot click on past events to see what predictions were made and compare them to actual outcomes.

### Root Cause Analysis
1. **Static UI List**: The past events UI is a static display with no click/details navigation drawer or modal implemented.

### Proposed Solution
1. **Interactive Modal/Accordion**: Add a click trigger to each past event row that opens a slide-over drawer or modal showing:
   * Every fight on the card.
   * The AI-predicted winner and confidence percentage.
   * The actual fight winner and method of finish.
   * The outcome status (e.g. Correct / Incorrect / Value Won).

### Verification / Test Case
* **UI Walkthrough**: Perform a manual walkthrough on the past events page, clicking a card, verifying the modal opens, and confirming predictions are detailed correctly.
