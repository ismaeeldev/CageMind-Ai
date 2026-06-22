/**
 * Fetches UFC betting odds from The Odds API (free tier — 500 req/month).
 * Get your free API key at: https://the-odds-api.com  (sign up, no credit card)
 * Add to .env: ODDS_API_KEY=your_key_here
 *
 * Usage:
 *   npm run odds:fetch-dry     (preview — shows which fights would get odds)
 *   npm run odds:fetch         (write to DB)
 */
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const DRY_RUN = !process.argv.includes("--execute");
const API_KEY = process.env.ODDS_API_KEY;
const SPORT = "mma_mixed_martial_arts";

if (!API_KEY) {
  console.error(
    "\n❌  ODDS_API_KEY is not set.\n" +
    "   1. Go to https://the-odds-api.com and sign up for FREE (500 req/month, no card needed)\n" +
    "   2. Copy your API key from the dashboard\n" +
    "   3. Add to .env:  ODDS_API_KEY=your_key_here\n" +
    "   4. Re-run this script.\n"
  );
  process.exit(1);
}

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("sslmode", "require");
  return u.toString();
}

function normName(n: string): string {
  return n.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function nameSimilarity(a: string, b: string): number {
  const wa = normName(a).split(/\s+/);
  const wb = normName(b).split(/\s+/);
  return wa.filter(w => w.length > 1 && wb.includes(w)).length;
}

interface OddsOutcome {
  name: string;
  price: number; // American odds e.g. -150 or +130
}

interface OddsMarket {
  key: string;
  outcomes: OddsOutcome[];
}

interface OddsEvent {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    markets: OddsMarket[];
  }[];
}

async function fetchOdds(url: string): Promise<OddsEvent[]> {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  const remaining = res.headers.get("x-requests-remaining");
  const used = res.headers.get("x-requests-used");
  console.log(`  [Odds API] Used: ${used}, Remaining: ${remaining}`);

  if (res.status === 401) {
    console.error("\n❌  Invalid ODDS_API_KEY. Check your key at https://the-odds-api.com\n");
    process.exit(1);
  }
  if (!res.ok) throw new Error(`Odds API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false }, max: 3 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  console.log(`\n=== UFC Odds Fetcher (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  // Fetch upcoming UFC odds from The Odds API
  const upcomingUrl = `https://api.the-odds-api.com/v4/sports/${SPORT}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h&oddsFormat=american`;
  console.log("Fetching upcoming odds from The Odds API...");
  const oddsEvents: OddsEvent[] = await fetchOdds(upcomingUrl);
  console.log(`  Got ${oddsEvents.length} upcoming events with odds\n`);

  if (oddsEvents.length === 0) {
    console.log("No upcoming UFC odds found. This API mainly covers active/upcoming events.");
    console.log("For historical odds, consider BestFightOdds.com (scraping) or a paid plan.\n");
    await cleanup(prisma, pool);
    return;
  }

  // Load upcoming fights from DB that have no odds yet
  const fights = await prisma.fight.findMany({
    where: {
      oddsFighter1: null,
      event: { isUpcoming: true },
    },
    include: {
      fighter1: { select: { id: true, name: true } },
      fighter2: { select: { id: true, name: true } },
      event: { select: { name: true, date: true } },
    },
  });

  console.log(`DB upcoming fights with no odds: ${fights.length}`);
  let updated = 0;

  for (const fight of fights) {
    // Find matching odds event (by commence date + fighter names)
    const fightDate = new Date(fight.event.date);

    for (const oddsEvent of oddsEvents) {
      const oddsDate = new Date(oddsEvent.commence_time);
      const daysDiff = Math.abs((oddsDate.getTime() - fightDate.getTime()) / 86400000);
      if (daysDiff > 3) continue;

      // Match fighters: home_team and away_team to fighter1 and fighter2
      const f1sim1 = nameSimilarity(fight.fighter1.name, oddsEvent.home_team);
      const f1sim2 = nameSimilarity(fight.fighter1.name, oddsEvent.away_team);
      const f2sim1 = nameSimilarity(fight.fighter2.name, oddsEvent.home_team);
      const f2sim2 = nameSimilarity(fight.fighter2.name, oddsEvent.away_team);

      const f1IsHome = f1sim1 >= 1 && f1sim1 >= f1sim2;
      const f2IsAway = f2sim2 >= 1 && f2sim2 >= f2sim1;
      const f1IsAway = f1sim2 >= 1 && f1sim2 >= f1sim1;
      const f2IsHome = f2sim1 >= 1 && f2sim1 >= f2sim2;

      if (!(f1IsHome && f2IsAway) && !(f1IsAway && f2IsHome)) continue;

      // Get best available moneyline odds (prefer DraftKings > FanDuel > BetMGM > first available)
      const BOOK_PRIORITY = ["draftkings", "fanduel", "betmgm", "betrivers", "pointsbetus", "unibet_us"];
      const market = oddsEvent.bookmakers
        .sort((a, b) => {
          const ai = BOOK_PRIORITY.indexOf(a.key);
          const bi = BOOK_PRIORITY.indexOf(b.key);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        })
        .flatMap(b => b.markets.filter(m => m.key === "h2h"))[0];

      if (!market) continue;

      const homeOdds = market.outcomes.find(o => normName(o.name) === normName(oddsEvent.home_team));
      const awayOdds = market.outcomes.find(o => normName(o.name) === normName(oddsEvent.away_team));

      const oddF1 = f1IsHome ? homeOdds?.price : awayOdds?.price;
      const oddF2 = f2IsAway ? awayOdds?.price : homeOdds?.price;

      if (!oddF1 || !oddF2) continue;

      console.log(`  MATCH: ${fight.fighter1.name}(${oddF1}) vs ${fight.fighter2.name}(${oddF2})`);

      if (!DRY_RUN) {
        await prisma.fight.update({
          where: { id: fight.id },
          data: { oddsFighter1: Math.round(oddF1), oddsFighter2: Math.round(oddF2) },
        });
      }
      updated++;
      break;
    }
  }

  console.log(`\nOdds ${DRY_RUN ? "would be" : "were"} updated for ${updated} fights.`);
  if (DRY_RUN) console.log("Run with --execute to write to DB.");

  await cleanup(prisma, pool);
}

async function cleanup(prisma: PrismaClient, pool: Pool) {
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
