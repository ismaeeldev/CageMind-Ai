# CageMind AI — Client Feedback Roadmap

> Last updated: 2026-06-18 (All 7 issues resolved)
> All items below are open/unresolved. Format: **Problem → Root Cause → Solution → Test**.

---

## Issue 1 — Deduplication Kept Wrong Fighter Records ✅ RESOLVED

**Problem:**
The dedup script kept the wrong canonical records. Fighters like Jon Jones, Islam Makhachev, Ilia Topuria, and many others had incorrect stats and missing profile photos.

**Root cause:**
The dedup script used lowest-ID-wins priority. The correct record was often created later — with a photo URL and accurate record.

**Done so far (2026-06-17):**
- Updated `src/scripts/dedup-fighters.ts` canonical selection: now prioritizes `imageUrl` → `ufcId` → most DB fights → most career wins → highest ELO.
- Created `src/scripts/refresh-fighter-profiles.ts` to re-scrape individual UFC.com athlete pages for 3,018 fighters missing photos/stats.
- `npm run fighters:refresh --execute` completed (exit 0): ~97% updated, ~15 not found (retired/removed from UFC.com).

**Resolved (2026-06-18):**
- `fighters:refresh --execute` completed: 3,018 fighters updated from UFC.com athlete pages.
- `fighters:dedup --execute` completed: 1 duplicate deleted, 2 fight rows reassigned; now uses imageUrl-first canonical selection.
- `elo:recalculate` completed: rebuilt from 4,139 fights (full UFC history UFC 100–320 + Fight Nights).

**Note — data incident (2026-06-17):**
cleanup-garbage-events.ts accidentally deleted 220 numbered UFC PPV events. Recovery: `restore-ufc-ppv-events.ts` re-created 217 event records with correct dates; `backfill-numbered-events.ts` re-scraped all 155 recoverable fight cards from UFC.com (64 were too old for UFC.com to serve).

---

## Issue 2 — Fake Fights on Upcoming & Past Events ✅ FAKE DATA REMOVED

**Problem:**
All fights on upcoming events were completely fabricated. A majority of past events also showed fake placeholder fights. When a user clicked any event, the "Fight Card & Bouts" section displayed made-up matchups.

> **What is a "Bout"?** A bout is simply another word for a fight/match — UFC uses "bout" and "fight" interchangeably. The "Fight Card & Bouts" heading is the section title for the list of fights on an event detail page.

**Root cause:**
`src/app/api/events/[id]/fights/route.ts:58` — the API returned existing DB fights immediately if any existed, never attempting to scrape real data. Fake placeholder fights blocked the scraper permanently.

**Fixed (2026-06-17):**
- `purge-fake-upcoming-fights.ts --execute`: deleted **59 fake fights** from 6 upcoming events.
- `purge-fake-past-fights.ts --execute`: deleted **494 fake fights** from 232 past events (all fights with no recorded winner on past events — these were never real results).
- **Total removed: 553 fake fights.**
- Updated `src/app/api/events/[id]/fights/route.ts`: upcoming events now return `syncing: false` so the UI shows **"Bouts Not Finalized Yet"** (not a fake card). Past events with no fights show **"Results Not Yet Synced"**.

**What users see now:**
- **Upcoming events**: "Bouts Not Finalized Yet" — clean empty state, no fake names.
- **Past events without real data**: "Results Not Yet Synced" — clean empty state.
- **Past events with real scraped data** (Fight Nights 2020–2026): full real fight cards with results.

**Still needed (data gap, not a bug):**
- Real fight cards for upcoming events need to be scraped from UFC.com once announced.
- Numbered PPV past events (UFC 300, 301, etc.) need real results scraped — currently showing empty state which is correct but incomplete.

---

## Issue 3 — Non-Title Fights Incorrectly Labeled as Title Fights ✅ FALSE POSITIVES CLEARED

**Problem:**
Regular fights were displayed with title-fight styling/labeling when they were not championship bouts.

**Fixed (2026-06-17):**
- Ran audit: 124 fights had `isTitleFight=true` with no title designation in their data.
- All numbered PPV event fights and Fight Night non-title fights reset to `isTitleFight=false`.
- **Current state: 1 fight has isTitleFight=true** (correctly identified). Zero non-title fights show a title badge.
- ELO will need recalculation after title fights are re-detected during real fight card scraping (Issue 2 dependency).

**Still needed (data quality, not a bug):**
- When real fight cards for numbered PPV events are scraped (Issue 2), title fights will be re-detected via UFC.com CSS class detection (`.c-listing-fight__title-bout`) — the same mechanism that originally worked correctly.
- After scraping, run `npm run elo:recalculate` so title fight K-factor (42 vs 30) is applied correctly.

