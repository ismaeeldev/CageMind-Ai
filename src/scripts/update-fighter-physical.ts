/**
 * Scrapes ONLY physical attributes and method-of-victory stats from each fighter's UFC.com page.
 * Fields updated: age, height, reach, koWins, subWins
 * No other fields are touched (no wins/losses/draws, no imageUrl, no status).
 *
 * Selectors:
 *   age:     .c-bio__field with label "Age"         → .c-bio__text (inner div value)
 *   height:  .c-bio__field with label "Height"      → .c-bio__text text
 *   reach:   .c-bio__field with label "Reach"       → .c-bio__text text
 *   koWins:  .hero-profile__stat where stat-text = "Wins by Knockout" → stat-numb
 *   subWins: .hero-profile__stat where stat-text = "Wins by Submission" → stat-numb
 *
 * Usage:
 *   Test one fighter (dry):   tsx src/scripts/update-fighter-physical.ts --fighter "Jon Jones"
 *   Test one fighter (write): tsx src/scripts/update-fighter-physical.ts --fighter "Jon Jones" --execute
 *   All fighters (dry):       tsx src/scripts/update-fighter-physical.ts
 *   All fighters (write):     tsx src/scripts/update-fighter-physical.ts --execute
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

interface PhysicalResult {
  age:     number | null;
  height:  number | null;
  reach:   number | null;
  koWins:  number | null;
  subWins: number | null;
  pageNameMatches: boolean;
}

async function scrapePhysical(ufcId: string | null, name: string): Promise<PhysicalResult | null> {
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
      return { age: null, height: null, reach: null, koWins: null, subWins: null, pageNameMatches: false };
    }

    // ── Method of Victory from hero stats ────────────────────────────────────
    let koWins: number | null  = null;
    let subWins: number | null = null;

    $(".hero-profile__stat").each((_, el) => {
      const statText = $(el).find(".hero-profile__stat-text").text().toLowerCase();
      const statNum  = parseInt($(el).find(".hero-profile__stat-numb").text().trim());

      if (!isNaN(statNum)) {
        if (statText.includes("knockout")) koWins  = statNum;
        else if (statText.includes("submission")) subWins = statNum;
      }
    });

    // ── Physical attributes from bio section ─────────────────────────────────
    let age:    number | null = null;
    let height: number | null = null;
    let reach:  number | null = null;

    $(".c-bio__field").each((_, el) => {
      const label = $(el).find(".c-bio__label").text().trim().toLowerCase();
      // .c-bio__text may have a nested div for age — .text() gets all nested text
      const raw   = $(el).find(".c-bio__text").text().trim();

      if (label === "age") {
        const parsed = parseInt(raw);
        if (!isNaN(parsed) && parsed > 0 && parsed < 100) age = parsed;
      } else if (label === "height") {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed) && parsed > 0) height = parsed;
      } else if (label === "reach") {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed) && parsed > 0) reach = parsed;
      }
    });

    return { age, height, reach, koWins, subWins, pageNameMatches: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (SINGLE_FIGHTER) console.error(`  fetch error for ${name}: ${msg}`);
    return null;
  }
}

type Fighter = {
  id: string;
  name: string;
  ufcId: string | null;
  age: number | null;
  height: number | null;
  reach: number | null;
  koWins: number | null;
  subWins: number | null;
};

function hasChanged(f: Fighter, r: PhysicalResult): boolean {
  return (
    (r.age     !== null && r.age     !== f.age)     ||
    (r.height  !== null && r.height  !== f.height)  ||
    (r.reach   !== null && r.reach   !== f.reach)   ||
    (r.koWins  !== null && r.koWins  !== f.koWins)  ||
    (r.subWins !== null && r.subWins !== f.subWins)
  );
}

function buildUpdate(r: PhysicalResult): Record<string, number> {
  const data: Record<string, number> = {};
  if (r.age     !== null) data.age     = r.age;
  if (r.height  !== null) data.height  = r.height;
  if (r.reach   !== null) data.reach   = r.reach;
  if (r.koWins  !== null) data.koWins  = r.koWins;
  if (r.subWins !== null) data.subWins = r.subWins;
  return data;
}

async function main() {
  console.log(`\n=== Update Fighter Physical & Method-of-Victory (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===`);
  console.log(`Fields updated: age, height, reach, koWins, subWins — nothing else touched.\n`);
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
      select: { id: true, name: true, ufcId: true, age: true, height: true, reach: true, koWins: true, subWins: true },
      orderBy: { name: "asc" },
    }) as Fighter[];

    console.log(`Fighters to process: ${fighters.length}\n`);

    let updated = 0, skipped = 0, nameMismatch = 0;

    for (let i = 0; i < fighters.length; i++) {
      const f = fighters[i];
      const result = await scrapePhysical(f.ufcId, f.name);

      if (!result) {
        console.log(`  [NOT FOUND] ${f.name}`);
        skipped++;
      } else if (!result.pageNameMatches) {
        nameMismatch++;
      } else {
        if (hasChanged(f, result)) {
          const before = `age:${f.age} ht:${f.height} reach:${f.reach} ko:${f.koWins} sub:${f.subWins}`;
          const after  = `age:${result.age} ht:${result.height} reach:${result.reach} ko:${result.koWins} sub:${result.subWins}`;
          console.log(`  [UPDATED  ] ${f.name}`);
          console.log(`              before: ${before}`);
          console.log(`              after:  ${after}`);
          if (!DRY_RUN) {
            await prisma.fighter.update({
              where: { id: f.id },
              data: buildUpdate(result),
            });
          }
          updated++;
        } else {
          if (SINGLE_FIGHTER) {
            console.log(`  [SAME     ] ${f.name} — all fields already up to date`);
            console.log(`              age:${f.age} ht:${f.height} reach:${f.reach} ko:${f.koWins} sub:${f.subWins}`);
          }
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
    console.log(`  Not found     : ${skipped}`);
    console.log(`  Name mismatch : ${nameMismatch}`);
    if (DRY_RUN) console.log(`\nRun with --execute to apply changes.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
