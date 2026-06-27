import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FightCardScraper } from "@/scrapers/fight-card-scraper";
import { scrapeAndSaveFighter } from "@/lib/fighter-scraper";
import { TapologyScraper } from "@/scrapers/tapology-scraper";

export const maxDuration = 300;

// Module-level cache: avoids re-scraping events with no published fight card on every reload.
// Keyed by event ID. Expires after 1 hour so the app picks up newly announced cards automatically.
const _noCardCache = new Map<string, { preview: object | null; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

function needsImageScrape(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return true;
  const trimmed = imageUrl.trim();
  return !trimmed || trimmed === "null" || trimmed === "undefined" || trimmed === "N/A";
}

/**
 * Returns an ordered list of UFC.com slug candidates to try for an event.
 * UFC.com uses date-based slugs for Fight Nights (ufc-fight-night-june-20-2026)
 * and number-based slugs for PPVs (ufc-300).
 */
function generateSlugCandidates(eventName: string, eventDate?: Date | null): string[] {
  const candidates: string[] = [];

  // Numbered PPV: "UFC 300" → ufc-300
  const numberedMatch = eventName.match(/UFC\s+(\d+)/i);
  if (numberedMatch) {
    candidates.push(`ufc-${numberedMatch[1]}`);
    return candidates;
  }

  // All non-PPV events: always try date-based slug first (UFC.com uses this for all Fight Nights)
  if (eventDate) {
    const month = new Date(eventDate).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
    const day = new Date(eventDate).getUTCDate();
    const year = new Date(eventDate).getUTCFullYear();
    candidates.push(`ufc-fight-night-${month}-${day}-${year}`);
  }

  // Fallback: name-based slug from "UFC Fight Night: Fighter vs Fighter"
  const ufcNamedMatch = eventName.match(/^UFC\s+(.+)/i);
  if (ufcNamedMatch) {
    candidates.push(`ufc-${ufcNamedMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`);
  }

  // Last-resort: full last names from "Fighter vs Fighter" pattern
  const vsMatch = eventName.match(/(.+?)\s+vs\.?\s+(.+)/i);
  if (vsMatch) {
    const f1 = vsMatch[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const f2 = vsMatch[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    candidates.push(`ufc-fight-night-${f1}-vs-${f2}`);
    // Also try last-name-only variant
    const f1Last = vsMatch[1].trim().split(/\s+/).pop()?.toLowerCase() || "";
    const f2Last = vsMatch[2].trim().split(/\s+/).pop()?.toLowerCase() || "";
    if (f1Last !== f1) candidates.push(`ufc-fight-night-${f1Last}-vs-${f2Last}`);
  }

  return candidates.length > 0 ? candidates : [eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")];
}

const FIGHTS_INCLUDE = {
  fights: {
    include: { fighter1: true, fighter2: true },
    orderBy: [{ isTitleFight: "desc" as const }],
  },
};

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: FIGHTS_INCLUDE,
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Fights already exist — resolve any missing images and return
    if (event.fights.length > 0) {
      await enqueueImageScrapes(event.fights, event.isUpcoming);
      const refreshedEvent = await prisma.event.findUnique({
        where: { id },
        include: FIGHTS_INCLUDE,
      });
      return NextResponse.json({
        fights: refreshedEvent?.fights ?? event.fights,
        isUpcoming: event.isUpcoming,
      });
    }

    // No fights in DB yet — check cache before hitting external scrapers
    if (event.isUpcoming) {
      const hit = _noCardCache.get(id);
      if (hit && Date.now() - hit.ts < CACHE_TTL) {
        return NextResponse.json({ fights: [], preview: hit.preview, isUpcoming: true });
      }
    }

    // No cache hit — attempt to scrape from Tapology then UFC.com
    try {
      const tapologyScraper = new TapologyScraper(event.id, event.name);
      const tapologySuccess = await tapologyScraper.scrapeAndSave();

      if (!tapologySuccess) {
        const slugCandidates = generateSlugCandidates(event.name, event.date);
        for (const slug of slugCandidates) {
          const eventUrl = `https://www.ufc.com/event/${slug}`;
          console.log(`[FightsAPI] Trying UFC.com slug: ${slug}`);
          const scraper = new FightCardScraper(eventUrl, event.id, false);
          await scraper.run();

          // Stop if fights were saved by this slug
          const check = await prisma.event.findUnique({
            where: { id },
            select: { _count: { select: { fights: true } } },
          });
          if (check && check._count.fights > 0) break;
        }
      }

      const refreshedEvent = await prisma.event.findUnique({
        where: { id },
        include: FIGHTS_INCLUDE,
      });

      if (refreshedEvent && refreshedEvent.fights.length > 0) {
        await enqueueImageScrapes(refreshedEvent.fights, event.isUpcoming);
        const finalEvent = await prisma.event.findUnique({
          where: { id },
          include: FIGHTS_INCLUDE,
        });
        return NextResponse.json({
          fights: finalEvent?.fights ?? refreshedEvent.fights,
          isUpcoming: event.isUpcoming,
        });
      }
    } catch (scrapeError) {
      console.error(`[FightsAPI] Scraping failed for ${event.name}:`, scrapeError);
    }

    // Scrapers returned no data.
    // For upcoming events: try to resolve main fighters from the event name so the card can show images.
    // For past events: show syncing (we'll retry).
    if (event.isUpcoming) {
      const preview = await buildNameBasedPreview(event.name);
      _noCardCache.set(id, { preview, ts: Date.now() });
      return NextResponse.json({ fights: [], preview, isUpcoming: true });
    }

    return NextResponse.json({ fights: [], syncing: true, isUpcoming: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Looks up a fighter in the DB by an event-name segment like "Du Plessis", "Holloway 2", "Machado Garry".
 * Strips trailing rematch numbers, tries full-segment contains-search first, then falls back to last word.
 * Returns the highest-ELO match that has an image; falls back to highest-ELO if none have images.
 */
async function findFighterByEventNamePart(namePart: string) {
  const cleaned = namePart.trim().replace(/\s+(2|3|II|III|IV|V)$/i, "").trim();
  if (!cleaned || cleaned.toLowerCase() === "tbd") return null;

  const pick = (rows: { id: string; name: string; imageUrl: string | null; wins: number | null; losses: number | null; draws: number | null; eloRating: number | null }[]) => {
    if (rows.length === 0) return null;
    // Among candidates with a valid image, prefer the most experienced fighter (most wins).
    // This prevents a lower-profile fighter with temporarily higher ELO from shadowing
    // the real event headliner (e.g. Mohammed Usman over Kamaru Usman).
    const withImage = rows.filter(f => !needsImageScrape(f.imageUrl));
    if (withImage.length > 0) {
      return withImage.sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0))[0];
    }
    return rows[0];
  };

  const fields = { id: true, name: true, imageUrl: true, wins: true, losses: true, draws: true, eloRating: true } as const;

  // Full-segment search: finds "Du Plessis" → "Dricus Du Plessis", "Machado Garry" → "Ian Machado Garry"
  const byFull = await prisma.fighter.findMany({
    where: { name: { contains: cleaned, mode: "insensitive" } },
    select: fields,
    orderBy: { eloRating: "desc" },
    take: 3,
  });
  const fromFull = pick(byFull);
  if (fromFull) return fromFull;

  // Last-word fallback: "Holloway" from "Holloway", "Garry" from "Machado Garry"
  const lastName = cleaned.split(" ").pop()!;
  if (lastName.length < 3) return null;

  const byLast = await prisma.fighter.findMany({
    where: { name: { contains: lastName, mode: "insensitive" } },
    select: fields,
    orderBy: { eloRating: "desc" },
    take: 3,
  });
  return pick(byLast);
}

/**
 * Parses "Fighter1 vs Fighter2" from an event name and looks both up in the DB.
 * Returns a preview object { fighter1, fighter2 } for use when no fight records exist yet.
 * Returns null if the name doesn't match the pattern or either fighter is not found.
 */
async function buildNameBasedPreview(eventName: string) {
  const vsMatch = eventName.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (!vsMatch) return null;

  const [fighter1, fighter2] = await Promise.all([
    findFighterByEventNamePart(vsMatch[1]),
    findFighterByEventNamePart(vsMatch[2]),
  ]);

  if (!fighter1 || !fighter2) return null;
  return { fighter1, fighter2 };
}

/**
 * For a fighter slot with no image, find the best matching DB record:
 *   1. Search by name (case-insensitive) across all records
 *   2. Prefer the record that already has a valid image
 *   3. If none have an image, prefer the record with the most wins (real fighter, not empty duplicate)
 *   4. Fall back to currentId if nothing better is found
 */
async function resolveBestFighterId(
  currentId: string,
  name: string,
): Promise<string> {
  const candidates = await prisma.fighter.findMany({
    where: { name: { equals: name, mode: "insensitive" } },
    select: { id: true, imageUrl: true, wins: true },
  });

  if (candidates.length === 0) return currentId;

  // Prefer any record that already has a valid image
  const withImage = candidates.find(f => !needsImageScrape(f.imageUrl));
  if (withImage) return withImage.id;

  // No image anywhere — prefer the record with most wins (more data = real fighter)
  const sorted = [...candidates].sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0));
  const best = sorted[0];
  return (best.wins ?? 0) > 0 ? best.id : currentId;
}

/**
 * Processes all fights in an event sequentially (queue).
 * Only runs for UPCOMING events.
 * Only processes fighters that are missing an image — skips fighters that already have one.
 * For each missing-image fighter:
 *   1. Resolve the best matching DB record (fixes wrong-duplicate issues like Abus Magomedov)
 *   2. If a better record is found, update the fight FK to point to it
 *   3. Scrape UFC.com athlete page to fill in image + stats on that record
 * Once a fighter has an image in DB, they are skipped on every subsequent request.
 */
async function enqueueImageScrapes(fights: any[], isUpcoming: boolean): Promise<void> {
  if (!isUpcoming || fights.length === 0) return;

  for (const fight of fights) {
    // ── Fighter 1 ──────────────────────────────────────────────────────────
    if (needsImageScrape(fight.fighter1?.imageUrl)) {
      const bestId = await resolveBestFighterId(fight.fighter1Id, fight.fighter1.name);

      if (bestId !== fight.fighter1Id) {
        await prisma.fight.update({
          where: { id: fight.id },
          data: { fighter1Id: bestId },
        }).catch(() => {});
      }

      await scrapeAndSaveFighter(bestId).catch(err =>
        console.error(`[FightsAPI] Image scrape failed for ${fight.fighter1.name}:`, err)
      );
    }

    // ── Fighter 2 ──────────────────────────────────────────────────────────
    if (needsImageScrape(fight.fighter2?.imageUrl)) {
      const bestId = await resolveBestFighterId(fight.fighter2Id, fight.fighter2.name);

      if (bestId !== fight.fighter2Id) {
        await prisma.fight.update({
          where: { id: fight.id },
          data: { fighter2Id: bestId },
        }).catch(() => {});
      }

      await scrapeAndSaveFighter(bestId).catch(err =>
        console.error(`[FightsAPI] Image scrape failed for ${fight.fighter2.name}:`, err)
      );
    }
  }
}
