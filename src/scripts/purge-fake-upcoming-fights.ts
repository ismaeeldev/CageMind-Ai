/**
 * Deletes all fights attached to upcoming events.
 * Every fight on an upcoming event is fake/placeholder — no real announced
 * cards have been scraped. Deleting them lets the API attempt a real scrape
 * on the next page visit, and shows the proper empty state instead of fake data.
 *
 * Usage:
 *   npm run fights:purge-upcoming-dry    — count only, no changes
 *   npm run fights:purge-upcoming        — delete
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
  console.log(`\n=== Purge Fake Upcoming-Event Fights (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Count upcoming events that have fights
    const upcomingWithFights = await prisma.event.findMany({
      where: {
        isUpcoming: true,
        fights: { some: {} },
      },
      select: {
        id: true,
        name: true,
        date: true,
        _count: { select: { fights: true } },
      },
      orderBy: { date: "asc" },
    });

    const totalFights = upcomingWithFights.reduce((s, e) => s + e._count.fights, 0);

    console.log(`Upcoming events with fights: ${upcomingWithFights.length}`);
    console.log(`Total fake fights to remove: ${totalFights}\n`);

    for (const event of upcomingWithFights) {
      console.log(`  ${new Date(event.date).toISOString().split("T")[0]} | ${event.name} — ${event._count.fights} fights`);
    }

    if (DRY_RUN) {
      console.log(`\nDry run complete. Run with --execute to delete these fights.`);
      return;
    }

    // Delete all fights on upcoming events
    const result = await prisma.fight.deleteMany({
      where: {
        event: { isUpcoming: true },
      },
    });

    console.log(`\nDeleted ${result.count} fake fights from upcoming events.`);
    console.log(`Upcoming event pages will now show the real empty state instead of fake bouts.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
