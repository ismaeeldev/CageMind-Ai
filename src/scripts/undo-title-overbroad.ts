/**
 * Undoes the over-broad title fight restore that set ALL 2262 numbered-event
 * past fights to isTitleFight=true (including prelims and co-mains).
 *
 * Strategy: reset all numbered-event past fights to isTitleFight=false,
 * then restore only genuine title fight signals:
 *  - Fight Night events with rounds=5 (Tapology sets rounds=5 for title bouts)
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
  console.log("\n=== Undo Over-Broad Title Fight Restore ===\n");

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // 1. Find all numbered-event past fights currently marked as title
    const numberedTitles = await prisma.fight.findMany({
      where: {
        isTitleFight: true,
        event: { isUpcoming: false },
      },
      select: { id: true, event: { select: { name: true } }, rounds: true },
    });

    const numberedIds = numberedTitles
      .filter(f => /^UFC\s+\d+/i.test(f.event.name))
      .map(f => f.id);

    console.log(`Numbered-event fights to reset: ${numberedIds.length}`);

    if (numberedIds.length > 0) {
      const { count } = await prisma.fight.updateMany({
        where: { id: { in: numberedIds } },
        data: { isTitleFight: false },
      });
      console.log(`Reset ${count} numbered-event fights → isTitleFight=false`);
    }

    // 2. Restore title flag for Fight Night 5-rounders (genuine title fights on FN events)
    const fnFiveRound = await prisma.fight.findMany({
      where: {
        isTitleFight: false,
        rounds: 5,
        winnerId: { not: null },
        event: { isUpcoming: false },
      },
      select: { id: true, event: { select: { name: true } }, fighter1: { select: { name: true } }, fighter2: { select: { name: true } } },
    });

    const fnOnly = fnFiveRound.filter(f => !/^UFC\s+\d+/i.test(f.event.name));
    console.log(`\nFight Night 5-round fights to restore as title: ${fnOnly.length}`);
    fnOnly.slice(0, 10).forEach(f =>
      console.log(`  ${f.event.name} | ${f.fighter1.name} vs ${f.fighter2.name}`)
    );

    if (fnOnly.length > 0) {
      const { count } = await prisma.fight.updateMany({
        where: { id: { in: fnOnly.map(f => f.id) } },
        data: { isTitleFight: true },
      });
      console.log(`Restored ${count} Fight Night title fights`);
    }

    const totalTitle = await prisma.fight.count({ where: { isTitleFight: true } });
    console.log(`\nFinal isTitleFight=true count: ${totalTitle}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
