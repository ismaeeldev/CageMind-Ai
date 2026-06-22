/**
 * Backfill UFC Fight Night events that are missing from the database.
 *
 * Source: UFC.com paginated events list + individual event pages.
 * (Tapology/UFCStats are behind Cloudflare; UFC.com has no such protection.)
 *
 * Strategy:
 *   1. Paginate https://www.ufc.com/events?page=N to collect Fight Night slugs.
 *   2. For each slug, check if an event with that date already exists in the DB.
 *   3. If missing: fetch the event page, extract the official name, create the event.
 *   4. If the event has 0 fight rows: fetch and parse the fight card + results.
 *   5. Results (winner, method, round, time) ARE present on completed UFC.com pages.
 *
 * Usage:
 *   npm run fights:backfill-fn-dry    # discover only — no DB writes
 *   npm run fights:backfill-fn        # create events + scrape fights
 *
 * After --execute run:
 *   npm run elo:recalculate
 */

import "dotenv/config";
import * as cheerio from "cheerio";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");
/** UFC.com pages to scan. Each page covers roughly 4-6 events (≈2-3 months). */
const MAX_PAGES = 100;
const DELAY_MS = 2000;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─── DB ───────────────────────────────────────────────────────────────────────

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

// ─── HTTP ─────────────────────────────────────────────────────────────────────

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ─── UFC.com events list — collect Fight Night slugs ─────────────────────────

async function collectFightNightSlugs(): Promise<string[]> {
  const allSlugs = new Set<string>();

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const html = await fetchHtml(`https://www.ufc.com/events?page=${page}`);
      const $ = cheerio.load(html);
      let foundOnPage = 0;

      $('a[href*="/event/ufc-fight-night"]').each((_, el) => {
        const href = $(el).attr("href") || "";
        const m = href.match(/\/event\/(ufc-fight-night[-\w]+)/);
        if (!m) return;
        const slug = m[1].split("#")[0]; // strip anchors like #1304
        if (/ufc-fight-night-[a-z]+-\d{2}-\d{4}/.test(slug)) {
          // date-based slugs: ufc-fight-night-august-24-2024
          if (!allSlugs.has(slug)) { allSlugs.add(slug); foundOnPage++; }
        }
      });

      if (foundOnPage === 0) {
        console.log(`  Page ${page}: 0 new slugs — assuming end of list.`);
        break;
      }
      console.log(`  Page ${page}: +${foundOnPage} slugs (total ${allSlugs.size})`);
    } catch (err: any) {
      console.warn(`  Page ${page}: fetch failed — ${err.message}. Stopping pagination.`);
      break;
    }
    await sleep(DELAY_MS);
  }

  return Array.from(allSlugs);
}

// ─── Parse a date-based slug to a Date ───────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function slugToDate(slug: string): Date | null {
  // Format: ufc-fight-night-<month>-<day>-<year>
  const m = slug.match(/ufc-fight-night-([a-z]+)-(\d{1,2})-(\d{4})/);
  if (!m) return null;
  const month = MONTH_MAP[m[1]];
  if (month === undefined) return null;
  return new Date(Date.UTC(parseInt(m[3]), month, parseInt(m[2])));
}

// ─── Parse a UFC.com event page for name + fight card ────────────────────────

interface ParsedEventPage {
  name: string;
  date: Date | null;
  location: string | null;
  fights: ParsedFightRow[];
}

interface ParsedFightRow {
  f1Name: string;
  f2Name: string;
  f1UfcPath: string | null;
  f2UfcPath: string | null;
  weightClass: string;
  isTitleFight: boolean;
  winnerName: string | null;
  method: string | null;
  endingRound: number | null;
  endingTime: string | null;
}

