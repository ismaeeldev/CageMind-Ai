/**
 * Marks the correct fight as isTitleFight=true for events where
 * the main event fight exists in DB but isn't sorted first.
 *
 * Strategy: match each fight's fighter last-names against the event name
 * (e.g. "Fiziev vs Torres" → finds "Rafael Fiziev vs Manuel Torres").
 * The matched fight is marked isTitleFight=true so it sorts to the top.
 *
 * Also removes duplicate fight records within the same event.
 *
 * Usage:
 *   npx tsx src/scripts/fix-main-event-fights.ts           # dry run
 *   npx tsx src/scripts/fix-main-event-fights.ts --execute # apply
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

export const SUFFIX_RE = /\s+(jr\.?|sr\.?|ii|iii|iv|v)$/i;

/** Returns the meaningful last name, stripping Jr./Sr./II/III suffixes. */
function meaningfulLast(name: string): string {
  const cleaned = name.trim().replace(SUFFIX_RE, "").trim();
  return cleaned.split(/\s+/).pop()!.toLowerCase();
}

/**
 * Given an event name like "Fiziev vs Torres" or "Ankalaev vs Rountree Jr.",
 * find the fight in the event whose fighter last-names best match the two name parts.
 * Returns the fight ID or null.
 */
function findMainEventFight(
  eventName: string,
  fights: { id: string; fighter1: { name: string }; fighter2: { name: string } }[],
): string | null {
  const vsMatch = eventName.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (!vsMatch) return null;

  const last1 = meaningfulLast(vsMatch[1]);
  const last2 = meaningfulLast(vsMatch[2]);

  for (const fight of fights) {
    const f1Last = meaningfulLast(fight.fighter1.name);
    const f2Last = meaningfulLast(fight.fighter2.name);

    const matched =
      (f1Last.includes(last1) || last1.includes(f1Last)) &&
      (f2Last.includes(last2) || last2.includes(f2Last));

    const matchedSwapped =
      (f1Last.includes(last2) || last2.includes(f1Last)) &&
      (f2Last.includes(last1) || last1.includes(f2Last));

    if (matched || matchedSwapped) return fight.id;
  }

  return null;
}

/**
 * Core fix logic — exported so the daily cron can call it directly.
 * Accepts any Prisma client (Pool+PrismaPg or the @/lib/db singleton).
 */
export async function fixMainEventFights(
  prisma: PrismaClient,
  dryRun = false,
): Promise<{ markedMain: number; removedDupes: number }> {
  const events = await prisma.event.findMany({
    where: { isUpcoming: true },
    include: {
      fights: {
        include: {
          fighter1: { select: { name: true } },
          fighter2: { select: { name: true } },
        },
      },
    },
  });

  let markedMain = 0;
  let removedDupes = 0;

  for (const event of events) {
    if (event.fights.length === 0) continue;

    // ── 1. Remove duplicate fights (matched by fighter name pair) ──────────────
    const seen = new Map<string, string>();
    const dupIds: string[] = [];

    for (const fight of event.fights) {
      const key = [fight.fighter1.name, fight.fighter2.name]
        .map(n => n.toLowerCase().trim())
        .sort()
        .join("|");

      if (seen.has(key)) {
        dupIds.push(fight.id);
      } else {
        seen.set(key, fight.id);
      }
    }

    for (const dupId of dupIds) {
      const dup = event.fights.find(f => f.id === dupId)!;
      console.log(`[MainEventFix] DUPE removed: ${event.name} — ${dup.fighter1.name} vs ${dup.fighter2.name}`);
      if (!dryRun) await prisma.fight.delete({ where: { id: dupId } }).catch(() => {});
      removedDupes++;
    }

    // ── 2. Skip if main event already marked ──────────────────────────────────
    if (event.fights.some(f => f.isTitleFight)) continue;

    // ── 3. Find fight that matches the event name ─────────────────────────────
    const mainId = findMainEventFight(event.name, event.fights);
    if (!mainId) continue;

    const mainFight = event.fights.find(f => f.id === mainId)!;
    console.log(`[MainEventFix] MAIN marked: ${event.name} → ${mainFight.fighter1.name} vs ${mainFight.fighter2.name}`);
    if (!dryRun) {
      await prisma.fight.update({ where: { id: mainId }, data: { isTitleFight: true } });
    }
    markedMain++;
  }

  return { markedMain, removedDupes };
}

// ── Standalone script entry-point ─────────────────────────────────────────────
async function main() {
  console.log(`\n=== Fix Main Event Fights (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const { markedMain, removedDupes } = await fixMainEventFights(prisma, DRY_RUN);

    console.log(`\n── Summary ──────────────────────────────────────────`);
    console.log(`  Main events marked : ${markedMain}`);
    console.log(`  Duplicates removed : ${removedDupes}`);
    if (DRY_RUN) console.log(`\n  Dry run — add --execute to apply.`);
    else         console.log(`\n  ✓ Changes written to DB.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
