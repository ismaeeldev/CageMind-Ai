import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { FightCardScraper } from "@/scrapers/fight-card-scraper";
import { scrapeAndSaveFighter } from "@/lib/fighter-scraper";
import { TapologyScraper } from "@/scrapers/tapology-scraper";

export const maxDuration = 300;

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

    // Fights already exist — update images and return real data
    if (event.fights.length > 0) {
      await scrapeMainFighterImages(event.fights);
      const refreshedEvent = await prisma.event.findUnique({
        where: { id },
        include: FIGHTS_INCLUDE,
      });
      return NextResponse.json({
        fights: refreshedEvent?.fights ?? event.fights,
        isUpcoming: event.isUpcoming,
      });
    }

    // No fights in DB yet — attempt to scrape from Tapology then UFC.com
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
        await scrapeMainFighterImages(refreshedEvent.fights);
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
    // For past events: show syncing (we'll retry). For upcoming: show "not yet announced".
    return NextResponse.json({
      fights: [],
      syncing: !event.isUpcoming,
      isUpcoming: event.isUpcoming,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function scrapeMainFighterImages(fights: any[]) {
  if (fights.length === 0) return;
  const mainFight = fights[0];
  if (!mainFight) return;

  const promises: Promise<any>[] = [];

  if (needsImageScrape(mainFight.fighter1?.imageUrl)) {
    promises.push(
      scrapeAndSaveFighter(mainFight.fighter1Id).catch((err) =>
        console.error(`Image scrape failed for fighter1:`, err)
      )
    );
  }

  if (needsImageScrape(mainFight.fighter2?.imageUrl)) {
    promises.push(
      scrapeAndSaveFighter(mainFight.fighter2Id).catch((err) =>
        console.error(`Image scrape failed for fighter2:`, err)
      )
    );
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
}
