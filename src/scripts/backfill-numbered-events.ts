/**
 * backfill-numbered-events.ts
 *
 * Scrapes fight results for ALL numbered UFC events (e.g. UFC 100 → UFC 320)
 * directly from UFC.com — no Tapology needed.
 *
 * UFC.com returns full HTML with fight results for past numbered events.
 * Upcoming events return ~50KB shell pages with 0 fights (safe to skip).
 *
 * Usage: npx tsx src/scripts/backfill-numbered-events.ts
 * Then:  npx tsx src/scripts/recalculate-elo.ts
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { FightCardScraper } from "../scrapers/fight-card-scraper";

// ─── DB setup (TCP, no WebSocket) ────────────────────────────────────────────
function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 60000,
  max: 3,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── Config ───────────────────────────────────────────────────────────────────
const START_EVENT = 100;   // Start from UFC 100
const END_EVENT   = 320;   // Up to UFC 320 (adjust as needed)
const DELAY_MS    = 1500;  // Polite delay between requests

async function backfillNumberedEvents() {
  console.log(`\nStarting numbered UFC event backfill (UFC ${START_EVENT} → UFC ${END_EVENT})...`);
  console.log("This will take ~10-15 minutes. Past events with results will be saved.\n");

  // Ensure all numbered events exist in the DB first
  // (upsert by name so we don't create duplicates)
  let scraped = 0;
  let skipped = 0;
  let failed  = 0;
  for (let num = END_EVENT; num >= START_EVENT; num--) {
    const eventName = `UFC ${num}`;
    const url = `https://www.ufc.com/event/ufc-${num}`;

    try {
      // Find or create the event (name is not @unique so we use findFirst + create)
      let event = await prisma.event.findFirst({ where: { name: eventName } });
      if (!event) {
        event = await prisma.event.create({
          data: {
            name: eventName,
            date: new Date("2000-01-01"), // placeholder date
            isUpcoming: false,
          }
        });
      }

      // Skip if already backfilled with fights
      const existingFight = await prisma.fight.findFirst({ where: { eventId: event.id } });
      if (existingFight) {
        process.stdout.write(`UFC ${num} ... skip (already backfilled)\n`);
        skipped++;
        continue;
      }

      process.stdout.write(`UFC ${num} ... `);

      const scraper = new FightCardScraper(url, event.id, false);
      const fights = await scraper.run();

      if (!fights || fights.length === 0) {
        process.stdout.write(`skip (upcoming or no data)\n`);
        skipped++;
      } else {
        process.stdout.write(`✓ ${fights.length} fights saved\n`);
        scraped++;
      }
    } catch (err: any) {
      process.stdout.write(`UFC ${num} ... ✗ error: ${err?.message || err}\n`);
      failed++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`Backfill complete!`);
  console.log(`  Events with fights: ${scraped}`);
  console.log(`  Events skipped (no data): ${skipped}`);
  console.log(`  Events failed: ${failed}`);
  console.log(`\nNow run: npx tsx src/scripts/recalculate-elo.ts`);
}

backfillNumberedEvents()
  .catch(e => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
