/**
 * Purge fake/fallback fight results from the database.
 *
 * The PostEventProcessor used to simulate results when scrapers returned no
 * winner data, always writing exactly:
 *   { winnerId: <random>, method: "KO/TKO"|"Submission", endingRound: 1, endingTime: "2:30" }
 *
 * Two strategies are applied depending on the event:
 *
 *   ALL-FAKE event  — every fight carries the fake signature →
 *     Delete the fight rows entirely and reset isProcessed: false.
 *
 *   MIXED event — some fights carry the fake signature, some have real results →
 *     Clear only the fake result fields (winnerId, method, endingRound,
 *     endingTime → null) on the affected fights. The fight structure (fighters,
 *     weight class, isTitleFight) is real and is preserved.
 *     Reset isProcessed: false so the scheduler re-scrapes results.
 *
 * Usage:
 *   npm run fights:purge-dry     # preview — no writes
 *   npm run fights:purge         # apply changes
 *
 * After --execute always run:
 *   npm run elo:recalculate
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

// ─── DB helpers ───────────────────────────────────────────────────────────────

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

function freshClient() {
  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 60_000,
    idleTimeoutMillis: 30_000,
    max: 5,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const cleanup = async () => {
    try { await prisma.$disconnect(); } catch {}
    try { await pool.end(); } catch {}
  };
  return { prisma, cleanup };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Purge Fake Fight Results (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const { prisma, cleanup } = freshClient();

  try {
    // All fights whose results carry the fake processor signature
    const suspectFights = await prisma.fight.findMany({
      where: {
        endingRound: 1,
        endingTime: "2:30",
        winnerId: { not: null },
      },
      select: {
        id: true,
        eventId: true,
        fighter1: { select: { name: true } },
        fighter2: { select: { name: true } },
        event: { select: { name: true, isProcessed: true } },
      },
    });

    if (suspectFights.length === 0) {
      console.log("No fake-signature fights found. Database is clean.");
      return;
    }

    console.log(`Found ${suspectFights.length} fight(s) with fake signature { endingRound: 1, endingTime: "2:30" }\n`);

    // Group by event
    const byEvent = new Map<string, typeof suspectFights>();
    for (const f of suspectFights) {
      const list = byEvent.get(f.eventId) ?? [];
      list.push(f);
      byEvent.set(f.eventId, list);
    }

    // Classify each event
    const allFakeEventIds: string[] = [];
    const mixedEvents: Array<{ eventId: string; name: string; fakeIds: string[] }> = [];

    for (const [eventId, fakes] of byEvent.entries()) {
      const total = await prisma.fight.count({ where: { eventId } });
      const eventName = fakes[0].event.name;

      if (total === fakes.length) {
        allFakeEventIds.push(eventId);
        console.log(`[ALL-FAKE]  ${eventName} — all ${total} fight(s) are fake`);
        for (const f of fakes) {
          console.log(`            - ${f.fighter1.name} vs ${f.fighter2.name}`);
        }
      } else {
        mixedEvents.push({ eventId, name: eventName, fakeIds: fakes.map(f => f.id) });
        console.log(`[MIXED]     ${eventName} — ${fakes.length}/${total} fights have fake results`);
        for (const f of fakes) {
          console.log(`            - ${f.fighter1.name} vs ${f.fighter2.name} (will clear result)`);
        }
      }
      console.log();
    }

    console.log(`Summary:`);
    console.log(`  All-fake events (fights will be deleted)    : ${allFakeEventIds.length}`);
    console.log(`  Mixed events (fake results will be cleared) : ${mixedEvents.length}`);
    console.log(`  Individual fake results to clear            : ${mixedEvents.reduce((n, e) => n + e.fakeIds.length, 0)}`);

    if (DRY_RUN) {
      console.log("\nDry-run mode — no changes made.");
      console.log("Re-run with --execute (npm run fights:purge) to apply.");
      return;
    }

    console.log("\nApplying changes...\n");

    // ── Strategy 1: All-fake events → delete fights entirely ──────────────────
    for (const eventId of allFakeEventIds) {
      const deleted = await prisma.fight.deleteMany({ where: { eventId } });
      await prisma.event.update({
        where: { id: eventId },
        data: { isProcessed: false },
      });
      console.log(`  [DELETED]  event ${eventId} — removed ${deleted.count} fake fight(s), reset isProcessed.`);
    }

    // ── Strategy 2: Mixed events → clear fake result fields ───────────────────
    for (const { eventId, name, fakeIds } of mixedEvents) {
      // Clear result columns on each fake fight — fight structure stays intact
      await prisma.fight.updateMany({
        where: { id: { in: fakeIds } },
        data: {
          winnerId: null,
          method: null,
          endingRound: null,
          endingTime: null,
        },
      });

      // Reset the event so the scheduler will re-scrape results
      await prisma.event.update({
        where: { id: eventId },
        data: { isProcessed: false },
      });

      console.log(`  [CLEARED]  ${name} — cleared ${fakeIds.length} fake result(s), reset isProcessed.`);
    }

    const totalFakeResultsCleared = mixedEvents.reduce((n, e) => n + e.fakeIds.length, 0);
    console.log(`\nPurge complete.`);
    console.log(`  All-fake events deleted  : ${allFakeEventIds.length}`);
    console.log(`  Mixed-event results cleared : ${totalFakeResultsCleared} fights across ${mixedEvents.length} events`);
    console.log("\nNext step: run `npm run elo:recalculate` to rebuild ELO from clean data.");
  } finally {
    await cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