function parseEventPage(html: string): ParsedEventPage {
  const $ = cheerio.load(html);

  // ── Event name ─────────────────────────────────────────────────────────────
  const prefix = $(".c-hero--full__headline-prefix").first().text().trim(); // "UFC Fight Night"
  const headline = $(".c-hero--full__headline").first().text().trim();     // "Cannonier vs Borralho"
  const name = prefix && headline ? `${prefix}: ${headline}` : (prefix || headline || "Unknown");

  // ── Event date (from a <time> or data attribute in the hero suffix) ─────────
  let date: Date | null = null;
  const timeEl = $(".c-hero__headline-suffix .tz-change-data").attr("data-main-card-timestamp")
    || $(".tz-change-data").attr("data-main-card-timestamp");
  if (timeEl) date = new Date(parseInt(timeEl, 10) * 1000);

  // ── Location ───────────────────────────────────────────────────────────────
  const location = $(".c-hero__location, .field--name-node-location, .venue").first().text().trim() || null;

  // ── Fights ─────────────────────────────────────────────────────────────────
  const DIVISION_RE = /strawweight|flyweight|bantamweight|featherweight|lightweight|welterweight|middleweight|light heavyweight|heavyweight/i;
  const TITLE_KEYWORDS = ["title", "championship", "interim", "undisputed"];
  const fights: ParsedFightRow[] = [];

  $(".c-listing-fight").each((_, el) => {
    const $el = $(el);

    // Fighter names
    const f1El = $el.find(".c-listing-fight__corner-name--red").first();
    const f2El = $el.find(".c-listing-fight__corner-name--blue").first();
    const f1Name = f1El.text().trim().replace(/\s+/g, " ");
    const f2Name = f2El.text().trim().replace(/\s+/g, " ");

    if (!f1Name || !f2Name || f1Name === f2Name) return;
    if (fights.some(f => (f.f1Name === f1Name && f.f2Name === f2Name) || (f.f1Name === f2Name && f.f2Name === f1Name))) return;

    const f1UfcPath = f1El.find("a").attr("href") || null;
    const f2UfcPath = f2El.find("a").attr("href") || null;

    // Weight class + title detection
    const rawWC = $el.find(".c-listing-fight__class-text").first().text().trim();
    const isTitleFight = $el.find('.c-listing-fight__title-bout, img[src*="belt"]').length > 0
      || TITLE_KEYWORDS.some(kw => rawWC.toLowerCase().includes(kw));
    const divMatch = rawWC.match(DIVISION_RE);
    const weightClass = divMatch
      ? divMatch[0].charAt(0).toUpperCase() + divMatch[0].slice(1).toLowerCase()
      : (rawWC || "Catchweight");

    // Winner (corner marked with outcome--win)
    const f1Won = $el.find(".c-listing-fight__corner--red .c-listing-fight__outcome--win").length > 0;
    const f2Won = $el.find(".c-listing-fight__corner--blue .c-listing-fight__outcome--win").length > 0;
    let winnerName: string | null = null;
    if (f1Won && !f2Won) winnerName = f1Name;
    if (f2Won && !f1Won) winnerName = f2Name;

    // Method / round / time
    let method: string | null = null;
    let endingRound: number | null = null;
    let endingTime: string | null = null;
    $el.find(".c-listing-fight__result").each((_, resEl) => {
      const label = $(resEl).find(".c-listing-fight__result-label").text().trim().toLowerCase();
      const val = $(resEl).find(".c-listing-fight__result-text").text().trim();
      if (label === "method") method = val || null;
      if (label === "round") endingRound = parseInt(val, 10) || null;
      if (label === "time") endingTime = val || null;
    });

    fights.push({ f1Name, f2Name, f1UfcPath, f2UfcPath, weightClass, isTitleFight, winnerName, method, endingRound, endingTime });
  });

  return { name, date, location, fights };
}

// ─── Save fights to DB ────────────────────────────────────────────────────────

