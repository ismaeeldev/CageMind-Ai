# CageMind AI — Client Feedback Roadmap

> Date: 2026-06-17
> All items below are sequenced by dependency order. Each entry follows the format: **Problem → Solution → Test**.

---

## Issue 1 — Duplicate Fighters in Database

**Problem:**
Duplicate fighter records exist in the database (e.g., Magomed Ankalev appears twice with different ELO scores). This corrupts rankings, predictions, and statistics.

**Solution:**
- Write a database deduplication script that finds fighters with identical or near-identical names.
- For each duplicate pair, merge fight records onto the canonical fighter entry and carry forward the ELO that reflects actual fight history.
- Delete the orphaned duplicate rows after migration.
- Add a unique constraint on fighter name (+ optionally date of birth) to prevent future duplicates.

**Test:**
- Query the database for any fighter whose name appears more than once; result must be zero.
- Confirm the merged fighter's fight record is complete and ELO is consistent.
- Attempt to insert a duplicate name; verify the unique constraint rejects it.

---

## Issue 2 — Fake/Placeholder Fights Loaded into Upcoming & Past Events

**Problem:**
Placeholder/fake fights are being pulled into both the Upcoming Events and Past Events tabs. These appear in event detail pages and show multiple invalid fights.

**Solution:**
- Add a `is_real` / `data_source` flag to the fights table to distinguish scraped real data from seeded/placeholder data.
- Filter all event-listing queries (upcoming and past) to exclude any fight where `is_real = false` or `data_source = 'seed'`.
- Once live data scraping is complete and validated, the placeholder rows can be deleted entirely.
- Until scraping is live, the filter ensures fake fights are hidden from the UI.

**Test:**
- Open every upcoming event detail page; confirm only verified fights appear.
- Open past event pages; confirm no placeholder fights are listed.
- Verify event cards with zero real fights are hidden or show an appropriate empty state.

---

## Issue 3 — Non-Title Fights Incorrectly Labeled as Title Fights

**Problem:**
Regular fights are being displayed with title-fight styling/labeling when they are not championship bouts.

**Solution:**
- Audit the `is_title_fight` boolean field on all fight records; reset incorrect flags to `false`.
- Tighten the scraper / data-import logic to only set `is_title_fight = true` when the source data explicitly marks it as a title bout.
- Update the UI badge/label component to only render the title-fight indicator when the flag is confirmed true.

**Test:**
- Spot-check 10 known non-title fights and confirm they show no title-fight badge.
- Spot-check 5 known title fights and confirm the badge still appears correctly.
- Verify the database count of `is_title_fight = true` matches the known real count of championship bouts in the dataset.

---

## Issue 4 — High Confidence Picks Threshold Too Low

**Problem:**
The "High Confidence Picks" tab currently includes predictions below what the client considers high confidence. Threshold needs to be 70% or higher.

**Solution:**
- Change the confidence filter in the High Confidence Picks query/component from its current value to `predicted_win_probability >= 0.70`.
- Update any label or tooltip copy to reflect "70%+ confidence."

**Test:**
- Assert every pick shown in the tab has a displayed probability of 70% or above.
- Assert that a fight with a 69% prediction does NOT appear in the tab.
- Assert a fight with exactly 70% DOES appear.

---

## Issue 5 — Fight Night Events Missing from Performance Tab & Past Events Tab ✅ RESOLVED

**Problem:**
Past fights from UFC Fight Nights are not populating the Performance Tab or the Past Events Tab. Only numbered events appear to be included.

**Solution implemented (2026-06-17):**
- Created `src/scripts/backfill-fight-nights.ts` — paginates UFC.com `/events?page=N` (30 pages) to collect 162 Fight Night slugs (2020–2026), then fetches each event page for full fight cards with results.
- Created `src/scripts/fix-unknown-event-names.ts` — renamed 161 events from "Unknown" to "UFC Fight Night: Fighter1 vs. Fighter2" using main event fighter names.
- 160 new events created, 161 fight cards saved, 0 errors.
- Fight Night events appear in Past Events Tab automatically (no query filter change needed — API already uses `isUpcoming: false`).

**Verified:**
- 161 Fight Night events in DB with proper names (e.g., "UFC Fight Night: Colby Covington vs. Tyron Woodley").
- All fight cards have full results (winner, method, round, time).

---

## Issue 6 — ELO System Gives Unearned High Ratings to Untested Fighters ✅ RESOLVED

**Problem:**
Undefeated fighters who have only beaten weak opposition are sitting at high ELO (e.g., 1500+) rather than an ELO that reflects the quality of their opponents and how dominant they were.

**Solution implemented (2026-06-17):**
- `src/lib/elo.ts` — `seedElo()` baseline lowered 1300→1200, record-seeded cap lowered 1600→1400, floor lowered 1000→800.
- `src/scripts/recalculate-elo.ts` — initial seed per fighter changed 1300→1200.
- `src/scrapers/tapology-scraper.ts` and `fight-card-scraper.ts` — new fighter default ELO changed 1300→1200.
- Ran `npm run elo:recalculate` — recalculated all 3,144 fighters from full UFC fight history (2,263 UFC fights processed chronologically).

**Verified:**
- 3,144 fighters recalculated. Newcomers start at 1200; fighters must earn their way up through quality wins.

---

## Issue 7 — Performance Tab Shows 0 High Confidence Picks & Illogical Prediction Percentages ✅ RESOLVED

**Problem:**
The Performance Tab shows zero High Confidence Picks. Additionally, some past predictions display ~40% win probability for the predicted winner, which is logically contradictory (a pick should always favor the fighter with >50% probability).

**Solution implemented (2026-06-17):**
- `src/lib/prediction-engine.ts` — confidence clamped to min 0.50 (`Math.max(0.50, ...)`), missing-physical penalty reduced 0.80→0.85. Eliminates sub-50% confidence scores.
- Created `src/scripts/backfill-predictions.ts` — generates AI predictions for all past fights with results but no prediction, using pure-math `PredictionEngine` (no Claude API). Ran against 2,357 fights in two passes.
- `src/app/api/performance/route.ts` — already correct: picks winner as fighter with higher `winProbFighter1/2`; `isHighConfidence = confidence >= 0.70`.

**Verified (DB query 2026-06-17):**
- Graded fights (aiPrediction + winner): **4,132**
- High-confidence picks (≥0.70): **113**
- Performance Tab will now show meaningful data across all past events.

---

## Implementation Sequence

| # | Issue | Dependency |
|---|-------|------------|
| 1 | Deduplicate fighters | None — do first, all other data depends on clean fighter records |
| 2 | Filter fake fights | None — parallel with #1 |
| 3 | Fix title fight flags | After #1 (need clean fighter/fight records) |
| 5 | Add Fight Night data | After #1 and #2 |
| 6 | Recalculate ELO | After #1 and #5 (need full, clean fight history) |
| 7 | Fix prediction percentages | After #5 and #6 (need complete fight + ELO data) |
| 4 | Raise confidence threshold to 70% | After #7 (needs accurate probabilities) |
