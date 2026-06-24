# CageMind AI — Scripts & Data Update Guide

> All scripts run from the project root: `D:\WEB DEV\CageMind Ai`
> Use `npx tsx` to run TypeScript scripts directly. `npm run <name>` is a shortcut alias.

---

## Table of Contents

1. [How Scripts Work](#how-scripts-work)
2. [Automated Cron Jobs (GitHub Actions)](#automated-cron-jobs-github-actions)
3. [Run Cron Jobs Manually](#run-cron-jobs-manually)
4. [Fight Card Scripts](#fight-card-scripts)
5. [Fighter Data Scripts](#fighter-data-scripts)
6. [Event Scripts](#event-scripts)
7. [ELO Rating Scripts](#elo-rating-scripts)
8. [Prediction Scripts](#prediction-scripts)
9. [Data Cleanup Scripts](#data-cleanup-scripts)
10. [Odds Scripts](#odds-scripts)
11. [Quick Reference Table](#quick-reference-table)

---

## How Scripts Work

### Dry Run vs Execute

Most scripts have two modes:

| Mode | What it does |
|---|---|
| **Dry run** (default) | Shows what WOULD change — no writes to DB |
| **Execute** (`--execute`) | Actually writes changes to the database |

**Always run dry first to check the output, then run with `--execute`.**

### Test on One Fighter

Several fighter scripts accept `--fighter "Name"` to test on a single fighter before running on all 1,900+:

```powershell
npx tsx src/scripts/update-fighter-images.ts --fighter "Jon Jones"
npx tsx src/scripts/update-fighter-images.ts --fighter "Jon Jones" --execute
```

---

## Automated Cron Jobs (GitHub Actions)

These run automatically on the client GitHub repo (`avielrintamaki/CageMind_Ai`).
No action needed — GitHub runs them on schedule.

### Daily Job — 2:00 AM UTC every day

**File:** `.github/workflows/cron-daily.yml`

**What it does:**
- Syncs the UFC events list from UFC.com
- Updates fight cards for upcoming events (up to 5 per run)
- Marks past events as completed

**Trigger:** Automatic at 2:00 AM UTC. Can also be triggered manually from:
> GitHub → Actions tab → "Daily — Sync UFC Events" → Run workflow

---

### Weekly Job — 4:00 AM UTC every Sunday

**File:** `.github/workflows/cron-weekly.yml`

**What it does:**
- Processes results for completed events
- Recalculates ELO ratings for all fighters chronologically

**Trigger:** Automatic every Sunday at 4:00 AM UTC. Can also be triggered from:
> GitHub → Actions tab → "Weekly — Process Results & Rebuild ELO" → Run workflow

---

## Run Cron Jobs Manually

Run the exact same logic that GitHub Actions runs, but from your local machine:

### Run Daily Job Now

```powershell
npx tsx src/scripts/gh-cron-daily.ts
```

### Run Weekly Job Now

```powershell
npx tsx src/scripts/gh-cron-weekly.ts
```

> These use the same `.env` database connection. Identical to what GitHub Actions does.

---

## Fight Card Scripts

Scripts to populate and refresh fight cards (bouts/results) for events.

### Update Upcoming Events Fight Cards

Scrapes the announced bouts for all upcoming events from UFC.com.
Safe to run any time — updates existing fights and adds new ones.

```powershell
npx tsx src/scripts/update-fightcard-upcoming.ts
```

Or via npm:
```powershell
npm run fightcard:upcoming
```

---

### Update Past Events Fight Cards

Scrapes fight results for past events.

**Default — only events with NO fights yet (safest, recommended):**
```powershell
npx tsx src/scripts/update-fightcard-past.ts
```

**All past events (re-scrape/refresh existing results too):**
```powershell
npx tsx src/scripts/update-fightcard-past.ts --all
```

**Last N days only (e.g. last 90 days):**
```powershell
npx tsx src/scripts/update-fightcard-past.ts --days-back 90
```

**Limit to N events (default is 100):**
```powershell
npx tsx src/scripts/update-fightcard-past.ts --limit 20
```

**Combine flags — refresh last 30 days, max 50 events:**
```powershell
npx tsx src/scripts/update-fightcard-past.ts --all --days-back 30 --limit 50
```

Or via npm shortcuts:
```powershell
npm run fightcard:past        # no fights only, up to 100
npm run fightcard:past-all    # all past events
```

---

## Fighter Data Scripts

Each script updates **one specific set of fields only** — no data mixing between fighters.

### Fighter Status (Active / Inactive / Retired)

Checks UFC.com athlete page first, falls back to 4-year fight history.

```powershell
# Preview changes
npx tsx src/scripts/update-fighter-status.ts

# Apply changes
npx tsx src/scripts/update-fighter-status.ts --execute
```

npm shortcuts:
```powershell
npm run fighters:update-status-dry   # preview
npm run fighters:update-status       # apply
```

---

### Fighter Profile Images

Updates `imageUrl` only. Reads the full-body portrait from UFC.com athlete page.

**Test on one fighter first:**
```powershell
npx tsx src/scripts/update-fighter-images.ts --fighter "Jon Jones"
```

**All fighters (dry run):**
```powershell
npx tsx src/scripts/update-fighter-images.ts
```

**All fighters (apply):**
```powershell
npx tsx src/scripts/update-fighter-images.ts --execute
```

npm shortcuts:
```powershell
npm run fighters:update-images-dry
npm run fighters:update-images
```

---

### Fighter Pro Record (Wins / Losses / Draws)

Updates `wins`, `losses`, `draws` only. Reads from UFC.com hero section (e.g. "28-1-0").
> Note: ELO is NOT updated here — run `elo:recalculate` separately after this.

**Test on one fighter first:**
```powershell
npx tsx src/scripts/update-fighter-record.ts --fighter "Jon Jones"
```

**All fighters (dry run):**
```powershell
npx tsx src/scripts/update-fighter-record.ts
```

**All fighters (apply):**
```powershell
npx tsx src/scripts/update-fighter-record.ts --execute
```

npm shortcuts:
```powershell
npm run fighters:update-record-dry
npm run fighters:update-record
```

---

### Fighter Physical Attributes & Method of Victory

Updates `age`, `height`, `reach`, `koWins`, `subWins` only.
Reads bio section and hero stats from UFC.com athlete page.

**Test on one fighter first:**
```powershell
npx tsx src/scripts/update-fighter-physical.ts --fighter "Jon Jones"
```

**All fighters (dry run):**
```powershell
npx tsx src/scripts/update-fighter-physical.ts
```

**All fighters (apply):**
```powershell
npx tsx src/scripts/update-fighter-physical.ts --execute
```

npm shortcuts:
```powershell
npm run fighters:update-physical-dry
npm run fighters:update-physical
```

---

### Refresh All Fighter Profiles (Legacy — all fields at once)

Re-scrapes age, height, reach, imageUrl, wins, losses, draws all in one go.
For fighters missing a photo or physical stats.

```powershell
npm run fighters:refresh-dry   # preview
npm run fighters:refresh       # apply
```

---

### Sync Fighter UFC IDs

Matches fighters in DB to their UFC.com athlete URL (ufcId field).
Run this if fighters are missing their UFC page link.

```powershell
npm run fighters:sync-ids-dry   # preview
npm run fighters:sync-ids       # apply
```

---

### Deduplicate Fighters

Finds and merges duplicate fighter records in the database.

```powershell
npm run fighters:dedup-dry   # preview
npm run fighters:dedup       # apply
```

---

### Clean Weight Classes

Normalises weight class strings to standard format.

```powershell
npm run fighters:clean-weightclass
```

---

## Event Scripts

### Flip Past Events

Marks events as `isUpcoming = false` if their date has passed.
Run this if past events are still showing as upcoming.

```powershell
npm run events:flip-past-dry   # preview
npm run events:flip-past       # apply
```

---

### Fix Numbered Event Dates

Corrects dates for numbered PPV events (UFC 300, UFC 301, etc.).

```powershell
npm run events:fix-dates-dry   # preview
npm run events:fix-dates       # apply
```

---

### Restore PPV Events

Restores UFC numbered PPV events that were accidentally removed.

```powershell
npm run events:restore-ppv-dry   # preview
npm run events:restore-ppv       # apply
```

---

### Backfill Numbered Events

Imports historical UFC numbered events (PPVs) that are missing from the DB.

```powershell
npm run events:backfill-ppv
```

---

### Backfill Fight Nights

Imports historical UFC Fight Night events that are missing from the DB.

```powershell
npm run fights:backfill-fn-dry   # preview
npm run fights:backfill-fn       # apply
```

---

### Import ESPN Results

Imports fight results from ESPN as an alternative data source.

```powershell
npm run events:import-espn-dry   # preview
npm run events:import-espn       # apply
```

---

## ELO Rating Scripts

### Recalculate All ELO Ratings

Rebuilds ELO from scratch chronologically across all fights.
Run this after importing new fight results or updating records.

```powershell
npm run elo:recalculate
```

Or directly:
```powershell
npx tsx src/scripts/recalculate-elo.ts
```

---

### Diagnose ELO

Shows ELO rating breakdown and identifies anomalies.

```powershell
npm run elo:diagnose
```

---

## Prediction Scripts

### Backfill Predictions

Generates predictions for past events that don't have predictions yet.

```powershell
npm run predictions:backfill-dry   # preview
npm run predictions:backfill       # apply
```

---

### Reset Fight Night Processed Flag

Resets the `processed` flag on Fight Night events so predictions are regenerated.

```powershell
npm run predictions:reset-fn
```

---

## Data Cleanup Scripts

### Purge Fake Fights (All)

Removes invalid/fake fight records from the database.

```powershell
npm run fights:purge-dry   # preview
npm run fights:purge       # apply
```

---

### Purge Fake Upcoming Fights

Removes invalid fights from upcoming events only.

```powershell
npm run fights:purge-upcoming-dry   # preview
npm run fights:purge-upcoming       # apply
```

---

### Purge Fake Past Fights

Removes invalid fights from past events only.

```powershell
npm run fights:purge-past-dry   # preview
npm run fights:purge-past       # apply
```

---

### Fix Title Fights

Marks/unmarks fights as title fights based on weight class and name patterns.

```powershell
npm run fights:fix-titles-dry   # preview
npm run fights:fix-titles       # apply
```

---

## Odds Scripts

### Scrape BFO Odds

Scrapes historical fight odds from BestFightOdds.

```powershell
npm run odds:scrape-bfo-dry   # preview
npm run odds:scrape-bfo       # apply
```

---

### Fetch Live Odds (Requires API Key)

Fetches upcoming fight odds from the-odds-api.com.
Requires `ODDS_API_KEY` in `.env` — skipped automatically if key is missing.

```powershell
npm run odds:fetch-dry   # preview
npm run odds:fetch       # apply
```

---

## Quick Reference Table

### Cron Jobs

| What | Command | Schedule |
|---|---|---|
| Daily sync (manual) | `npx tsx src/scripts/gh-cron-daily.ts` | Auto: 2AM UTC daily |
| Weekly results (manual) | `npx tsx src/scripts/gh-cron-weekly.ts` | Auto: 4AM UTC Sunday |

---

### Fight Cards

| What | Command |
|---|---|
| Update upcoming fight cards | `npx tsx src/scripts/update-fightcard-upcoming.ts` |
| Update past fight cards (missing only) | `npx tsx src/scripts/update-fightcard-past.ts` |
| Update ALL past fight cards | `npx tsx src/scripts/update-fightcard-past.ts --all` |
| Past cards — last 90 days | `npx tsx src/scripts/update-fightcard-past.ts --days-back 90` |

---

### Fighter Data

| What | Command |
|---|---|
| Update status (active/inactive/retired) | `npx tsx src/scripts/update-fighter-status.ts --execute` |
| Update profile images | `npx tsx src/scripts/update-fighter-images.ts --execute` |
| Update pro record (W/L/D) | `npx tsx src/scripts/update-fighter-record.ts --execute` |
| Update physical + KO/sub wins | `npx tsx src/scripts/update-fighter-physical.ts --execute` |
| Refresh all profiles (all fields) | `npm run fighters:refresh` |
| Sync UFC IDs | `npm run fighters:sync-ids` |
| Deduplicate fighters | `npm run fighters:dedup` |

---

### Events & ELO

| What | Command |
|---|---|
| Flip past events | `npm run events:flip-past` |
| Fix event dates | `npm run events:fix-dates` |
| Backfill Fight Nights | `npm run fights:backfill-fn` |
| Recalculate ELO | `npm run elo:recalculate` |

---

### Predictions & Cleanup

| What | Command |
|---|---|
| Backfill predictions | `npm run predictions:backfill` |
| Purge fake fights | `npm run fights:purge` |
| Fix title fights | `npm run fights:fix-titles` |

---

## Recommended Order for Full Data Refresh

If starting fresh or doing a major data update, run in this order:

```
1.  npm run events:flip-past              ← mark past events correctly
2.  npx tsx src/scripts/gh-cron-daily.ts  ← sync events + upcoming fight cards
3.  npx tsx src/scripts/update-fightcard-past.ts --all   ← fill past results
4.  npm run fighters:sync-ids             ← ensure UFC IDs are linked
5.  npx tsx src/scripts/update-fighter-status.ts --execute    ← active/inactive/retired
6.  npx tsx src/scripts/update-fighter-images.ts --execute    ← profile photos
7.  npx tsx src/scripts/update-fighter-record.ts --execute    ← W/L/D records
8.  npx tsx src/scripts/update-fighter-physical.ts --execute  ← age/height/reach/KO/sub
9.  npm run elo:recalculate               ← rebuild ELO ratings
10. npm run predictions:backfill          ← generate predictions for past events
```
