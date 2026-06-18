/**
 * Reverts the incorrect isTitleFight reset from fix-title-fights.ts.
 *
 * Two categories of wrongly reset fights:
 *
 * 1. Numbered PPV events (UFC 100, UFC 135, etc.) — ALL fights marked as
 *    isTitleFight=false that have real results (winnerId set). These were
 *    the main-event title bouts correctly identified by the UFC scraper via
 *    CSS class detection. They don't have "title" in weightClass because the
 *    scraper already cleaned it to just the division name.
 *    Strategy: restore all numbered-event fights with results to isTitleFight=true.
 *
 * 2. Fight Night events — title fights are scheduled for 5 rounds.
 *    Strategy: restore rounds=5 + isTitleFight=false + past event.
 *
 * Usage: npx tsx src/scripts/revert-title-fight-reset.ts --execute
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
  } catch { return raw; }
}

async function main() {
  console.log(`\n=== Revert Title Fight Reset (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Category 1: Numbered PPV events — restore all real fights to isTitleFight=true
    // Pattern: event name starts with "UFC " followed by digits (e.g., "UFC 300", "UFC 135")
    const numberedEventFights = await prisma.fight.findMany({
      where: {
        isTitleFight: false,
        winnerId: { not: null },
        event: {
          isUpcoming: false,
          name: { contains: "UFC " },
        },
      },
      select: {
        id: true,
        fighter1: { select: { name: true } },
        fighter2: { select: { name: true } },
        event: { select: { name: true } },
        weightClass: true,
      },
    });

    // Filter to strictly numbered events (UFC followed by a number, not "UFC Fight Night")
    const numberedOnly = numberedEventFights.filter(f => /^UFC\s+\d+/i.test(f.event.name));

    console.log(`Numbered PPV event fights to restore (isTitleFight→true): ${numberedOnly.length}`);
    numberedOnly.slice(0, 20).forEach(f =>
      console.log(`  ${f.event.name} | ${f.fighter1.name} vs ${f.fighter2.name} | wc=${f.weightClass}`)
    );
    if (numberedOnly.length > 20) console.log(`  ... and ${numberedOnly.length - 20} more`);

    // Category 2: Fight Night 5-rounders (these are title fights on fight nights)
    const fiveRoundFights = await prisma.fight.findMany({
      where: {
        isTitleFight: false,
        rounds: 5,
        winnerId: { not: null },
        event: { isUpcoming: false, name: { not: { contains: "UFC " } } },
      },
      select: {
        id: true,
        fighter1: { select: { name: true } },
        fighter2: { select: { name: true } },
        event: { select: { name: true } },
      },
    });

    console.log(`\nFight Night 5-round fights to restore: ${fiveRoundFights.length}`);
    fiveRoundFights.forEach(f =>
      console.log(`  ${f.event.name} | ${f.fighter1.name} vs ${f.fighter2.name}`)
    );

    const totalToRestore = numberedOnly.length + fiveRoundFights.length;
    console.log(`\nTotal to restore: ${totalToRestore}`);

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to apply.`);
      return;
    }

    if (numberedOnly.length > 0) {
      const { count } = await prisma.fight.updateMany({
        where: { id: { in: numberedOnly.map(f => f.id) } },
        data: { isTitleFight: true },
      });
      console.log(`\nRestored ${count} numbered-event fights → isTitleFight=true`);
    }

    if (fiveRoundFights.length > 0) {
      const { count } = await prisma.fight.updateMany({
        where: { id: { in: fiveRoundFights.map(f => f.id) } },
        data: { isTitleFight: true },
      });
      console.log(`Restored ${count} Fight Night 5-round fights → isTitleFight=true`);
    }

    console.log(`\nDone. Total restored: ${totalToRestore}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
