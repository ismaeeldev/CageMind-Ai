/**
 * Fixes two data quality issues for past events in one pass:
 *   1. Events named "Unknown"  → renames from UFC.com page or fight card
 *   2. Events with null venue  → fills from UFC.com page
 *
 * Safety guarantees:
 *   - Only touches past events (isUpcoming = false)
 *   - Only touches events with name = "Unknown" OR location = null
 *   - Cross-validates UFC.com page against fighters already in DB — skips if mismatch
 *   - Never overwrites a good name/location with worse data
 *   - Dry run by default; changes only applied with --execute
 *
 * Usage:
 *   npx tsx src/scripts/fix-event-names-and-venues.ts              # dry run
 *   npx tsx src/scripts/fix-event-names-and-venues.ts --execute    # apply
 *   npx tsx src/scripts/fix-event-names-and-venues.ts --limit 50   # cap at 50 events
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

// ── CLI flags ──────────────────────────────────────────────────────────────────
const DRY_RUN = !process.argv.includes("--execute");
const limitIdx = process.argv.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(process.argv[limitIdx + 1], 10) || 500 : 500;
const DELAY_MS = 1500; // between UFC.com requests

// ── DB connection ──────────────────────────────────────────────────────────────
function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch {
    return raw;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
];

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

/** Build UFC.com slug candidates for a given date + existing name. */
function slugCandidates(date: Date, existingName: string): string[] {
  const month = MONTH_NAMES[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const slugs: string[] = [];

  // Date-based (most reliable for Fight Nights)
  slugs.push(`ufc-fight-night-${month}-${day}-${year}`);

  // Numbered PPV — only if existing name carries a number
  const numMatch = existingName.match(/ufc\s+(\d+)/i);
  if (numMatch) slugs.push(`ufc-${numMatch[1]}`);

  return slugs;
}

interface PageResult {
  name: string | null;
  location: string | null;
  /** Fighter last-names found on the page for cross-validation */
  pageLastNames: Set<string>;
}

/** Fetch and parse a UFC.com event page. Returns null if page not found or invalid. */
async function fetchAndParse(slug: string): Promise<PageResult | null> {
  const url = `https://www.ufc.com/event/${slug}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    // A real event page is always large; 404/redirect pages are ~50 KB generic shells
    if (html.length < 60_000) return null;

    const $ = cheerio.load(html);

    // ── Name ──────────────────────────────────────────────────────────────────
    const prefix = $(".c-hero--full__headline-prefix").first().text().trim();
    const headline = $(".c-hero--full__headline").first().text().trim();
    let name: string | null = null;
    if (prefix && headline) {
      name = `${prefix}: ${headline}`;
    } else if (prefix && prefix.toLowerCase().includes("ufc")) {
      name = prefix;
    } else if (headline && headline.toLowerCase().includes("ufc")) {
      name = headline;
    }
    // Sanity: must look like a UFC event
    if (name && !name.toLowerCase().includes("ufc")) name = null;

    // ── Location ──────────────────────────────────────────────────────────────
    let location: string | null = null;

    // Try selectors in priority order
    const locationSelectors = [
      ".c-hero__location",
      ".field--name-node-location",
      ".venue",
      ".c-event-fight-card-broadcaster__location",
      "[data-location]",
    ];
    for (const sel of locationSelectors) {
      const text = $(sel).first().text().trim().replace(/\s+/g, " ");
      if (text && text.length > 3) { location = text; break; }
    }

    // Fallback: headline suffix pattern like "UFC Returns to Las Vegas"
    if (!location) {
      const suffix = $(".c-hero__headline-suffix").first().text().trim().replace(/\s+/g, " ");
      if (suffix) {
        const m = suffix.match(/(?:returns?|heads?|comes?|travels?)\s+to\s+(.+?)(?:\s+on\s+|\s*$)/i)
          || suffix.match(/\bin\s+([A-Z][^,\n]{3,})/);
        if (m) location = m[1].trim();
      }
    }

    // Fallback: first address element
    if (!location) {
      const addr = $("address").first().text().trim().replace(/\s+/g, " ");
      if (addr && addr.length > 4) location = addr;
    }

    // Clean location: remove newlines / extra whitespace
    if (location) location = location.replace(/\s+/g, " ").trim();
    if (location && location.length < 4) location = null;

    // ── Fighter last-names (for cross-validation) ──────────────────────────────
    const pageLastNames = new Set<string>();
    $(".c-listing-fight__corner-name--red, .c-listing-fight__corner-name--blue").each((_, el) => {
      const parts = $(el).text().trim().replace(/\s+/g, " ").split(" ");
      const last = parts[parts.length - 1]?.toLowerCase();
      if (last && last.length > 2) pageLastNames.add(last);
    });

    return { name, location, pageLastNames };
  } catch {
    return null;
  }
}

/**
 * Cross-validate: confirm the UFC.com page is for the SAME event
 * by checking that at least 1 fighter in our DB appears on the page.
 * If our DB has no fighters for this event, we allow the update (can't disprove).
 */
function isValidMatch(
  pageResult: PageResult,
  dbLastNames: string[],
): boolean {
  if (dbLastNames.length === 0) return true; // no DB data to validate against
  if (pageResult.pageLastNames.size === 0) return true; // page has no fighter list (pre-announced)

  for (const last of dbLastNames) {
    if (pageResult.pageLastNames.has(last)) return true;
  }
  return false;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n=== Fix Event Names & Venues (${DRY_RUN ? "DRY RUN — no writes" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Load only past events that need fixing
    const events = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        OR: [
          { name: "Unknown" },
          { location: null },
        ],
      },
      include: {
        fights: {
          include: {
            fighter1: { select: { name: true } },
            fighter2: { select: { name: true } },
          },
          orderBy: { isTitleFight: "desc" },
          take: 8,
        },
      },
      orderBy: { date: "desc" },
      take: LIMIT,
    });

    const needNameCount = events.filter(e => e.name === "Unknown").length;
    const needLocCount  = events.filter(e => e.location === null).length;
    console.log(`Events to process : ${events.length} (capped at ${LIMIT})`);
    console.log(`  Need name fix   : ${needNameCount}`);
    console.log(`  Need venue fix  : ${needLocCount}\n`);

    let fixedName = 0;
    let fixedLocation = 0;
    let skippedValidation = 0;
    let skippedNothingFound = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const d = new Date(event.date);
      const dateStr = `${MONTH_NAMES[d.getUTCMonth()].charAt(0).toUpperCase() + MONTH_NAMES[d.getUTCMonth()].slice(1)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

      const needsName     = event.name === "Unknown";
      const needsLocation = event.location === null;

      const issues = [needsName && "NAME", needsLocation && "VENUE"].filter(Boolean).join(" + ");
      process.stdout.write(`[${String(i + 1).padStart(3)}/${events.length}] ${dateStr}  needs: ${issues}`);

      // Build last-names list from DB fighters for validation
      const dbFighters = event.fights.flatMap(f => [f.fighter1, f.fighter2]).filter(Boolean) as { name: string }[];
      const dbLastNames = dbFighters
        .map(f => f.name.split(" ").pop()?.toLowerCase() || "")
        .filter(n => n.length > 2);

      // ── Try UFC.com ──────────────────────────────────────────────────────────
      let pageResult: PageResult | null = null;
      let usedSlug = "";

      for (const slug of slugCandidates(d, event.name)) {
        const result = await fetchAndParse(slug);
        await sleep(DELAY_MS);

        if (!result) continue;

        if (!isValidMatch(result, dbLastNames)) {
          process.stdout.write(`\n  ⚠ Cross-validation failed (slug: ${slug}) — different event, skipping slug`);
          continue;
        }

        pageResult = result;
        usedSlug = slug;
        break;
      }

      // ── Resolve name ─────────────────────────────────────────────────────────
      let resolvedName: string | null = null;
      let nameSource = "";

      if (needsName) {
        if (pageResult?.name) {
          resolvedName = pageResult.name;
          nameSource = `UFC.com (${usedSlug})`;
        } else if (dbFighters.length >= 2) {
          const f1 = event.fights[0]?.fighter1?.name;
          const f2 = event.fights[0]?.fighter2?.name;
          if (f1 && f2) {
            resolvedName = `UFC Fight Night: ${f1} vs. ${f2}`;
            nameSource = "fight card";
          }
        }
        if (!resolvedName) {
          resolvedName = `UFC Fight Night (${dateStr})`;
          nameSource = "date fallback";
        }
      }

      // ── Resolve location ─────────────────────────────────────────────────────
      let resolvedLocation: string | null = null;
      let locationSource = "";

      if (needsLocation) {
        if (pageResult?.location) {
          resolvedLocation = pageResult.location;
          locationSource = `UFC.com (${usedSlug})`;
        }
        // No reliable fallback for location — only trust UFC.com
      }

      // ── Build update payload ──────────────────────────────────────────────────
      const updates: { name?: string; location?: string } = {};
      if (needsName && resolvedName) updates.name = resolvedName;
      if (needsLocation && resolvedLocation) updates.location = resolvedLocation;

      if (Object.keys(updates).length === 0) {
        process.stdout.write(` → nothing found\n`);
        skippedNothingFound++;
        continue;
      }

      // Print changes
      process.stdout.write("\n");
      if (updates.name)     console.log(`  NAME     : "${event.name}" → "${updates.name}"  [${nameSource}]`);
      if (updates.location) console.log(`  VENUE    : (null) → "${updates.location}"  [${locationSource}]`);

      if (!DRY_RUN) {
        await prisma.event.update({ where: { id: event.id }, data: updates });
      }

      if (updates.name)     fixedName++;
      if (updates.location) fixedLocation++;
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log(`\n── Summary ────────────────────────────────────────────────────`);
    console.log(`  Names fixed      : ${fixedName}`);
    console.log(`  Venues fixed     : ${fixedLocation}`);
    console.log(`  Nothing found    : ${skippedNothingFound}`);
    if (DRY_RUN) {
      console.log(`\n  This was a DRY RUN — no data was changed.`);
      console.log(`  Add --execute to apply the changes above.`);
    } else {
      console.log(`\n  ✓ All changes written to DB.`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
