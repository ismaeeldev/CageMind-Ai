/**
 * Identifies and removes fake/placeholder fights from past events.
 *
 * A fight on a past event is fake if it has no recorded winner (winnerId = null).
 * Real fights that were properly scraped always have a winner set.
 * Fake seeded fights were never real matches and have no result.
 *
 * Usage:
 *   npm run fights:purge-past-dry   — count only, show breakdown
 *   npm run fights:purge-past       — delete
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

async function main() {
  console.log(`\n=== Purge Fake Past-Event Fights (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Past events that have at least one fight with no winner
    const eventsWithFakeFights = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        fights: { some: { winnerId: null } },
      },
      select: {
        id: true,
        name: true,
        date: true,
        fights: {
          where: { winnerId: null },
          select: { id: true, fighter1: { select: { name: true } }, fighter2: { select: { name: true } } },
        },
        _count: { select: { fights: true } },
      },
      orderBy: { date: "desc" },
    });

    const fakeFightCount = eventsWithFakeFights.reduce((s, e) => s + e.fights.length, 0);
    const affectedEvents = eventsWithFakeFights.length;

    console.log(`Past events with fake/unresolved fights: ${affectedEvents}`);
    console.log(`Fake fights to remove:                  ${fakeFightCount}\n`);

    // Show a sample of what will be deleted
    const sample = eventsWithFakeFights.slice(0, 20);
    for (const event of sample) {
      const date = new Date(event.date).toISOString().split("T")[0];
      console.log(`  ${date} | ${event.name} — ${event.fights.length} fake / ${event._count.fights} total`);
      for (const f of event.fights.slice(0, 3)) {
        console.log(`      ✗ ${f.fighter1?.name ?? "?"} vs ${f.fighter2?.name ?? "?"}`);
      }
      if (event.fights.length > 3) {
        console.log(`      ... and ${event.fights.length - 3} more`);
      }
    }
    if (eventsWithFakeFights.length > 20) {
      console.log(`  ... and ${eventsWithFakeFights.length - 20} more events`);
    }

    if (DRY_RUN) {
      console.log(`\nDry run complete. Run with --execute to delete these fights.`);
      return;
    }

    // Delete all past-event fights with no winner
    const result = await prisma.fight.deleteMany({
      where: {
        event: { isUpcoming: false },
        winnerId: null,
      },
    });

    console.log(`\nDeleted ${result.count} fake fights from past events.`);

    // Check how many past events now have zero fights
    const emptyPastEvents = await prisma.event.count({
      where: {
        isUpcoming: false,
        fights: { none: {} },
      },
    });
    console.log(`Past events now showing empty state: ${emptyPastEvents}`);
    console.log(`These will display "Results Not Yet Synced" instead of fake fights.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
