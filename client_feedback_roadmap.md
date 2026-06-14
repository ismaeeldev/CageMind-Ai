# CageMind AI - Client Feedback Implementation Roadmap

This document outlines a detailed, point-by-point plan to address the latest client feedback across all components of the application. No modifications are implemented yet; this serves as a blueprint for the next phase.

---

## 1. Active Fighters Showing Up as Retired

### Problem
A significant number of active UFC fighters are incorrectly flagged as retired and displayed under the retired section.

### Root Cause
1. **Accidental Archiving**: The `fighter-scraper.ts` archives fighters if they are missing from the latest active roster scrape *or* if they haven't fought in the UFC for more than 2 years.
2. **Name Matching Mismatches**: Capitalization, spacing, or spelling differences between scraped rosters and the database prevent name matches, causing active fighters to fail validation and get marked as inactive.
3. **Inadequate UFC Page Verification**: The `verifyUfcAthleteActive` function may fail to resolve athlete pages due to URL slug mismatches (e.g. `jon-jones` vs `jonathan-jones`), reverting active fighters to retired.

### Solution
1. **Increase Inactivity Buffer**: Relax the inactive threshold from 2 years to 4 years to prevent active but inactive fighters (like Jon Jones or Conor McGregor) from being archived.
2. **Upcoming Fight Immunity**: If a fighter has any upcoming/scheduled fight in the database, lock their status to `isActive: true`.
3. **Robust Slug Matching**: Refactor the profile page checker to try multiple slug variations (e.g., trying first-last, full name, and last name combinations) before confirming retirement.
4. **Synchronization Script**: Provide an administrative script `src/scripts/reactivate-active-fighters.ts` to restore active status for all verified UFC roster fighters.

### Test / Verification
- Run a test script to check database records for known fighters (e.g., Conor McGregor, Jon Jones) and assert that `isActive` is `true`.
- Run the scraper and verify that active fighters are not shifted to retired status.

---

## 2. Elo Ratings Flatlined at 1300 for UFC Wins

### Problem
Undefeated fighters with multiple UFC wins are stuck at a flat 1300 Elo rating.

### Root Cause
1. **Event Name Checks**: The Elo engine in `elo.ts` only applies rating changes if `outcome.isUFCFight` is `true`. This was computed using `event.name.toUpperCase().includes("UFC")`.
2. **Non-Standard Event Names**: Fallback events or scraped events named "Muhammad vs Bonfim" or similar do not contain the "UFC" substring, causing the Elo calculations to treat them as non-UFC fights and yield a `0` rating change.

### Solution
1. **Broaden UFC Event Matching**: Update `isUFCFight` verification to also check:
   - If the event name matches common patterns like `"Fight Night"`, `"Apex"`, or starts with fighter names representing a UFC card.
   - If the event record has a flag `isUFC: true` or custom source identifiers.
2. **Recalculation Trigger**: Once the event classification is resolved, trigger a full chronological Elo recalculation across all completed fights to backfill the ratings.

### Test / Verification
- Run `tests/test-elo-ufc.ts` to verify that wins on cards without "UFC" in the title (like "Muhammad vs Bonfim") correctly change fighter Elo ratings.

---

## 3. Upcoming Events Prematurely Marked as Past Events

### Problem
All upcoming events have been moved into the past events tab.

### Root Cause
1. **Timezone Offset Check**: The event transition check compares `event.date` directly against `new Date()`.
2. **Premature Transition**: Since events are stored in UTC and timezones vary, upcoming events scheduled for the current day are flagged as past events before they actually happen.

### Solution
1. **Time Buffer**: Add a 24-hour buffer to the date transition check (i.e. only mark as past if `event.date` is older than `now - 24 hours`), ensuring fight cards remain in "Upcoming" until the broadcast ends.
2. **Strict Timezone Handling**: Parse dates using proper localized midnight offsets.

### Test / Verification
- Create a mock event starting in 2 hours, run the transition job, and assert that it remains in the "Upcoming Events" list.

---

## 4. Fake / Fallback Fights Loaded into Events

### Problem
Mock/fake fights are loaded into upcoming and past events.

### Root Cause
1. **Aggressive Fallback Generator**: The API endpoint `/api/events/[id]/fights` contains a fallback generator `generateFallbackFullFightCard` that inserts 10 dummy bouts using active fighter combinations when scraping fails.
2. **Scraper Failures**: Direct network requests to ufc.com or tapology.com often return `403 Forbidden` due to Cloudflare anti-scraping protections, triggering this fallback.

