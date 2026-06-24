/**
 * Scrapes ONLY the profile image (hero-profile__image) from each fighter's UFC.com page.
 * No other fields are touched.
 *
 * Usage:
 *   Test one fighter (dry):   tsx src/scripts/update-fighter-images.ts --fighter "Jon Jones"
 *   Test one fighter (write): tsx src/scripts/update-fighter-images.ts --fighter "Jon Jones" --execute
 *   All fighters (dry):       tsx src/scripts/update-fighter-images.ts
 *   All fighters (write):     tsx src/scripts/update-fighter-images.ts --execute
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

const DRY_RUN  = !process.argv.includes("--execute");
const DELAY_MS = 700;

// Optional: --fighter "Jon Jones" to run on one fighter only
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

async function scrapeImage(ufcId: string | null, name: string): Promise<{
  imageUrl: string | null;
  pageNameMatches: boolean;
} | null> {
  const url = ufcId
    ? (ufcId.startsWith("http") ? ufcId : `https://www.ufc.com${ufcId}`)
    : `https://www.ufc.com/athlete/${nameToSlug(name)}`;

  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;

    const $ = cheerio.load(await res.text());

    // Verify it's the right fighter — name on page must roughly match DB name
    const pageName = $(".hero-profile__name").text().trim();
    const pageNameNorm = normalizeName(pageName);
    const dbNameNorm   = normalizeName(name);
    const pageNameMatches =
      pageNameNorm.includes(dbNameNorm) ||
      dbNameNorm.includes(pageNameNorm) ||
      pageNameNorm.split(" ").some(w => dbNameNorm.includes(w));

    if (!pageNameMatches) {
      console.warn(`  ⚠  Name mismatch: DB="${name}" Page="${pageName}" — skipping`);
      return { imageUrl: null, pageNameMatches: false };
    }

    // The full-body portrait used on the athlete profile hero
    const imageUrl = $(".hero-profile__image").attr("src") || null;

    return { imageUrl, pageNameMatches: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (SINGLE_FIGHTER) console.error(`  fetch error for ${name}: ${msg}`);
    return null;
  }
}

async function main() {
  console.log(`\n=== Update Fighter Images (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===`);
  console.log(`Only "imageUrl" is updated — nothing else touched.\n`);
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
      select: { id: true, name: true, ufcId: true, imageUrl: true },
      orderBy: { name: "asc" },
    });

    console.log(`Fighters to process: ${fighters.length}\n`);

    let updated = 0, skipped = 0, noImage = 0, nameMismatch = 0;

    for (let i = 0; i < fighters.length; i++) {
      const f = fighters[i];
      const result = await scrapeImage(f.ufcId, f.name);

      if (!result) {
        console.log(`  [NOT FOUND] ${f.name}`);
        skipped++;
      } else if (!result.pageNameMatches) {
        nameMismatch++;
      } else if (!result.imageUrl) {
        console.log(`  [NO IMAGE ] ${f.name}`);
        noImage++;
      } else {
        const changed = result.imageUrl !== f.imageUrl;
        if (changed) {
          console.log(`  [UPDATED  ] ${f.name}`);
          console.log(`              ${result.imageUrl}`);
          if (!DRY_RUN) {
            await prisma.fighter.update({
              where: { id: f.id },
              data: { imageUrl: result.imageUrl },
            });
          }
          updated++;
        } else {
          // Already correct — only log in single-fighter mode
          if (SINGLE_FIGHTER) console.log(`  [SAME     ] ${f.name} — image already up to date`);
        }
      }

      if ((i + 1) % 100 === 0 && !SINGLE_FIGHTER) {
        console.log(`  ── ${i + 1}/${fighters.length} processed — updated:${updated} skipped:${skipped}`);
      }

      await sleep(DELAY_MS);
    }

    console.log(`\n── Results ──────────────────────────────`);
    console.log(`  Total     : ${fighters.length}`);
    console.log(`  Updated   : ${updated}`);
    console.log(`  No image  : ${noImage}`);
    console.log(`  Not found : ${skipped}`);
    console.log(`  Name mismatch (skipped): ${nameMismatch}`);
    if (DRY_RUN) console.log(`\nRun with --execute to apply changes.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
