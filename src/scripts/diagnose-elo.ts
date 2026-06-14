import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { isUFCEvent } from "../lib/elo";

async function diagnoseElo() {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  let connStr = raw;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    connStr = u.toString();
  } catch {}

  const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const now = new Date();

    // ── Fight counts ──────────────────────────────────────────────────────────
    const totalFights = await prisma.fight.count();
    const fightsWithWinner = await prisma.fight.count({ where: { winnerId: { not: null } } });
    const fightsInPastByFlag = await prisma.fight.count({ where: { event: { isUpcoming: false } } });
    const fightsInPastByDate = await prisma.fight.count({ where: { event: { date: { lt: now } } } });
    const eligibleOld = await prisma.fight.count({ where: { winnerId: { not: null }, event: { isUpcoming: false } } });
    const eligibleNew = await prisma.fight.count({ where: { winnerId: { not: null }, event: { OR: [{ isUpcoming: false }, { date: { lt: now } }] } } });

    console.log("\n═══ FIGHT COUNTS ═══════════════════════════════════════════");
    console.log(`  Total fights in DB:                        ${totalFights}`);
    console.log(`  Fights with winnerId set:                  ${fightsWithWinner}`);
    console.log(`  Fights in past events (isUpcoming=false):  ${fightsInPastByFlag}`);
    console.log(`  Fights in past events (date < now):        ${fightsInPastByDate}`);
    console.log(`  Eligible for Elo (old filter):             ${eligibleOld}  ← what old script used`);
    console.log(`  Eligible for Elo (new filter):             ${eligibleNew}  ← what fixed script uses`);

    // ── Elo distribution ─────────────────────────────────────────────────────
    const totalFighters = await prisma.fighter.count();
    const at1300 = await prisma.fighter.count({ where: { eloRating: 1300 } });
    const above1300 = await prisma.fighter.count({ where: { eloRating: { gt: 1300 } } });
    const below1300 = await prisma.fighter.count({ where: { eloRating: { lt: 1300 } } });

    console.log("\n═══ ELO DISTRIBUTION ═══════════════════════════════════════");
    console.log(`  Total fighters:    ${totalFighters}`);
    console.log(`  At 1300 (no data): ${at1300}  (${((at1300 / totalFighters) * 100).toFixed(1)}%)`);
    console.log(`  Above 1300:        ${above1300}`);
    console.log(`  Below 1300:        ${below1300}`);

    // ── Past event names vs isUFCEvent() ─────────────────────────────────────
    const pastEvents = await prisma.event.findMany({
      where: { OR: [{ isUpcoming: false }, { date: { lt: now } }] },
      select: { name: true, date: true, isUpcoming: true },
      orderBy: { date: "desc" },
      take: 30,
    });

    console.log("\n═══ PAST EVENT NAMES (newest 30) ════════════════════════════");
    let ufcMatched = 0;
    let notMatched = 0;
    for (const ev of pastEvents) {
      const isUFC = isUFCEvent(ev.name);
      const flag = ev.isUpcoming ? "[still upcoming flag!]" : "";
      console.log(`  [${isUFC ? "UFC ✓" : "SKIP ✗"}] ${ev.name} ${flag}`);
      isUFC ? ufcMatched++ : notMatched++;
    }
    console.log(`\n  Matched as UFC: ${ufcMatched} / ${pastEvents.length}`);
    console.log(`  Skipped (non-UFC or no match): ${notMatched} / ${pastEvents.length}`);

    console.log("\n═══ SUMMARY ═════════════════════════════════════════════════");
    if (eligibleNew === 0) {
      console.log("  ⚠  PROBLEM: 0 fights are eligible for Elo calculation.");
      console.log("     Either no fights have winnerId set, or all events are still upcoming.");
    } else if (notMatched === pastEvents.length) {
      console.log("  ⚠  PROBLEM: isUFCEvent() matched 0 event names. All Elo deltas will be 0.");
    } else {
      console.log(`  ✓  ${eligibleNew} fights eligible. Run: npm run elo:recalculate`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

diagnoseElo().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
