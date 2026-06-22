# CageMind AI — Client Feedback Roadmap

> Last updated: 2026-06-18
> Format: **Problem → Root Cause → Solution → Test**

---

## Issue 1 — Fighter Photos Missing & Records Incorrect

**Problem:**
A large number of fighters have no profile photo and show wrong win/loss records (e.g. Jon Jones shows 7-7-0 instead of ~28-1-0, Max Holloway shows 9-9-0, etc.).

**Root cause:**
Two separate bugs:
1. **Photos**: The fighter profile refresh script (`fighters:refresh`) ran but the task output was truncated at 600/3,018 fighters — only ~600 fighters were fully updated before the output buffer filled. Current state: **57.7% of fighters (1,815/3,144) have no photo**.
2. **Records**: The `wins`/`losses`/`draws` fields in the DB reflect only the fights we have stored in our database (not the fighter's full professional career). The ELO recalculate and dedup scripts do not overwrite these, but the original seeding/scraping only counted in-DB fights.

**Solution:**
1. Re-run `npm run fighters:refresh --execute` (the `--execute` flag uses Pool+PrismaPg pattern needed for scripts). Monitor full completion (3,018 fighters, ~42 min). This will scrape each fighter's photo AND career record from their UFC.com athlete page.
2. After refresh: run `npm run fighters:dedup --execute` to ensure the record with best data is kept as canonical.
3. After dedup: run `npm run elo:recalculate` to rebuild ELO with clean career records as seed data.

**Test:**
- Search **Jon Jones** → photo visible, record shows ~28-1-0, weight class = Heavyweight
- Search **Islam Makhachev** → photo visible, record shows ~26-1-0, weight class = Lightweight
- Search **Ilia Topuria** → photo visible, record shows ~16-0-0, weight class = Featherweight
- Browse any fighter on Rankings or Events page → photo appears, record is correct

---

## Issue 2 — Upcoming Events Empty / Show "Bouts Not Finalized Yet"

**Problem:**
All upcoming events display "Bouts Not Finalized Yet" with no fight card, even for events where the card has been announced.

**Root cause:**
This is **partially correct behavior, partially a scraper issue**:
- Events where the card isn't announced yet: showing "Bouts Not Finalized Yet" is **correct**.
- Events where UFC.com HAS the card announced: the on-demand scraper runs when a user visits the event page, but the slug it constructs from the event name may not match UFC.com's actual URL (e.g. "UFC 321" → `ufc-321` is correct, but Fight Night events need full fighter names in the slug).
- Tapology scraper returns 403 errors, so the UFC.com fallback is the only option.

**Solution:**
1. For numbered upcoming PPV events (UFC 321+): slug generation works correctly (`ufc-321`, `ufc-322`, etc.) — visiting the event page will auto-scrape from UFC.com once the card is announced.
2. For Fight Night upcoming events: improve `generateEventSlug()` in `src/app/api/events/[id]/fights/route.ts` to attempt multiple UFC.com URL patterns (with full fighter first names) before giving up.
3. For truly unannounced events: "Bouts Not Finalized Yet" is the correct message — no fix needed.

**Test:**
- Visit an upcoming numbered event (UFC 321) → if card is announced on UFC.com, fight card appears within 30 seconds (on-demand scrape)
- Visit an upcoming Fight Night with announced card → same auto-populate behavior
- Visit an event with no announced card → "Bouts Not Finalized Yet" message (correct)

---

## Issue 3 — Performance Tab Shows N/A for Correct Pick Profits (No Real Odds)

**Problem:**
In the Performance Tab, correct picks show "N/A" for profit instead of a real dollar amount. ROI and Net P/L KPI cards also show "N/A". This is because no historical fight odds are stored in the database.

**Root cause:**
The `oddsFighter1` / `oddsFighter2` fields on Fight records are `null` for all historical fights. The profit calculation code is correct — it returns `null` when odds are missing rather than using a fake -110 fallback (Issue 5 fix from previous session). The gap is that no odds data source has been integrated.

**Solution:**
Integrate a historical MMA odds API. Options ranked by ease:
1. **The Odds API** (`the-odds-api.com`) — has UFC historical odds, free tier available. API key required.
2. **BestFightOdds.com scrape** — public historical odds, scrapeable by event + fighter name.
3. **Manual CSV import** — import a historical odds CSV matching fight by event name + fighter names.

Implementation steps (once source chosen):
- Write `src/scripts/import-fight-odds.ts` that matches odds records to DB fights by event + fighter name
- Populate `oddsFighter1`/`oddsFighter2` on the Fight table
- Profit calculation is already implemented correctly — it will auto-populate once odds exist

**Test:**
- Performance Tab → correct picks show `+$XXX` profit (not N/A)
- ROI KPI card shows a real percentage
- Net P/L KPI card shows a real dollar total
- Individual event pick modal shows actual profit/loss per fight

---

## Issue 4 — Missing Recent Events in Past Events & Performance Tab

**Problem:**
The following events are missing from Past Events and the Performance Tab:
- UFC Fight Night: Muhammad vs. Bonfim (June 7, 2026)
- UFC Fight Night: Song vs. Figueiredo (marked as upcoming but has already occurred)
- UFC Fight Night: Allen vs. Costa
- UFC Fight Night: Della Maddalena vs. Prates
- UFC Fight Night: Sterling vs. Zalal
- UFC Fight Night: Burns vs. Malott
- UFC 321 through UFC 328 (numbered events)

**Root cause:**
Two separate causes:
1. **2026 Fight Night events** (Muhammad vs Bonfim, Allen vs Costa, etc.): These events occurred in April–June 2026. They do not exist on UFC.com (our scraper pulls from the real UFC.com website which is behind the current date). The placeholder events with short names ("Muhammad vs Bonfim") were deleted because they had no fight data. A proper data source for 2026 events is needed.
2. **UFC 321–328**: These numbered events don't yet exist on UFC.com. They need to be created in the DB and their fight cards sourced once available.
3. **Song vs. Figueiredo**: Currently exists in DB as "UFC Fight Night: Song vs. Figueiredo" dated 2026-11-23 and correctly flagged `isUpcoming=true`. If it has already occurred, the date and flag need correcting and fight results need importing.

**Solution:**
1. **For 2026 Fight Night events**: Since UFC.com doesn't have post-2025 data, these must be entered manually or via an alternative data source (e.g. Tapology, Sherdog, ESPN MMA) once Tapology access is restored (currently 403 blocked). Create event records and import fight results + winners.
2. **For UFC 321–328**: Create event records via `restore-ufc-ppv-events.ts` (update the reference list to include 321–328 with correct dates), then scrape fight cards from UFC.com once they are available.
3. **For Song vs. Figueiredo**: Confirm actual event date, update `isUpcoming=false`, import fight results.
4. Once fight data is in: run `npm run predictions:backfill --execute` and `npm run elo:recalculate` to generate picks and rebuild ELO.

**Test:**
- Past Events tab → Muhammad vs. Bonfim, Allen vs. Costa, Della Maddalena vs. Prates, Sterling vs. Zalal, Burns vs. Malott all appear with real fight cards
- UFC 321–328 appear in Past Events tab in correct chronological order
- Song vs. Figueiredo appears in Past Events (not Upcoming) with real fight results
- Performance Tab → all above events appear in the event list with AI picks

---

## Implementation Sequence

| # | Issue | Priority | Blocker |
|---|-------|----------|---------|
| 1 | Fix fighter photos + records | Critical | Re-run `fighters:refresh` (42 min) |
| 2 | Upcoming events empty | Medium | Improve slug generation; announced cards auto-populate |
| 3 | Real odds for profit stats | High | Needs odds API key / data source decision |
| 4 | Missing 2026 events + UFC 321–328 | High | Needs Tapology access OR manual data entry |