### Solution
1. **Remove Mock Fallbacks**: Completely remove the `generateFallbackFullFightCard` code.
2. **Graceful Error Handling**: If scraping fails and no fights are in the DB, display a clean error card in the UI ("Fight Card Syncing in Progress") instead of writing dummy data to the database.
3. **Purge Script**: Create `src/scripts/purge-fake-fights.ts` to remove all generated bouts that do not correspond to real UFC/Tapology cards.

### Test / Verification
- Mock a failed scraper execution and assert that the database contains 0 new fights (no fallback fights created).

---

## 5. Duplicate and Mock Events in Past Events Tab

### Problem
Mock events (like UFC Freedom 250) and duplicate events (e.g. UFC 300 vs UFC 300: Pereira vs Hill) are displayed under Past Events. Duplicate fights have also reappeared in UFC Freedom 250.

### Root Cause
1. **No Slug Constraints**: The `Event` model does not have unique slug constraints, allowing duplicate scrapers to insert the same event under different name strings.
2. **Incomplete Cleanup**: Previous cleanups did not purge mock events or deduplicate existing fights.

### Solution
1. **Database Purge**: Write a database cleanup script `src/scripts/purge-duplicates.ts` to delete all mock events (e.g. "UFC Freedom 250") and merge duplicate events.
2. **Unique Constraints**: Add a unique index/constraint on event dates or slugified name templates to prevent double insertion.

### Test / Verification
- Run the cleanup script and verify that no duplicate event names exist, and `UFC Freedom 250` is completely gone.

---

## 6. Non-Title Fights Labeled as Title Fights

### Problem
Non-title bouts (including standard Fight Night main events) are marked as title fights.

### Root Cause
1. **Fuzzy Search Match**: The title heuristics match terms like "title" or "belt" inside any part of the row or weight class.
2. **Hardcoded Fallbacks**: The fallback generator previously set `isTitleFight: true` for all main events.

### Solution
1. **Strict Text Match**: Only set `isTitleFight: true` if the bout row text explicitly contains "Championship", "Title Bout", or "UFC Belt" as standalone words, and NOT if it just contains "Bout" or division names.
2. **Separate Rounds from Title Flag**: Ensure Fight Night main events are set to 5 rounds but maintain `isTitleFight: false`.

### Test / Verification
- Run a scraper test on a Fight Night event (e.g. UFC Fight Night: Song vs. Figueiredo) and assert that `isTitleFight` is `false` while `rounds` is `5`.

---

## 7. Missing Events & Wrong Fighter Matches (e.g., Burns vs Malott)

### Problem
The "Gabriel Bonfim vs Belal Muhammad" event is missing, and the "Burns vs Malott" event linked the wrong Burns (Herbert Burns instead of Gilbert Burns).

### Root Cause
1. **Last Name Match Priority**: If first names do not match exactly, the parser falls back to matching by last name. "Burns" matched "Herbert Burns" because he was parsed/scraped first in database order.
2. **Missing Syncs**: Certain events failed to scrape during server errors and were not backfilled.

### Solution
1. **Weight Class Matching Constraint**: Ensure name matching also compares weight classes. Herbert Burns (Featherweight) should not match a Welterweight fight with Malott; it must match Gilbert Burns (Welterweight).
2. **Manual Aliases Override**: Add explicit mappings for similar names in the aliases dictionary.
3. **Scrape Backfill**: Re-run the backfill job to scrape the missing Belal Muhammad event.

### Test / Verification
- Query the Welterweight bout for Malott and assert that `fighter1.name` or `fighter2.name` is "Gilbert Burns".

---

## 8. Net P/L and ROI Charting Failures

### Problem
The Net P/L and simulated ROI trackers do not load or render correctly on the dashboard graphs.

### Root Cause
1. **NaN Chart Data**: If fights are missing odds, wagers are set to `0`. If wagers are zero, dividing profit by wagers returns `NaN`, breaking the Recharts rendering logic.
2. **Empty Timeline Points**: If an event has no graded fights, timeline coordinates are undefined.

### Solution
1. **Defensive Value Parsing**: Ensure all chart nodes map `NaN` or `null` values to `0`.
2. **Estimation Fallbacks**: Use standard default odds (e.g. -110 for both sides) when real odds are missing, ensuring wagers are never zero for a graded pick.

### Test / Verification
- Fetch `/api/performance` and verify that no value in the `timeline` array is `NaN` or `null`.
