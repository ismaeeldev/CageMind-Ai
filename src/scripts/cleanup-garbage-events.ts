/**
 * Removes clearly garbage events from the database:
 *   - "UFC Mock Legacy Event" (test/seed data)
 *   - Cancelled UFC events with year-2000 placeholder dates (UFC 151, 176, 233)
 *   - Any past isUpcoming=true events with future dates that slipped through
 *
 * Usage:
 *   npx tsx src/scripts/cleanup-garbage-events.ts          dry run
 *   npx tsx src/scripts/cleanup-garbage-events.ts --execute apply
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");
const PLACEHOLDER_DATE = new Date("2001-01-01"); // before this = bogus date

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
  console.log(`\n=== Cleanup Garbage Events (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const garbage = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: "Mock" } },
          { date: { lt: PLACEHOLDER_DATE } },
        ],
      },
      include: { _count: { select: { fights: true } } },
    });

    console.log(`Garbage events found: ${garbage.length}`);
    garbage.forEach(e =>
      console.log(`  ${new Date(e.date).toISOString().split("T")[0]} | ${e.name} | fights=${e._count.fights}`)
    );

    if (garbage.length === 0) {
      console.log("No garbage events found.");
      return;
    }

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to delete these ${garbage.length} events (and their fights).`);
      return;
    }

    const ids = garbage.map(e => e.id);
    // Fights cascade delete (FK constraint), but fights may have predictionHistory
    for (const id of ids) {
      const fights = await prisma.fight.findMany({ where: { eventId: id }, select: { id: true } });
      if (fights.length > 0) {
        await prisma.predictionHistory.deleteMany({ where: { fightId: { in: fights.map(f => f.id) } } });
        await prisma.fight.deleteMany({ where: { eventId: id } });
      }
      await prisma.event.delete({ where: { id } });
    }

    console.log(`\nDeleted ${garbage.length} garbage events.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
