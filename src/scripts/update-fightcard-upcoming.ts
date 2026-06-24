/**
 * Updates fight cards for ALL UPCOMING events (isUpcoming = true).
 *
 * Scrapes the current announced bouts from each upcoming event's UFC.com page.
 * Safe to re-run at any time — existing fights are updated, new bouts are added.
 *
 * This script does NOT touch gh-cron-daily.ts or gh-cron-weekly.ts.
 *
 * Usage:
 *   npx tsx src/scripts/update-fightcard-upcoming.ts
 */

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { FightCardScraper } from "../scrapers/fight-card-scraper";

const DELAY_MS = 2000;

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
  console.log("\n=== Update Fight Cards — Upcoming Events ===\n");

  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const events = await prisma.event.findMany({
      where: { isUpcoming: true },
      orderBy: { date: "asc" },
      select: { id: true, name: true, date: true },
    });

    console.log(`Upcoming events found: ${events.length}\n`);

    if (events.length === 0) {
      console.log("No upcoming events in DB. Run npm run gh:cron-daily first to sync events.");
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