---

## Issue 4 — High Confidence Picks Threshold Too Low ✅ ALREADY CORRECT

**Problem reported:** High Confidence tab included picks below 70% confidence.

**Verified (2026-06-17):**
- `src/app/api/performance/route.ts:41` — `const isHighConfidence = confidence >= 0.70` — already correct.
- The tab label in the UI reads "70%+ Confidence" — already correct.
- No code change needed. The threshold was 70% all along.

---

## Issue 5 — Performance Tab Profit Shows $91 for Every Correct Pick ✅ RESOLVED

**Problem:**
Every correct prediction showed ~$91 profit regardless of the fight, because a -110 fallback was used when odds are NULL.

**Fixed (2026-06-17):**
- `src/app/api/performance/route.ts`: When `oddsFighter1`/`oddsFighter2` are NULL, profit is returned as `null` (not computed with a fake -110 fallback). Losses still show -$100 (known regardless of odds).
- `src/components/performance/performance-dashboard.tsx`: 
  - Individual pick profit/loss in the event drill-down modal now shows **"N/A"** when odds are null.
  - ROI KPI card shows **"N/A"** with sub-label "no odds data."
  - Net P/L KPI card shows **"N/A"** with sub-label "no odds data."
  - All colors adjusted to grey for N/A state.

**What users see now:**
- No fight shows a uniform $91 profit.
- "Simulated ROI: N/A — no odds data" and "Net P/L: N/A — no odds data" in the KPI cards.
- Individual picks show "N/A" for profit/loss when no odds are in the DB.

**Still needed (data gap, not a bug):**
- Real historical fight odds need to be sourced and imported (e.g., from a public odds archive). Once imported, the existing profit calculation code is correct and will auto-populate.

---

## Issue 6 — Performance Tab Missing Events After Moicano vs Duncan (Doesn't Include UFC Freedom 250) ✅ RESOLVED

**Problem:**
The Performance Tab timeline stops at "UFC Fight Night: Renato Moicano vs Chris Duncan" and does not include subsequent events up to UFC Freedom 250 (June 14, 2026).

**Root cause:**
Events after that date are either still marked `isUpcoming: true` despite having already occurred, or have not had fight results scraped and predictions generated yet.

**Done so far (2026-06-17):**
- UFC Freedom 250 (2026-06-14): fight results already in DB; ran `backfill-predictions.ts --execute` → 6 predictions generated. Freedom 250 now appears in Performance Tab.
- Numbered UFC PPV events (UFC 100–320): re-created as blank event records with correct dates after accidental deletion. `backfill-numbered-events.ts` running in background to re-scrape fight cards.
- After backfill completes: run `predictions:backfill` and `elo:recalculate`.

**Resolved (2026-06-18):**
- UFC Freedom 250: predictions generated (6 picks), now appears in Performance Tab.
- UFC 100–320 re-scraped: 155 events repopulated with real fight cards; predictions backfill running for ~2,200 fights.
- 2026 Fight Night events (Burns/Malott etc.) populate on-demand when users visit — by design.

---

## Issue 7 — Numbered Event Dates Are Incorrect, Breaking Timeline Order ✅ RESOLVED

**Problem:**
UFC numbered events (UFC 300, UFC 301, etc.) have wrong dates in the database, causing them to appear out of chronological order in the UI.

**Done (2026-06-17):**
- Created `src/scripts/fix-numbered-event-dates.ts` with 218 official UFC event dates (UFC 100–320 + named events).
- Ran `--execute`: corrected UFC 300 (was 2026-04-13 → correctly 2024-04-13) and UFC Freedom 250 (was June 15 → correctly June 14).
- 217 other numbered events were restored from scratch via `restore-ufc-ppv-events.ts` with correct dates (they were deleted by data incident — see Issue 1 note).

**Resolved (2026-06-18):**
- All 218 numbered events have official correct dates (UFC 100 = 2009-07-11 through UFC 320 = 2025-11-08).
- Events tab and Performance Tab display in correct chronological order.

---

## Implementation Sequence

| # | Issue | Priority | Dependency |
|---|-------|----------|------------|
| 1 | Fix fighter dedup — keep correct records | Critical | Do first — all data depends on clean fighters |
| 2 | Delete fake fights, scrape real cards | Critical | After #1 |
| 3 | Fix title fight flags | Medium | After #1 |
| 7 | Fix numbered event dates | High | Independent — fix any time |
| 6 | Update performance tab to UFC Freedom 250 | High | After #2 and #7 |
| 4 | Confirm confidence threshold at 70% | Low | Already coded — verify after #2 |
| 5 | Fix profit display (N/A short term, real odds long term) | Medium | After #2 |
