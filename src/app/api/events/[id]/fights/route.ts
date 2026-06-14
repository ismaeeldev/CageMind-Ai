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

function generateEventSlug(eventName: string): string {
  const numberedMatch = eventName.match(/UFC\s+(\d+)/i);
  if (numberedMatch) return `ufc-${numberedMatch[1]}`;

  const ufcNamedMatch = eventName.match(/^UFC\s+(.+)/i);
  if (ufcNamedMatch) {
    return `ufc-${ufcNamedMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`;
  }

  const vsMatch = eventName.match(/(.+?)\s+vs\.?\s+(.+)/i);
  if (vsMatch) {
    const f1Last = vsMatch[1].trim().split(/\s+/).pop()?.toLowerCase() || "";
    const f2Last = vsMatch[2].trim().split(/\s+/).pop()?.toLowerCase() || "";
    return `ufc-fight-night-${f1Last}-vs-${f2Last}`;
  }

  return eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
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
        const urlSlug = generateEventSlug(event.name);
        const eventUrl = `https://www.ufc.com/event/${urlSlug}`;
        const scraper = new FightCardScraper(eventUrl, event.id, false);
        await scraper.run();
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

    // Scrapers returned no data — tell the client to show a syncing state
    // rather than writing fake placeholder fights to the database.
    return NextResponse.json({
      fights: [],
      syncing: true,
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
