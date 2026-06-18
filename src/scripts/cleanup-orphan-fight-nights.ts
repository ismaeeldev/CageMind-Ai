/**
 * Deletes short-name orphan Fight Night placeholder events that have no fights.
 * These were original seed data with abbreviated names like "Muhammad vs Bonfim"
 * instead of the proper "UFC Fight Night: Belal Muhammad vs. Gabriel Bonfim".
 *
 * Also fixes "UFC Fight Night: Song vs. Figueiredo" (2026-11-23) which is a
 * future event incorrectly marked isUpcoming=false.
 *
 * Usage:
 *   npx tsx src/scripts/cleanup-orphan-fight-nights.ts          dry run
 *   npx tsx src/scripts/cleanup-orphan-fight-nights.ts --execute apply
 */

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

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
  console.log(`\n=== Cleanup Orphan Fight Night Events (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Find past events with no fights, no "UFC " prefix (short-name placeholders)
    const orphans = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        fights: { none: {} },
        NOT: { name: { startsWith: "UFC " } },
      },
      select: { id: true, name: true, date: true },
      orderBy: { date: "desc" },
    });

    console.log(`Orphan events to delete: ${orphans.length}`);
    orphans.forEach(e => {
      const d = new Date(e.date).toISOString().split("T")[0];
      console.log(`  ${d} | ${e.name}`);
    });

    // Also find future "Song vs Figueiredo" marked as past
    const futureSong = await prisma.event.findMany({
      where: {
        name: { contains: "Song", mode: "insensitive" },
        date: { gt: new Date() },
        isUpcoming: false,
      },
      select: { id: true, name: true, date: true },
    });

    if (futureSong.length > 0) {
      console.log(`\nFuture events wrongly marked isUpcoming=false:`);
      futureSong.forEach(e => {
        const d = new Date(e.date).toISOString().split("T")[0];
        console.log(`  ${d} | ${e.name}`);
      });
    }

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to apply.`);
      return;
    }

    if (orphans.length > 0) {
      await prisma.event.deleteMany({ where: { id: { in: orphans.map(e => e.id) } } });
      console.log(`\nDeleted ${orphans.length} orphan events.`);
    }

    if (futureSong.length > 0) {
      await prisma.event.updateMany({
        where: { id: { in: futureSong.map(e => e.id) } },
        data: { isUpcoming: true },
      });
      console.log(`Fixed ${futureSong.length} future events → isUpcoming=true.`);
    }

    console.log("\nNow re-run fight nights backfill to pick up April–June 2026 events.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
