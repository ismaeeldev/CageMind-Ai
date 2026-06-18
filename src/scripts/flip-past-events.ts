/**
 * Finds events still marked isUpcoming=true whose date is in the past,
 * and flips them to isUpcoming=false so they appear in the Performance Tab.
 *
 * Today: 2026-06-17
 *
 * Usage:
 *   npm run events:flip-past-dry    preview
 *   npm run events:flip-past        apply
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");
const NOW = new Date();

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
  console.log(`\n=== Flip Past Events to isUpcoming=false (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===`);
  console.log(`Today: ${NOW.toISOString().split("T")[0]}\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const pastButFlagged = await prisma.event.findMany({
      where: {
        isUpcoming: true,
        date: { lt: NOW },
      },
      select: {
        id: true,
        name: true,
        date: true,
        _count: { select: { fights: true } },
      },
      orderBy: { date: "asc" },
    });

    console.log(`Events still marked isUpcoming=true but date is in the past: ${pastButFlagged.length}\n`);
    pastButFlagged.forEach(e => {
      const dateStr = new Date(e.date).toISOString().split("T")[0];
      console.log(`  ${dateStr} | ${e.name} | fights=${e._count.fights}`);
    });

    if (pastButFlagged.length === 0) {
      console.log("All events are correctly flagged. Nothing to do.");
      return;
    }

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to flip ${pastButFlagged.length} events to isUpcoming=false.`);
      return;
    }

    const ids = pastButFlagged.map(e => e.id);
    const { count } = await prisma.event.updateMany({
      where: { id: { in: ids } },
      data: { isUpcoming: false },
    });

    console.log(`\nFlipped ${count} events to isUpcoming=false.`);
    console.log("These events will now appear in the Performance Tab once fight results are scraped.");
    console.log("Next: the fight card API will auto-attempt to scrape when users visit each event page.");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
