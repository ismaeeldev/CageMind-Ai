/**
 * Audit and correct isTitleFight flags on all Fight records.
 *
 * Source of truth: a fight is a title fight if and only if its weightClass
 * field contains at least one title keyword (title, championship, interim,
 * undisputed). This matches how both UFC.com and Tapology label bouts.
 *
 * Two corrections are applied:
 *   FALSE POSITIVE — isTitleFight=true but no title keyword in weightClass
 *     → reset to false
 *   FALSE NEGATIVE — isTitleFight=false but weightClass contains a title keyword
 *     → set to true, also normalise weightClass to just the division name
 *
 * Weight class normalisation:
 *   "Lightweight Title Bout" → "Lightweight"  (keeps only the division)
 *
 * Usage:
 *   npm run fights:fix-titles-dry   # preview
 *   npm run fights:fix-titles       # apply
 *
 * After --execute run: npm run elo:recalculate
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

const TITLE_KEYWORDS = ["title", "championship", "interim", "undisputed"];

const DIVISION_RE =
  /strawweight|atomweight|flyweight|bantamweight|featherweight|lightweight|welterweight|middleweight|light heavyweight|heavyweight/i;

function hasTitleKeyword(wc: string | null): boolean {
  if (!wc) return false;
  const lower = wc.toLowerCase();
  return TITLE_KEYWORDS.some((kw) => lower.includes(kw));
}

function normaliseDivision(wc: string): string {
  const match = wc.match(DIVISION_RE);
  if (!match) return wc;
  return match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

function freshClient() {
  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 60_000,
    idleTimeoutMillis: 30_000,
    max: 5,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const cleanup = async () => {
    try { await prisma.$disconnect(); } catch {}
    try { await pool.end(); } catch {}
  };
  return { prisma, cleanup };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Fix isTitleFight Flags (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const { prisma, cleanup } = freshClient();

  try {
    const allFights = await prisma.fight.findMany({
      select: {
        id: true,
        isTitleFight: true,
        weightClass: true,
        fighter1: { select: { name: true } },
        fighter2: { select: { name: true } },
        event: { select: { name: true } },
      },
    });

    console.log(`Loaded ${allFights.length} fight records.\n`);

    const falsePositives: typeof allFights = []; // flagged true, should be false
    const falseNegatives: typeof allFights = []; // flagged false, should be true

    for (const f of allFights) {
      const isTitle = hasTitleKeyword(f.weightClass);
      if (f.isTitleFight && !isTitle) falsePositives.push(f);
      if (!f.isTitleFight && isTitle) falseNegatives.push(f);
    }

    console.log(`False positives (isTitleFight=true, no title keyword in weightClass): ${falsePositives.length}`);
    for (const f of falsePositives) {
      console.log(`  [RESET→false]  ${f.event.name}  |  ${f.fighter1.name} vs ${f.fighter2.name}  |  weightClass: "${f.weightClass}"`);
    }

    console.log(`\nFalse negatives (isTitleFight=false, title keyword present): ${falseNegatives.length}`);
    for (const f of falseNegatives) {
      const normalised = normaliseDivision(f.weightClass || "");
      console.log(`  [SET→true]     ${f.event.name}  |  ${f.fighter1.name} vs ${f.fighter2.name}  |  weightClass: "${f.weightClass}" → "${normalised}"`);
    }

    if (falsePositives.length === 0 && falseNegatives.length === 0) {
      console.log("\nAll isTitleFight flags are correct. Nothing to do.");
      return;
    }

    if (DRY_RUN) {
      console.log("\nDry-run complete — no changes made.");
      console.log("Re-run with --execute (npm run fights:fix-titles) to apply.");
      return;
    }

    console.log("\nApplying corrections...");

    // Reset false positives
    if (falsePositives.length > 0) {
      const fpIds = falsePositives.map((f) => f.id);
      const { count } = await prisma.fight.updateMany({
        where: { id: { in: fpIds } },
        data: { isTitleFight: false },
      });
      console.log(`  Reset ${count} false-positive fight(s) → isTitleFight=false`);
    }

    // Fix false negatives — also normalise weight class
    for (const f of falseNegatives) {
      const normalised = normaliseDivision(f.weightClass || "");
      await prisma.fight.update({
        where: { id: f.id },
        data: { isTitleFight: true, weightClass: normalised },
      });
    }
    if (falseNegatives.length > 0) {
      console.log(`  Corrected ${falseNegatives.length} false-negative fight(s) → isTitleFight=true, weightClass normalised`);
    }

    // Also normalise weightClass on confirmed title fights that still carry "Title Bout" etc.
    const confirmedTitles = await prisma.fight.findMany({
      where: { isTitleFight: true },
      select: { id: true, weightClass: true },
    });

    let normCount = 0;
    for (const f of confirmedTitles) {
      if (!f.weightClass) continue;
      const normalised = normaliseDivision(f.weightClass);
      if (normalised !== f.weightClass) {
        await prisma.fight.update({
          where: { id: f.id },
          data: { weightClass: normalised },
        });
        normCount++;
      }
    }
    if (normCount > 0) {
      console.log(`  Normalised weightClass on ${normCount} confirmed title fight(s)`);
    }

    console.log("\nCorrections applied.");
    console.log("Run `npm run elo:recalculate` to rebuild ELO (K-factor differs for title fights).");
  } finally {
    await cleanup();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
