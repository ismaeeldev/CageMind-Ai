/**
 * Lists past events that have zero fight records — these show "Results Not Yet Synced"
 * and won't appear in the Performance Tab.
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const emptyPast = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        fights: { none: {} },
      },
      select: { id: true, name: true, date: true },
      orderBy: { date: "desc" },
    });

    console.log(`\nPast events with zero fights: ${emptyPast.length}\n`);
    emptyPast.slice(0, 30).forEach(e => {
      console.log(`  ${new Date(e.date).toISOString().split("T")[0]} | ${e.name}`);
    });
    if (emptyPast.length > 30) console.log(`  ... and ${emptyPast.length - 30} more`);

    // Also check: past events with fights but no predictions
    const noPredEvents = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        fights: {
          some: { winnerId: { not: null } },
          none: { aiPrediction: { not: null } },
        },
      },
      select: {
        id: true,
        name: true,
        date: true,
        _count: { select: { fights: true } },
      },
      orderBy: { date: "desc" },
      take: 20,
    });

    console.log(`\nPast events with fights but NO predictions: ${noPredEvents.length}\n`);
    noPredEvents.forEach(e =>
      console.log(`  ${new Date(e.date).toISOString().split("T")[0]} | ${e.name} | fights=${e._count.fights}`)
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
