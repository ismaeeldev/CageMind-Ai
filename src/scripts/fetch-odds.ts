import "dotenv/config";
import { prisma } from "../lib/db";
import { logger } from "../lib/logger";

const ODDS_API_KEY = process.env.ODDS_API_KEY;

// Normalization function to match The-Odds-API names to our DB names
function normalizeName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Converts decimal odds to American odds
 * @param decimal e.g. 1.50
 * @returns e.g. -200
 */
function decimalToAmerican(decimal: number): number {
  if (decimal >= 2.0) {
    return Math.round((decimal - 1) * 100);
  } else {
    return Math.round(-100 / (decimal - 1));
  }
}

export async function fetchLiveOdds() {
  if (!ODDS_API_KEY) {
    logger.error("Missing ODDS_API_KEY in environment variables. Sign up at https://the-odds-api.com/ and add it to .env");
    return;
  }

  logger.info("Fetching live MMA odds from The-Odds-API (FanDuel/DraftKings)...");

  try {
    // We use bookmakers=fanduel,draftkings to get reliable odds. We prefer fanduel.
    const url = `https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&bookmakers=fanduel,draftkings`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`The-Odds-API returned ${res.status}: ${text}`);
    }

    const data = await res.json();
    logger.info(`Fetched ${data.length} upcoming MMA matches from API.`);

    // Fetch all upcoming fights from our database
    const upcomingFights = await prisma.fight.findMany({
      where: { event: { isUpcoming: true } },
      include: { fighter1: true, fighter2: true }
    });

    let matchedCount = 0;

    for (const apiMatch of data) {
      if (!apiMatch.bookmakers || apiMatch.bookmakers.length === 0) continue;

      // Prefer FanDuel, fallback to the first available
      const bookie = apiMatch.bookmakers.find((b: any) => b.key === 'fanduel') || apiMatch.bookmakers[0];
      const market = bookie.markets.find((m: any) => m.key === 'h2h');
      if (!market || !market.outcomes || market.outcomes.length < 2) continue;

      const out1 = market.outcomes[0];
      const out2 = market.outcomes[1];

      const apiName1 = normalizeName(out1.name);
      const apiName2 = normalizeName(out2.name);
      const odds1 = decimalToAmerican(out1.price);
      const odds2 = decimalToAmerican(out2.price);

      // Try to find the matching fight in our DB
      const dbFight = upcomingFights.find(f => {
        const dbName1 = normalizeName(f.fighter1.name);
        const dbName2 = normalizeName(f.fighter2.name);

        return (dbName1 === apiName1 && dbName2 === apiName2) || 
               (dbName1 === apiName2 && dbName2 === apiName1);
      });

      if (dbFight) {
        // Map the odds to the correct fighter1 / fighter2 slots
        const isF1First = normalizeName(dbFight.fighter1.name) === apiName1;
        
        await prisma.fight.update({
          where: { id: dbFight.id },
          data: {
            oddsFighter1: isF1First ? odds1 : odds2,
            oddsFighter2: isF1First ? odds2 : odds1,
          }
        });

        matchedCount++;
        logger.info(`Updated odds for ${dbFight.fighter1.name} (${isF1First ? odds1 : odds2}) vs ${dbFight.fighter2.name} (${isF1First ? odds2 : odds1})`);
      }
    }

    logger.info(`Successfully mapped and saved odds for ${matchedCount} fights.`);

  } catch (error) {
    logger.error("Failed to fetch odds:", error);
  }
}

if (require.main === module) {
  fetchLiveOdds()
    .catch(console.error)
    .finally(async () => {
      await prisma.$disconnect();
    });
}
