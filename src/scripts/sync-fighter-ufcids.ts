/**
 * Pages through UFC.com /athletes/all to find the correct ufcId (slug) for
 * every fighter in our DB who currently has ufcId = null.
 *
 * Strategy:
 *   1. Pull every fighter from UFC.com athlete listing (name + /athlete/slug)
 *   2. Normalise both sides to plain ASCII lowercase for matching
 *   3. For each DB fighter without ufcId, look for an exact or close match
 *   4. Update matched fighters with their correct ufcId
 *
 * Usage:
 *   npm run fighters:sync-ids-dry   → report matches, no writes
 *   npm run fighters:sync-ids       → apply updates
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

const DRY_RUN = !process.argv.includes("--execute");
const DELAY_MS = 600;
const MAX_PAGES = 200;

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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Strip accents, punctuation, extra spaces → plain lowercase key for matching */
function normalise(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface UFCFighter {
  name: string;
  normName: string;
  ufcId: string; // e.g. "/athlete/jon-jones"
}

async function fetchAllUFCFighters(): Promise<UFCFighter[]> {
  const fighters: UFCFighter[] = [];
  const seen = new Set<string>();

  console.log("Fetching all fighters from UFC.com /athletes/all...");

  for (let page = 0; page <= MAX_PAGES; page++) {
    const url = `https://www.ufc.com/athletes/all?page=${page}`;
    try {
      const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
      if (!res.ok) { console.log(`  page ${page}: HTTP ${res.status} — stopping`); break; }

      const html = await res.text();
      const $ = cheerio.load(html);
      const cards = $(".c-listing-athlete-flipcard");

      if (cards.length === 0) {
        console.log(`  page ${page}: 0 cards — end of list`);
        break;
      }

      let added = 0;
      cards.each((_, el) => {
        const name = $(el).find(".c-listing-athlete__name").text().trim().replace(/\s+/g, " ");
        // Action button on back of card has the slug link
        const href = $(el).find(".c-listing-athlete-flipcard__action a").attr("href") || "";
        if (!name || !href) return;
        const ufcId = href.startsWith("/") ? href : `/${href}`;
        if (seen.has(ufcId)) return;
        seen.add(ufcId);
        fighters.push({ name, normName: normalise(name), ufcId });
        added++;
      });

      console.log(`  page ${page}: ${cards.length} cards, +${added} new (total ${fighters.length})`);
    } catch (err: any) {
      console.warn(`  page ${page}: ${err.message} — stopping`);
      break;
    }

    await sleep(DELAY_MS);
  }

  return fighters;
}

async function main() {
  console.log(`\n=== Sync Fighter ufcIds (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  // ── 1. Fetch all UFC.com fighters ──────────────────────────────────────────
  const ufcFighters = await fetchAllUFCFighters();
  console.log(`\nFetched ${ufcFighters.length} fighters from UFC.com\n`);

  // Build lookup maps: exact normName → ufcId, and slug-parts for fuzzy matching
  const byNormName = new Map<string, UFCFighter>();
  const byLastName = new Map<string, UFCFighter[]>();

  for (const f of ufcFighters) {
    byNormName.set(f.normName, f);
    const parts = f.normName.split(" ");
    const last = parts[parts.length - 1];
    if (!byLastName.has(last)) byLastName.set(last, []);
    byLastName.get(last)!.push(f);
  }

  // ── 2. Load DB fighters missing ufcId ─────────────────────────────────────
  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const dbFighters = await prisma.fighter.findMany({
      where: { ufcId: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    console.log(`DB fighters without ufcId: ${dbFighters.length}\n`);

    let matched = 0;
    let fuzzy = 0;
    let noMatch = 0;
    let skippedDuplicate = 0;
    const noMatchList: string[] = [];

    for (const dbF of dbFighters) {
      const norm = normalise(dbF.name);
      let ufc = byNormName.get(norm) ?? null;

      // Fuzzy: try last-name bucket and find best candidate
      if (!ufc) {
        const parts = norm.split(" ");
        const last = parts[parts.length - 1];
        const candidates = byLastName.get(last) ?? [];
        // Pick candidate whose normName has the most words in common
        let best: UFCFighter | null = null;
        let bestScore = 0;
        for (const c of candidates) {
          const aWords = new Set(norm.split(" "));
          const bWords = c.normName.split(" ");
          const score = bWords.filter(w => aWords.has(w)).length;
          if (score > bestScore) { bestScore = score; best = c; }
        }
        // Only accept if at least 2 words matched (avoids false positives on common last names)
        if (best && bestScore >= 2) { ufc = best; fuzzy++; }
      } else {
        matched++;
      }

      if (!ufc) {
        noMatch++;
        if (noMatchList.length < 30) noMatchList.push(dbF.name);
        continue;
      }

      if (!DRY_RUN) {
        // Check if another fighter record already owns this ufcId (duplicate) — skip it,
        // dedup will merge the two records later
        const conflict = await prisma.fighter.findUnique({
          where: { ufcId: ufc.ufcId },
          select: { id: true },
        });
        if (conflict) {
          skippedDuplicate++;
          continue;
        }
        await prisma.fighter.update({
          where: { id: dbF.id },
          data: { ufcId: ufc.ufcId },
        });
      } else {
        console.log(`  MATCH: "${dbF.name}" → ${ufc.ufcId}`);
      }
    }

    console.log(`\n── Results ──────────────────────────────────────`);
    console.log(`  Exact matches      : ${matched}`);
    console.log(`  Fuzzy matches      : ${fuzzy}`);
    console.log(`  Skipped (duplicate): ${skippedDuplicate}  ← dedup will merge these`);
    console.log(`  No match found     : ${noMatch}`);
    if (noMatchList.length > 0) {
      console.log(`\n  Sample unmatched (need manual ufcId or name fix):`);
      noMatchList.forEach(n => console.log(`    "${n}"`));
    }

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to apply.`);
    } else {
      console.log(`\nUpdated ${matched + fuzzy} fighters with ufcId.`);
      console.log(`Skipped ${skippedDuplicate} duplicates — run fighters:dedup next to merge them.`);
      console.log(`Next: npm run fighters:refresh`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
