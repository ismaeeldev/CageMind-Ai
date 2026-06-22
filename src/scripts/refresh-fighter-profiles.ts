/**
 * Re-scrapes individual UFC.com athlete pages for fighters missing a photo,
 * physical stats (age/height/reach), or correct win/loss record.
 *
 * Fixes the aftermath of a bad dedup run that kept records without photos.
 *
 * URL strategy: use ufcId if available (e.g. /athlete/jon-jones),
 * otherwise construct from name (e.g. "Jon Jones" → /athlete/jon-jones).
 *
 * Usage:
 *   npm run fighters:refresh-dry    — count only
 *   npm run fighters:refresh        — apply updates
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

const DRY_RUN = !process.argv.includes("--execute");
const DELAY_MS = 800;
const BATCH = 20; // fighters per log line

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

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function nameToSlug(name: string): string {
  // NFD decomposes é→e+combining-acute; then strip the combining chars
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['''""\.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ufcIdToUrl(ufcId: string | null, name: string): string {
  if (ufcId) {
    const path = ufcId.startsWith("http") ? ufcId : `https://www.ufc.com${ufcId}`;
    return path;
  }
  return `https://www.ufc.com/athlete/${nameToSlug(name)}`;
}

interface ScrapedProfile {
  pageName: string | null;
  imageUrl: string | null;
  age: number | null;
  height: number | null;
  reach: number | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  koWins: number | null;
  subWins: number | null;
  ufcId: string | null;
}

/** Normalised name for comparison: lowercase ASCII, letters+spaces only */
function normName(s: string): string {
  return s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
}

/** Returns true if the page is for a different fighter (wrong ufcId assigned) */
function nameMismatch(dbName: string, pageName: string): boolean {
  const db = normName(dbName).split(" ");
  const pg = normName(pageName).split(" ");
  const dbSet = new Set(db);
  const pgSet = new Set(pg);
  // Accept if first OR last name matches
  const dbFirst = db[0], dbLast = db[db.length - 1];
  const pgFirst = pg[0], pgLast = pg[pg.length - 1];
  if (dbFirst === pgFirst || dbLast === pgLast) return false;
  // Also accept if any two words are shared (handles middle names etc.)
  const shared = db.filter(w => w.length > 2 && pgSet.has(w)).length;
  if (shared >= 1) return false;
  return true;
}

