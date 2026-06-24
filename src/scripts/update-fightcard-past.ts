/**
 * Updates fight cards for PAST events only (isUpcoming = false).
 *
 * Default: only processes events that have NO fights yet.
 * Use --all to re-scrape ALL past events (refreshes results for events that already have data).
 * Use --limit N to cap the number of events processed (default: 100).
 * Use --days-back N to restrict to events from the last N days only.
 *
 * This script does NOT touch gh-cron-daily.ts or gh-cron-weekly.ts.
 *
 * Usage:
 *   npx tsx src/scripts/update-fightcard-past.ts                  # past events with no fights, up to 100
 *   npx tsx src/scripts/update-fightcard-past.ts --all            # all past events (refresh results)
 *   npx tsx src/scripts/update-fightcard-past.ts --limit 20       # first 20 past events with no fights
 *   npx tsx src/scripts/update-fightcard-past.ts --days-back 90   # past events from last 90 days
 *   npx tsx src/scripts/update-fightcard-past.ts --all --days-back 30  # refresh last 30 days
 */

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { FightCardScraper } from "../scrapers/fight-card-scraper";

// ── CLI args ──────────────────────────────────────────────────────────────────
const ALL_FLAG    = process.argv.includes("--all");
const limitArg    = process.argv.indexOf("--limit");
const LIMIT       = limitArg !== -1 ? parseInt(process.argv[limitArg + 1]) || 100 : 100;
const daysBackArg = process.argv.indexOf("--days-back");
const DAYS_BACK   = daysBackArg !== -1 ? parseInt(process.argv[daysBackArg + 1]) || 0 : 0;

const DELAY_MS = 2000; // delay between event scrapes to be polite to UFC.com

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

/** Replicates scheduler.ts buildUfcEventUrl — keep in sync with scheduler if changed */
function buildUfcEventUrl(eventName: string, eventDate: Date): string {
  const numberedMatch = eventName.match(/UFC\s+(\d+)/i);
  if (numberedMatch) return `https://www.ufc.com/event/ufc-${numberedMatch[1]}`;

  const month = new Date(eventDate).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
  const day   = new Date(eventDate).getUTCDate();
  const year  = new Date(eventDate).getUTCFullYear();
  return `https://www.ufc.com/event/ufc-fight-night-${month}-${day}-${year}`;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("\n=== Update Fight Cards — Past Events ===");
  console.log(`Mode  : ${ALL_FLAG ? "ALL past events" : "past events with NO fights only"}`);
  console.log(`Limit : ${LIMIT}`);
  if (DAYS_BACK > 0) console.log(`Filter: last ${DAYS_BACK} days`);
  console.log();

  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Build event filter
    const dateFilter = DAYS_BACK > 0
      ? { gte: new Date(Date.now() - DAYS_BACK * 86_400_000) }
      : undefined;

    const where: Parameters<typeof prisma.event.findMany>[0]["where"] = {
      isUpcoming: false,
      ...(dateFilter ? { date: dateFilter } : {}),
      ...(!ALL_FLAG ? { fights: { none: {} } } : {}),
    };

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "desc" },
      take: LIMIT,
      select: { id: true, name: true, date: true },
    });

    console.log(`Events to process: ${events.length}\n`);

    if (events.length === 0) {
      console.log("Nothing to update.");
      return;
    }

    let done = 0, failed = 0;

    for (const event of events) {
      const url = buildUfcEventUrl(event.name, event.date);
      console.log(`[${done + 1}/${events.length}] ${event.name} (${event.date.toISOString().slice(0, 10)})`);
      console.log(`  → ${url}`);

      try {
        const scraper = new FightCardScraper(url, event.id, false);
        await scraper.run();
        done++;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`  ✗ Failed: ${msg}`);
        failed++;
      }

      await sleep(DELAY_MS);
    }

    console.log(`\n── Results ──────────────────────────────`);
    console.log(`  Processed : ${done}`);
    console.log(`  Failed    : ${failed}`);
    console.log(`  Total     : ${events.length}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
