/**
 * Scrapes historical UFC moneyline odds from BestFightOdds.com using Playwright.
 * Uses the BFO sitemap to find all UFC event URLs (814 events), then visits each
 * page, waits for JavaScript to render the odds, and stores them in the DB.
 *
 * Usage:
 *   npm run odds:scrape-bfo-dry      (preview first 5 events, no DB write)
 *   npm run odds:scrape-bfo          (full run, writes to DB)
 *   npm run odds:scrape-bfo -- --from=2024   (only process events from 2024+)
 */
import "dotenv/config";
import { chromium, Browser, Page } from "playwright";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const DRY_RUN = !process.argv.includes("--execute");
const FROM_YEAR = (() => {
  const a = process.argv.find(x => x.startsWith("--from="));
  return a ? parseInt(a.split("=")[1]) : 2019;
})();
const DELAY_MS = 1500; // polite delay between pages
const ODDS_TIMEOUT_MS = 8000;
const BFO_BASE = "https://www.bestfightodds.com";

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("sslmode", "require");
  return u.toString();
}

function normName(n: string): string {
  return n.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function nameSimilarity(a: string, b: string): number {
  const wa = normName(a).split(/\s+/);
  const wb = normName(b).split(/\s+/);
  return wa.filter(w => w.length > 1 && wb.includes(w)).length;
}

// ── Fetch BFO sitemap: returns URL + eventId + lastmod date ──────────────────
// BFO switched from fighter-name slugs to venue slugs (ufc-vegas-119, ufc-london, etc.)
// in 2024/2025. Date-based matching via <lastmod> works for ALL eras.

async function fetchUfcEventUrls(): Promise<{ url: string; eventId: number; date: Date | null }[]> {
  console.log("Fetching BFO sitemap...");
  const res = await fetch(`${BFO_BASE}/sitemap-events.xml`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  const xml = await res.text();

  // Parse each <url> block: extract <loc> and <lastmod>
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  return urlBlocks
    .map(block => {
      const locMatch = block[1].match(/<loc>(https:\/\/www\.bestfightodds\.com\/events\/ufc[^<]+)<\/loc>/);
      if (!locMatch) return null;
      const url = locMatch[1];
      const idMatch = url.match(/-(\d+)$/);
      if (!idMatch) return null;
      const lastmodMatch = block[1].match(/<lastmod>([^<]+)<\/lastmod>/);
      const date = lastmodMatch ? new Date(lastmodMatch[1]) : null;
      return { url, eventId: parseInt(idMatch[1]), date };
    })
    .filter(Boolean) as { url: string; eventId: number; date: Date | null }[];
}

// ── Scrape one BFO event page ────────────────────────────────────────────────

interface BfoMatchup {
  fighter1: string;
  fighter2: string;
  odds1: number | null;
  odds2: number | null;
}

async function scrapeBfoEvent(page: Page, url: string): Promise<BfoMatchup[]> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector('.t-b-fcc', { timeout: 15000, state: "attached" });
  await new Promise(r => setTimeout(r, 2000)); // allow JS to render odds

  // BFO has two rendering modes:
  // 1. Recent/upcoming events: per-fight mini-tables with header Platform|F1|F2
  // 2. Past events: synchronized left-column (names) + right-table (odds) approach
  // We try mini-tables first, fall back to synchronized approach.
  const matchups: BfoMatchup[] = await page.evaluate(`
    (() => {
      const PREFER = ['FanDuel', 'DraftKings', 'Caesars', 'BetMGM', 'BetRivers', 'Unibet', 'BetWay'];
      const SKIP_BOOKS = ['Polymarket', 'Kalshi']; // prediction markets use non-standard odds formats

      function parseOdds(txt) {
        // Strip movement arrows and whitespace
        const v = (txt || '').replace(/[^0-9+\\-]/g, '').trim();
        if (!v) return null;
        const m = v.match(/^([+-]?\\d{2,4})$/);
        return m ? parseInt(m[1]) : null;
      }

      const allTables = Array.from(document.querySelectorAll('table'));

      // ── Mode 1: per-fight mini-tables (recent events) ──
      const miniTables = allTables.filter(t => {
        const rows = Array.from(t.querySelectorAll('tr'));
        if (rows.length < 2) return false;
        const ths = rows[0].querySelectorAll('th');
        return ths.length === 3 && (ths[0].textContent || '').trim() === 'Platform';
      });
      if (miniTables.length > 0) {
        const results = [];
        for (const t of miniTables) {
          const rows = Array.from(t.querySelectorAll('tr'));
          const ths = rows[0].querySelectorAll('th');
          const fighter1 = (ths[1].textContent || '').trim();
          const fighter2 = (ths[2].textContent || '').trim();
          if (!fighter1 || !fighter2) continue;
          // Pick preferred bookmaker row
          let bestRow = null;
          for (const pref of PREFER) {
            bestRow = rows.slice(1).find(r => {
              const tds = r.querySelectorAll('td');
              return tds.length >= 1 && (tds[0].textContent || '').trim() === pref;
            }) || null;
            if (bestRow) break;
          }
          if (!bestRow) bestRow = rows[1] || null;
          const tds = bestRow ? Array.from(bestRow.querySelectorAll('td')) : [];
          results.push({ fighter1, fighter2, odds1: tds[1] ? parseOdds(tds[1].textContent) : null, odds2: tds[2] ? parseOdds(tds[2].textContent) : null });
        }
        return results;
      }

      // ── Mode 2: synchronized left/right tables (historical events) ──
      const nameTable = allTables.find(t => t.classList.contains('odds-table-responsive-header'));
      const oddsTable = allTables.find(t => t.className === 'odds-table');
      if (!nameTable || !oddsTable) return [];

      // Build bookmaker column index from THEAD
      const theadThs = Array.from(oddsTable.querySelectorAll('thead tr th'));
      // THEAD: TH[0] may be a spacer; bookmakers start from TH[1]
      // TD indices in body rows start at 0 = TH[1]
      const bookColMap = {};
      theadThs.forEach((th, i) => {
        if (i === 0) return; // skip spacer
        const name = (th.textContent || '').replace(/\\$.*/, '').trim(); // strip "$X bonus"
        bookColMap[name] = i - 1; // subtract 1 for spacer offset
      });

      // Pick preferred bookmaker column
      let preferredCol = -1;
      for (const pref of PREFER) {
        if (bookColMap[pref] !== undefined) { preferredCol = bookColMap[pref]; break; }
      }
      if (preferredCol < 0) {
        // Fallback: find first non-prediction-market column
        for (const [book, col] of Object.entries(bookColMap)) {
          if (!SKIP_BOOKS.some(s => book.startsWith(s))) { preferredCol = col; break; }
        }
      }
      if (preferredCol < 0) return [];

      const nameRows = Array.from(nameTable.querySelectorAll('tbody tr'));
      const oddsRows = Array.from(oddsTable.querySelectorAll('tbody tr'));

      const results = [];
      let i = 0;
      while (i < nameRows.length) {
        const nr = nameRows[i];
        if (!nr.id || !nr.id.startsWith('mu-')) { i++; continue; }

        const f1name = (nr.textContent || '').replace(/^\\d+/, '').trim();

        let j = i + 1;
        while (j < nameRows.length && nameRows[j].classList.contains('pr')) j++;
        const nr2 = nameRows[j];
        if (!nr2 || (nr2.id && nr2.id.startsWith('mu-'))) { i++; continue; }
        const f2name = (nr2.textContent || '').trim();

        const or1 = oddsRows[i];
        const or2 = oddsRows[j];
        const tds1 = or1 ? Array.from(or1.querySelectorAll('td')) : [];
        const tds2 = or2 ? Array.from(or2.querySelectorAll('td')) : [];

        results.push({
          fighter1: f1name,
          fighter2: f2name,
          odds1: tds1[preferredCol] ? parseOdds(tds1[preferredCol].textContent) : null,
          odds2: tds2[preferredCol] ? parseOdds(tds2[preferredCol].textContent) : null,
        });

        i = j + 1;
      }
      return results;
    })()
  `) as BfoMatchup[];

  return matchups;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false }, max: 3 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  console.log(`\n=== BFO Odds Scraper (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) — events from ${FROM_YEAR}+ ===\n`);

  // Load all UFC events from BFO sitemap
  const bfoUrls = await fetchUfcEventUrls();
  console.log(`BFO UFC event URLs: ${bfoUrls.length}`);

  // Load DB events that need odds
  const dbEvents = await prisma.event.findMany({
    where: {
      isUpcoming: false,
      date: { gte: new Date(`${FROM_YEAR}-01-01`) },
      fights: {
        some: { oddsFighter1: null },
      },
    },
    include: {
      fights: {
        where: { oddsFighter1: null },
        include: {
          fighter1: { select: { id: true, name: true } },
          fighter2: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  const totalFightsNeedingOdds = dbEvents.reduce((s, e) => s + e.fights.length, 0);
  console.log(`DB events needing odds: ${dbEvents.length} (${totalFightsNeedingOdds} fights)\n`);

  if (dbEvents.length === 0) {
    console.log("All fights already have odds. Done.");
    await cleanup(prisma, pool);
    return;
  }

  // Launch Playwright
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
    });
    const page = await context.newPage();

    let totalUpdated = 0;
    let eventsProcessed = 0;

    for (const dbEvent of dbEvents) {
      const dbDate = new Date(dbEvent.date);

      // Match BFO event by DATE proximity (primary) — works for venue-slug era (2024+)
      // and name-slug era (pre-2024). Falls back to numbered-event name match.
      const dbMs = dbDate.getTime();
      const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

      // 1. Try date proximity first (requires <lastmod> in sitemap)
      const dateMatches = bfoUrls
        .filter(b => b.date !== null)
        .map(b => ({ ...b, diffMs: Math.abs(b.date!.getTime() - dbMs) }))
        .filter(b => b.diffMs <= FIVE_DAYS)
        .sort((a, b) => a.diffMs - b.diffMs);

      // 2. If multiple BFO events on same day, prefer the one whose slug also contains UFC number
      const numberMatch = dbEvent.name.match(/UFC\s+(\d+)/i);
      let bestBfo = dateMatches.length > 0
        ? (numberMatch
            ? (dateMatches.find(b => b.url.includes(`ufc-${numberMatch[1]}`)) ?? dateMatches[0])
            : dateMatches[0])
        : null;

      // 3. For numbered PPV events with no date match: fall back to slug number match
      if (!bestBfo && numberMatch) {
        bestBfo = bfoUrls.find(b => {
          const slug = b.url.replace(`${BFO_BASE}/events/`, "");
          return slug.startsWith(`ufc-${numberMatch[1]}-`) || slug === `ufc-${numberMatch[1]}` || slug.includes(`ufc-${numberMatch[1]}-odds`);
        }) ?? null;
      }

      if (!bestBfo) {
        console.log(`  [NO BFO MATCH] "${dbEvent.name}" (${dbDate.toISOString().slice(0, 10)})`);
        continue;
      }

      const bfoSlug = bestBfo.url.replace(`${BFO_BASE}/events/`, "");
      const bfoDateStr = bestBfo.date ? bestBfo.date.toISOString().slice(0, 10) : "no-date";
      console.log(`\n  [SCRAPING] "${dbEvent.name}" (${dbDate.toISOString().slice(0,10)}) → ${bfoSlug} (${bfoDateStr})`);

      try {
        const matchups = await scrapeBfoEvent(page, bestBfo.url);
        console.log(`    Found ${matchups.length} matchups on BFO page`);
        if (matchups.length > 0) {
          console.log(`    BFO: "${matchups[0].fighter1}"(${matchups[0].odds1}) vs "${matchups[0].fighter2}"(${matchups[0].odds2})`);
        }

        let eventUpdated = 0;
        for (const mu of matchups) {
          if (!mu.odds1 || !mu.odds2) continue;

          // Find matching DB fight
          const dbFight = dbEvent.fights.find(f => {
            const sim1a = nameSimilarity(f.fighter1.name, mu.fighter1);
            const sim1b = nameSimilarity(f.fighter1.name, mu.fighter2);
            const sim2a = nameSimilarity(f.fighter2.name, mu.fighter1);
            const sim2b = nameSimilarity(f.fighter2.name, mu.fighter2);
            return (sim1a >= 1 && sim2b >= 1) || (sim1b >= 1 && sim2a >= 1);
          });

          if (!dbFight) continue;

          const f1IsFirst = nameSimilarity(dbFight.fighter1.name, mu.fighter1) >= 1;
          const oddsFighter1 = f1IsFirst ? mu.odds1 : mu.odds2;
          const oddsFighter2 = f1IsFirst ? mu.odds2 : mu.odds1;

          console.log(`    ${dbFight.fighter1.name}(${oddsFighter1}) vs ${dbFight.fighter2.name}(${oddsFighter2})`);

          if (!DRY_RUN) {
            await prisma.fight.update({
              where: { id: dbFight.id },
              data: { oddsFighter1, oddsFighter2 },
            });
          }
          eventUpdated++;
          totalUpdated++;
        }

        console.log(`    → ${eventUpdated} fights ${DRY_RUN ? "would be" : "were"} updated`);
        eventsProcessed++;

        if (DRY_RUN && eventsProcessed >= 5) {
          console.log("\n[DRY RUN] Stopping after 5 events. Run with --execute for full run.");
          break;
        }

        await new Promise(r => setTimeout(r, DELAY_MS));
      } catch (err) {
        console.log(`    [ERROR] ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log(`\n========== Summary ==========`);
    console.log(`Events processed: ${eventsProcessed}`);
    console.log(`Odds ${DRY_RUN ? "to update" : "updated"}: ${totalUpdated} fights`);
    if (DRY_RUN) console.log(`\nRun with --execute for full run.`);

  } finally {
    if (browser) await browser.close();
    await cleanup(prisma, pool);
  }
}

async function cleanup(prisma: PrismaClient, pool: Pool) {
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
