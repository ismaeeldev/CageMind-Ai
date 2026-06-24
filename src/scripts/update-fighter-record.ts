/**
 * Scrapes ONLY the pro record (wins/losses/draws) from each fighter's UFC.com page.
 * Reads `.hero-profile__division-body` which shows e.g. "28-1-0 (W-L-D)".
 * No other fields are touched.
 *
 * Note: ELO is a separate calculation — run `npm run elo:recalculate` for that.
 *
 * Usage:
 *   Test one fighter (dry):   tsx src/scripts/update-fighter-record.ts --fighter "Jon Jones"
 *   Test one fighter (write): tsx src/scripts/update-fighter-record.ts --fighter "Jon Jones" --execute
 *   All fighters (dry):       tsx src/scripts/update-fighter-record.ts
 *   All fighters (write):     tsx src/scripts/update-fighter-record.ts --execute
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

const DRY_RUN  = !process.argv.includes("--execute");
const DELAY_MS = 700;

const singleArg = process.argv.indexOf("--fighter");
const SINGLE_FIGHTER = singleArg !== -1 ? process.argv[singleArg + 1] : null;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

function nameToSlug(name: string): string {
  return name
    .normalize("NFD").replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['''""\.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeName(name: string): string {
  return name.normalize("NFD").replace(/\p{M}/gu, "")
    .toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

interface RecordResult {
  wins: number;
  losses: number;
  draws: number;
  pageNameMatches: boolean;
}

async function scrapeRecord(ufcId: string | null, name: string): Promise<RecordResult | null> {
  const url = ufcId
    ? (ufcId.startsWith("http") ? ufcId : `https://www.ufc.com${ufcId}`)
    : `https://www.ufc.com/athlete/${nameToSlug(name)}`;

  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;

    const $ = cheerio.load(await res.text());

    // Verify it's the right fighter
    const pageName = $(".hero-profile__name").text().trim();
    const pageNameNorm = normalizeName(pageName);
    const dbNameNorm   = normalizeName(name);
    const pageNameMatches =
      pageNameNorm.includes(dbNameNorm) ||
      dbNameNorm.includes(pageNameNorm) ||
      pageNameNorm.split(" ").some(w => w.length > 2 && dbNameNorm.includes(w));

    if (!pageNameMatches) {
      console.warn(`  ⚠  Name mismatch: DB="${name}" Page="${pageName}" — skipping`);
      return { wins: 0, losses: 0, draws: 0, pageNameMatches: false };
    }

    // e.g. "28-1-0 (W-L-D)"
    const recordText = $(".hero-profile__division-body").text().trim();
    const match = recordText.match(/(\d+)-(\d+)-(\d+)/);

    if (!match) {
      console.warn(`  ⚠  No record found for ${name} (text: "${recordText}")`);
      return { wins: 0, losses: 0, draws: 0, pageNameMatches: true };
    }

    return {
      wins:   parseInt(match[1]),
      losses: parseInt(match[2]),
      draws:  parseInt(match[3]),
      pageNameMatches: true,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (SINGLE_FIGHTER) console.error(`  fetch error for ${name}: ${msg}`);
    return null;
  }
}

async function main() {
  console.log(`\n=== Update Fighter Record (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===`);
  console.log(`Only "wins", "losses", "draws" are updated — nothing else touched.`);
  console.log(`ELO is NOT updated here; run: npm run elo:recalculate\n`);
  if (SINGLE_FIGHTER) console.log(`Testing on single fighter: "${SINGLE_FIGHTER}"\n`);

  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const where = SINGLE_FIGHTER
      ? { name: { contains: SINGLE_FIGHTER, mode: "insensitive" as const } }
      : {};

    const fighters = await prisma.fighter.findMany({
      where,
      select: { id: true, name: true, ufcId: true, wins: true, losses: true, draws: true },
      orderBy: { name: "asc" },
    });

    console.log(`Fighters to process: ${fighters.length}\n`);

    let updated = 0, skipped = 0, noRecord = 0, nameMismatch = 0;

    for (let i = 0; i < fighters.length; i++) {
      const f = fighters[i];
      const result = await scrapeRecord(f.ufcId, f.name);

      if (!result) {
        console.log(`  [NOT FOUND] ${f.name}`);
        skipped++;
      } else if (!result.pageNameMatches) {
        nameMismatch++;
      } else if (result.wins === 0 && result.losses === 0 && result.draws === 0) {
        // Could be 0-0-0 or a failed parse — log but don't update unless already 0
        if (f.wins !== 0 || f.losses !== 0) {
          console.log(`  [NO RECORD] ${f.name} — parse returned 0-0-0, keeping existing ${f.wins}-${f.losses}-${f.draws}`);
          noRecord++;
        }
      } else {
        const changed = result.wins !== f.wins || result.losses !== f.losses || result.draws !== f.draws;
        if (changed) {
          console.log(`  [UPDATED  ] ${f.name}: ${f.wins}-${f.losses}-${f.draws} → ${result.wins}-${result.losses}-${result.draws}`);
          if (!DRY_RUN) {
            await prisma.fighter.update({
              where: { id: f.id },
              data: { wins: result.wins, losses: result.losses, draws: result.draws },
            });
          }
          updated++;
        } else {
          if (SINGLE_FIGHTER) console.log(`  [SAME     ] ${f.name} — record already ${f.wins}-${f.losses}-${f.draws}`);
        }
      }

      if ((i + 1) % 100 === 0 && !SINGLE_FIGHTER) {
        console.log(`  ── ${i + 1}/${fighters.length} processed — updated:${updated} skipped:${skipped}`);
      }

      await sleep(DELAY_MS);
    }

    console.log(`\n── Results ──────────────────────────────`);
    console.log(`  Total         : ${fighters.length}`);
    console.log(`  Updated       : ${updated}`);
    console.log(`  No record     : ${noRecord}`);
    console.log(`  Not found     : ${skipped}`);
    console.log(`  Name mismatch : ${nameMismatch}`);
    if (DRY_RUN) console.log(`\nRun with --execute to apply changes.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