async function saveFights(prisma: PrismaClient, eventId: string, fights: ParsedFightRow[]): Promise<number> {
  const savedIds: string[] = [];

  for (const fight of fights) {
    // Upsert fighter1
    let f1 = await prisma.fighter.findFirst({ where: { name: { equals: fight.f1Name, mode: "insensitive" } } });
    if (!f1) {
      f1 = await prisma.fighter.create({ data: { name: fight.f1Name, weightClass: fight.weightClass, eloRating: 1200, isActive: true } });
    }

    // Upsert fighter2
    let f2 = await prisma.fighter.findFirst({ where: { name: { equals: fight.f2Name, mode: "insensitive" } } });
    if (!f2) {
      f2 = await prisma.fighter.create({ data: { name: fight.f2Name, weightClass: fight.weightClass, eloRating: 1200, isActive: true } });
    }

    // Resolve winner ID
    let winnerId: string | null = null;
    if (fight.winnerName) {
      if (fight.winnerName.toLowerCase() === fight.f1Name.toLowerCase()) winnerId = f1.id;
      else if (fight.winnerName.toLowerCase() === fight.f2Name.toLowerCase()) winnerId = f2.id;
    }

    const existing = await prisma.fight.findFirst({
      where: { eventId, OR: [{ fighter1Id: f1.id, fighter2Id: f2.id }, { fighter1Id: f2.id, fighter2Id: f1.id }] },
    });

    if (existing) {
      const updated = await prisma.fight.update({
        where: { id: existing.id },
        data: {
          fighter1Id: f1.id, fighter2Id: f2.id,
          weightClass: fight.weightClass, isTitleFight: fight.isTitleFight,
          winnerId, method: fight.method, endingRound: fight.endingRound, endingTime: fight.endingTime,
        },
      });
      savedIds.push(updated.id);
    } else {
      const created = await prisma.fight.create({
        data: {
          eventId, fighter1Id: f1.id, fighter2Id: f2.id,
          weightClass: fight.weightClass, isTitleFight: fight.isTitleFight,
          winnerId, method: fight.method, endingRound: fight.endingRound, endingTime: fight.endingTime,
        },
      });
      savedIds.push(created.id);
    }
  }

  return savedIds.length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== Backfill UFC Fight Night Events (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  // ── Step 1: Collect slugs from UFC.com ────────────────────────────────────
  console.log(`Scanning UFC.com events (up to ${MAX_PAGES} pages)...\n`);
  const slugs = await collectFightNightSlugs();
  console.log(`\nCollected ${slugs.length} unique Fight Night slugs.\n`);

  if (slugs.length === 0) {
    console.log("No slugs found — check network access to ufc.com.");
    return;
  }

  // ── Step 2: Compare against DB ────────────────────────────────────────────
  const { prisma, cleanup } = freshClient();

  try {
    const existingEvents = await prisma.event.findMany({
      where: { name: { contains: "Fight Night", mode: "insensitive" } },
      select: {
        id: true, name: true, date: true,
        _count: { select: { fights: true } },
        fights: { select: { winnerId: true }, take: 20 },
      },
    });

    // Build a quick lookup: date-string → event
    const existingByDate = new Map(
      existingEvents.map(e => [e.date.toISOString().slice(0, 10), e])
    );
    // Events that need fight cards OR have fights but no results
    const existingNeedingScrape = existingEvents.filter(e =>
      e._count.fights === 0 || e.fights.every(f => f.winnerId === null)
    );

    // Classify each slug
    const toProcess: { slug: string; date: Date; existingId: string | null }[] = [];

    for (const slug of slugs) {
      const date = slugToDate(slug);
      if (!date) continue;

      // Look for existing event within 1 day of the slug date
      const d0 = date.toISOString().slice(0, 10);
      const d1 = new Date(date.getTime() + 86_400_000).toISOString().slice(0, 10);
      const d2 = new Date(date.getTime() - 86_400_000).toISOString().slice(0, 10);

      const existingEv = existingByDate.get(d0) || existingByDate.get(d1) || existingByDate.get(d2) || null;
      const existingId = existingEv?.id ?? null;

      // Skip if existing AND has fights with real results
      if (existingEv && existingEv._count.fights > 0 && existingEv.fights.some(f => f.winnerId !== null)) {
        continue; // already fully populated
      }

      // Skip future events (nothing to backfill)
      if (date > new Date()) continue;

      toProcess.push({ slug, date, existingId });
    }

    // Also process existing Fight Night events that need scraping but weren't matched by slug
    const processedIds = new Set(toProcess.map(t => t.existingId).filter(Boolean));
    for (const ev of existingNeedingScrape) {
      if (!processedIds.has(ev.id) && ev.date < new Date()) {
        // Try to build a slug from this event's date
        const dateStr = ev.date.toISOString().slice(0, 10); // "2024-08-24"
        const [year, mo, day] = dateStr.split("-");
        const monthName = Object.keys(MONTH_MAP)[parseInt(mo) - 1];
        const guessSlug = `ufc-fight-night-${monthName}-${parseInt(day)}-${year}`;
        toProcess.push({ slug: guessSlug, date: ev.date, existingId: ev.id });
      }
    }

    const withResults = existingEvents.filter(e => e.fights.some(f => f.winnerId !== null));
    console.log(`DB Fight Night events     : ${existingEvents.length}`);
    console.log(`  with real results       : ${withResults.length}`);
    console.log(`  needing scrape          : ${existingNeedingScrape.length}`);
    console.log(`Slugs to scrape           : ${toProcess.length}`);

    if (DRY_RUN) {
      console.log("\nSlugs that WOULD be scraped:");
      for (const { slug, existingId } of toProcess) {
        const tag = existingId ? "[EXISTING/NO FIGHTS]" : "[NEW]";
        console.log(`  ${tag} ${slug}`);
      }
      console.log("\nDry-run complete. Run with --execute (npm run fights:backfill-fn) to apply.");
      return;
    }

    // ── Step 3: Scrape each slug ───────────────────────────────────────────
    const now = new Date();
    let created = 0;
    let scraped = 0;
    let failed = 0;

    for (const { slug, date, existingId } of toProcess) {
      const url = `https://www.ufc.com/event/${slug}`;
      process.stdout.write(`  ${slug} ... `);

      try {
        const html = await fetchHtml(url);
        const { name, date: parsedDate, location, fights } = parseEventPage(html);

        const eventDate = parsedDate || date;
        const isUpcoming = eventDate > now;
        const cleanName = name || `UFC Fight Night (${slug})`;

        let eventId = existingId;
        if (!eventId) {
          const newEvent = await prisma.event.create({
            data: { name: cleanName, date: eventDate, location, isUpcoming },
          });
          eventId = newEvent.id;
          created++;
        } else {
          // Update name/date if we now have proper data
          await prisma.event.update({
            where: { id: eventId },
            data: { name: cleanName, date: eventDate, location: location ?? undefined },
          });
        }

        if (fights.length === 0) {
          console.log(`0 fights parsed — event may be upcoming/TBD`);
          failed++;
        } else {
          const count = await saveFights(prisma, eventId, fights);
          const hasResults = fights.some(f => f.winnerName);
          // Leave isProcessed: false — PostEventProcessor will generate AI predictions.
          scraped++;
          console.log(`${count} fights saved${hasResults ? " (with results)" : " (no results yet)"}`);
        }
      } catch (err: any) {
        console.log(`ERROR: ${err.message}`);
        failed++;
      }

      await sleep(DELAY_MS);
    }

    console.log(`\n── Results ────────────────────────────────────────────────`);
    console.log(`  New events created : ${created}`);
    console.log(`  Fight cards saved  : ${scraped}`);
    console.log(`  Failed / skipped   : ${failed}`);
    console.log(`\nNext step: npm run elo:recalculate`);
  } finally {
    await cleanup();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
