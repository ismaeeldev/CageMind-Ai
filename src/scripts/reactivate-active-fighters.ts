import "dotenv/config";
import { prisma } from "../lib/db";
import * as cheerio from "cheerio";

function getSlugCandidates(ufcId: string, name: string): string[] {
  const candidates = new Set<string>();
  const clean = (s: string) => s.toLowerCase().replace(/['"’‘“”\.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const cleanWithHyphen = (s: string) => s.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  
  let originalSlug = ufcId;
  if (originalSlug) {
    if (originalSlug.startsWith("/athlete/")) {
      originalSlug = originalSlug.replace("/athlete/", "");
    }
    candidates.add(clean(originalSlug));
    candidates.add(cleanWithHyphen(originalSlug));
  }
  
  const nameCleaned = name.toLowerCase().replace(/['"’‘“”]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
  const parts = nameCleaned.split(/\s+/);
  
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    candidates.add(`${clean(first)}-${clean(last)}`);
    candidates.add(parts.map(clean).filter(Boolean).join("-"));
    candidates.add(`${clean(first)}${clean(last)}`);
  }
  candidates.add(clean(name));
  candidates.add(cleanWithHyphen(name));
  
  return Array.from(candidates).map(slug => `/athlete/${slug}`);
}

async function verifyUfcAthleteActive(ufcId: string, name: string): Promise<boolean> {
  const slugs = getSlugCandidates(ufcId, name);
  for (const slug of slugs) {
    const url = `https://www.ufc.com${slug}`;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(6000)
      });
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        const heroText = $(".hero-profile__division, .hero-profile__tag, .hero-profile__division-body").text().toLowerCase();
        if (heroText.includes("former athlete")) {
          return false;
        }
        return true;
      }
    } catch (error: any) {
      const errMsg = error?.message || "";
      if (
        errMsg.includes("fetch failed") ||
        errMsg.includes("ENOTFOUND") ||
        errMsg.includes("ETIMEDOUT") ||
        errMsg.includes("ECONNREFUSED") ||
        error?.code === "ENOTFOUND" ||
        error?.code === "ETIMEDOUT"
      ) {
        throw error;
      }
      return true; // default to true on rate-limits/timeouts
    }
  }
  return false;
}

async function reactivateActiveFighters() {
  console.log("=== Starting Reactivation of Active Fighters ===");
  
  // 1. Get all inactive fighters
  const inactiveFighters = await prisma.fighter.findMany({
    where: { isActive: false }
  });
  console.log(`Found ${inactiveFighters.length} inactive fighters in database.`);

  // 2. Identify fighters with upcoming fights
  const upcomingFights = await prisma.fight.findMany({
    where: { event: { isUpcoming: true } },
    select: { fighter1Id: true, fighter2Id: true }
  });
  const upcomingFighterIds = new Set(upcomingFights.flatMap(f => [f.fighter1Id, f.fighter2Id]));

  // 3. Find last fight date for all inactive fighters
  const lastFights = await prisma.fight.findMany({
    where: {
      OR: [
        { fighter1Id: { in: inactiveFighters.map(f => f.id) } },
        { fighter2Id: { in: inactiveFighters.map(f => f.id) } }
      ],
      event: { isUpcoming: false }
    },
    select: {
      fighter1Id: true,
      fighter2Id: true,
      event: {
        select: { date: true }
      }
    }
  });

  const lastFightDatesMap = new Map<string, Date>();
  for (const fight of lastFights) {
    const date = new Date(fight.event.date);
    for (const fId of [fight.fighter1Id, fight.fighter2Id]) {
      const currentLast = lastFightDatesMap.get(fId);
      if (!currentLast || date > currentLast) {
        lastFightDatesMap.set(fId, date);
      }
    }
  }

  const reactivatedFighterIds: string[] = [];

  for (const fighter of inactiveFighters) {
    let shouldReactivate = false;
    let reason = "";

    // A. Upcoming fight immunity
    if (upcomingFighterIds.has(fighter.id)) {
      shouldReactivate = true;
      reason = "Has upcoming scheduled fight";
    }

    // B. Verify active status from UFC website (using name or ufcId)
    if (!shouldReactivate) {
      const isStillActive = await verifyUfcAthleteActive(fighter.ufcId || "", fighter.name);
      if (isStillActive) {
        shouldReactivate = true;
        reason = "Verified active status from UFC website";
      }
    }

    if (shouldReactivate) {
      console.log(`[REACTIVATE] Reactivating ${fighter.name} (ID: ${fighter.id}). Reason: ${reason}`);
      try {
        await prisma.fighter.update({
          where: { id: fighter.id },
          data: { isActive: true }
        });
        reactivatedFighterIds.push(fighter.id);
      } catch (err) {
        console.error(`Failed to update status for ${fighter.name}:`, err);
      }
    }
  }

  console.log(`Reactivation complete. Reactivated ${reactivatedFighterIds.length} fighters in this run.`);
}

reactivateActiveFighters()
  .catch(err => {
    console.error("Critical error in reactivateActiveFighters:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