async function scrapeFighterPage(url: string): Promise<ScrapedProfile | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Verify it's actually a fighter page (not 404 or redirect)
    if ($(".hero-profile__name, .hero-profile__division").length === 0) return null;

    // Extract the fighter's name from the page for mismatch detection
    const firstName = $(".hero-profile__name-first").text().trim();
    const lastName = $(".hero-profile__name-last").text().trim();
    const pageName = [firstName, lastName].filter(Boolean).join(" ")
      || $(".hero-profile__name").text().trim().replace(/\s+/g, " ")
      || null;

    // Image — class is ON the <img> itself, not a parent div
    let imageUrl: string | null = null;
    const imgSrc = $("img.hero-profile__image").attr("src")
      || $(".hero-profile__image-wrap img").attr("src")
      || $(".c-bio__image img").attr("src")
      || $('meta[property="og:image"]').attr("content");
    if (imgSrc && !imgSrc.includes("no-profile-image") && !imgSrc.includes("placeholder")) {
      imageUrl = imgSrc.startsWith("/") ? `https://www.ufc.com${imgSrc}` : imgSrc;
    }

    // Bio stats
    let age: number | null = null;
    let height: number | null = null;
    let reach: number | null = null;

    $(".c-bio__label").each((_, el) => {
      const label = $(el).text().trim().toLowerCase();
      const value = $(el).next().text().trim();
      if (!value) return;
      const num = parseFloat(value);
      if (label === "age" && !isNaN(num)) age = Math.round(num);
      if (label === "height" && !isNaN(num)) height = num;
      if (label === "reach" && !isNaN(num)) reach = num;
    });

    // Win/loss/draw record
    let wins: number | null = null;
    let losses: number | null = null;
    let draws: number | null = null;
    const recordText = $(".hero-profile__division-body, .c-bio__text--record").text().trim();
    const recMatch = recordText.match(/(\d+)\s*-\s*(\d+)\s*-\s*(\d+)/);
    if (recMatch) {
      wins = parseInt(recMatch[1]);
      losses = parseInt(recMatch[2]);
      draws = parseInt(recMatch[3]);
    }

    // KO / Sub wins
    let koWins: number | null = null;
    let subWins: number | null = null;
    $(".hero-profile__stat").each((_, el) => {
      const label = $(el).find(".hero-profile__stat-text").text().trim().toLowerCase();
      const val = parseInt($(el).find(".hero-profile__stat-numb").text().trim());
      if (!isNaN(val)) {
        if (label.includes("knockout")) koWins = val;
        if (label.includes("submission")) subWins = val;
      }
    });

    // Extract ufcId from the canonical URL
    const canonical = $('link[rel="canonical"]').attr("href");
    const ufcIdMatch = canonical?.match(/\/athlete\/([^/?#]+)/);
    const ufcId = ufcIdMatch ? `/athlete/${ufcIdMatch[1]}` : null;

    return { pageName, imageUrl, age, height, reach, wins, losses, draws, koWins, subWins, ufcId };
  } catch {
    return null;
  }
}

async function main() {
  console.log(`\n=== Refresh Fighter Profiles (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Target fighters missing photo (including garbage strings), bio stats, or zero record
    const fighters = await prisma.fighter.findMany({
      where: {
        OR: [
          { imageUrl: null },
          { imageUrl: "" },
          { imageUrl: "null" },
          { imageUrl: "undefined" },
          { imageUrl: "N/A" },
          { age: null },
          { height: null },
          { reach: null },
          { wins: 0, losses: 0, draws: 0 },
        ],
      },
      select: { id: true, name: true, ufcId: true, imageUrl: true, wins: true, losses: true, draws: true, age: true, height: true, reach: true },
      orderBy: { name: "asc" },
    });

    console.log(`Fighters needing profile refresh: ${fighters.length}`);

    if (DRY_RUN) {
      console.log(`\nSample (first 20):`);
      fighters.slice(0, 20).forEach(f =>
        console.log(`  ${f.name} | img=${f.imageUrl ? "✓" : "✗"} | record=${f.wins}-${f.losses}-${f.draws} | ufcId=${f.ufcId ?? "none"}`)
      );
      console.log(`\nDry run — run with --execute to scrape and update.`);
      return;
    }

    let updated = 0;
    let notFound = 0;
    let total = fighters.length;

    for (let i = 0; i < fighters.length; i++) {
      const fighter = fighters[i];
      const url = ufcIdToUrl(fighter.ufcId, fighter.name);

      const profile = await scrapeFighterPage(url);

      if (!profile) {
        notFound++;
        if (notFound <= 5) console.log(`  [NOT FOUND] ${fighter.name} — ${url}`);
        await sleep(DELAY_MS);
        continue;
      }

      // Guard: if the page belongs to a different fighter, clear the bad ufcId and skip
      if (profile.pageName && nameMismatch(fighter.name, profile.pageName)) {
        console.log(`  [WRONG PAGE] "${fighter.name}" → page says "${profile.pageName}" — clearing bad ufcId`);
        if (!DRY_RUN) {
          await prisma.fighter.update({ where: { id: fighter.id }, data: { ufcId: null } });
        }
        notFound++;
        await sleep(DELAY_MS);
        continue;
      }

      // Build update payload — only overwrite fields we got
      const data: any = {};
      if (profile.imageUrl) data.imageUrl = profile.imageUrl;
      if (profile.age !== null) data.age = profile.age;
      if (profile.height !== null) data.height = profile.height;
      if (profile.reach !== null) data.reach = profile.reach;
      if (profile.wins !== null) data.wins = profile.wins;
      if (profile.losses !== null) data.losses = profile.losses;
      if (profile.draws !== null) data.draws = profile.draws;
      if (profile.koWins !== null) data.koWins = profile.koWins;
      if (profile.subWins !== null) data.subWins = profile.subWins;
      if (profile.ufcId && !fighter.ufcId) data.ufcId = profile.ufcId;

      if (Object.keys(data).length > 0) {
        await prisma.fighter.update({ where: { id: fighter.id }, data });
        updated++;
      }

      if ((i + 1) % BATCH === 0) {
        console.log(`  ${i + 1}/${total} processed — ${updated} updated, ${notFound} not found`);
      }

      await sleep(DELAY_MS);
    }

    console.log(`\n── Results ─────────────────────────────────────`);
    console.log(`  Total targeted : ${total}`);
    console.log(`  Updated        : ${updated}`);
    console.log(`  Not found      : ${notFound}`);
    console.log(`\nNext: npm run fighters:dedup && npm run elo:recalculate`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
