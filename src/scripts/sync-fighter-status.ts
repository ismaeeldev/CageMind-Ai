import "dotenv/config";
import { prisma } from "../lib/db";
import * as cheerio from "cheerio";

async function getTapologyFighterStatus(name: string): Promise<string | null> {
  const searchUrl = `https://www.tapology.com/search?term=${encodeURIComponent(name)}&mainSearchFilter=fighters`;
  try {
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return null;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let fighterPath = "";
    $('a[href*="/fighters/"]').each((_, el) => {
      const href = $(el).attr("href");
      // Filter out general list links and pick the athlete page URL
      if (href && !fighterPath && href.includes("/fighters/") && !href.endsWith("/fighters")) {
        fighterPath = href;
      }
    });
    
    if (!fighterPath) return null;
    
    const url = fighterPath.startsWith("http") ? fighterPath : `https://www.tapology.com${fighterPath}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;
    const fighterHtml = await res.text();
    const $fighter = cheerio.load(fighterHtml);
    
    let statusText: string | null = null;
    $fighter('li').each((_, el) => {
      const liText = $fighter(el).text().trim();
      if (liText.startsWith("Status:")) {
        statusText = liText.replace("Status:", "").trim();
      }
    });
    
    return statusText;
  } catch (error) {
    console.error(`Error querying Tapology for ${name}:`, error);
    return null;
  }
}

async function verifyUfcAthleteActive(ufcId: string): Promise<boolean> {
  const url = ufcId.startsWith("http") ? ufcId : `https://www.ufc.com${ufcId}`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(6000)
    });
    if (!response.ok) {
      return false; // Not found / 404 indicates former or inactive profile
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const heroText = $(".hero-profile__division, .hero-profile__tag, .hero-profile__division-body").text().toLowerCase();
    if (heroText.includes("former athlete")) {
      return false;
    }
    return true;
  } catch (error) {
    // On network/timeout errors, default to true (active) to avoid false retirement
    return true;
  }
}

export async function syncFighterStatus() {
  console.log("Starting Fighter Status Synchronization (In-Memory)...");
  
  // 1. Fetch active roster (have ufcId and isActive: true)
  const activeRoster = await prisma.fighter.findMany({
    where: {
      isActive: true,
      ufcId: { not: null }
    },
    select: { name: true, ufcId: true }
  });

  const activeRosterNames = new Set(activeRoster.map(f => f.name.toLowerCase()));
  const activeRosterUfcIds = new Set(activeRoster.map(f => f.ufcId?.toLowerCase()).filter(Boolean));

  // 2. Fetch all active fighters in the DB
  const activeFighters = await prisma.fighter.findMany({
    where: { isActive: true }
  });
  console.log(`Analyzing ${activeFighters.length} currently active fighters...`);

  // 3. Fetch all fights and event dates in bulk
  console.log("Fetching fight database for bulk in-memory analysis...");
  const allFights = await prisma.fight.findMany({
    select: {
      fighter1Id: true,
      fighter2Id: true,
      event: {
        select: {
          date: true,
          isUpcoming: true
        }
      }
    }
  });

  // 4. Map fights in memory
  const upcomingFightsMap = new Map<string, number>();
  const lastFightDateMap = new Map<string, Date>();

  for (const fight of allFights) {
    const f1 = fight.fighter1Id;
    const f2 = fight.fighter2Id;
    const date = new Date(fight.event.date);

    if (fight.event.isUpcoming) {
      upcomingFightsMap.set(f1, (upcomingFightsMap.get(f1) || 0) + 1);
      upcomingFightsMap.set(f2, (upcomingFightsMap.get(f2) || 0) + 1);
    } else {
      const currentLast1 = lastFightDateMap.get(f1);
      if (!currentLast1 || date > currentLast1) {
        lastFightDateMap.set(f1, date);
      }
      const currentLast2 = lastFightDateMap.get(f2);
      if (!currentLast2 || date > currentLast2) {
        lastFightDateMap.set(f2, date);
      }
    }
  }

  // 5. Evaluate status in memory
  let updatedCount = 0;
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  const retiredFighterIds: string[] = [];
  const retiredLogs: string[] = [];

  for (const fighter of activeFighters) {
    const upcomingFightsCount = upcomingFightsMap.get(fighter.id) || 0;
    if (upcomingFightsCount > 0) {
      continue;
    }

    const lastFightDate = lastFightDateMap.get(fighter.id);

    let markInactive = false;
    let reason = "";

    if (lastFightDate && lastFightDate < twoYearsAgo) {
      markInactive = true;
      reason = `Last fight was on ${lastFightDate.toLocaleDateString()} (more than 2 years ago)`;
    } else if (!lastFightDate) {
      // No fights in DB. Check if they are in the active roster.
      const hasUfcIdMatch = fighter.ufcId && activeRosterUfcIds.has(fighter.ufcId.toLowerCase());
      const hasNameMatch = activeRosterNames.has(fighter.name.toLowerCase());
      
      if (!hasUfcIdMatch && !hasNameMatch) {
        markInactive = true;
        reason = `No fight history in DB and not found on active UFC athlete roster.`;
      }
    }

    if (markInactive && fighter.ufcId) {
      const isStillActive = await verifyUfcAthleteActive(fighter.ufcId);
      if (isStillActive) {
        markInactive = false;
      }
    }

    if (markInactive) {
      retiredFighterIds.push(fighter.id);
      retiredLogs.push(`[STATUS UPDATE] ${fighter.name} set to RETIRED. Reason: ${reason}`);
    }
  }

  if (retiredFighterIds.length > 0) {
    console.log(`Writing ${retiredFighterIds.length} status updates in batches...`);
    const batchSize = 100;
    for (let i = 0; i < retiredFighterIds.length; i += batchSize) {
      const chunk = retiredFighterIds.slice(i, i + batchSize);
      await prisma.fighter.updateMany({
        where: { id: { in: chunk } },
        data: { isActive: false }
      });
    }
    retiredLogs.forEach(log => console.log(log));
    updatedCount = retiredFighterIds.length;
  }

  console.log(`Fighter status synchronization complete. Updated ${updatedCount} fighters to inactive/retired.`);
}

// CLI Execution support
if (require.main === module) {
  syncFighterStatus()
    .catch(err => {
      console.error("Critical error in syncFighterStatus:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
