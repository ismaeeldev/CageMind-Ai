/**
 * Imports fight results for missing UFC events from the free ESPN MMA API.
 * No API key required. Covers all UFC events with full fight cards.
 *
 * Usage:
 *   npm run events:import-espn-dry     (preview only)
 *   npm run events:import-espn         (write to DB)
 */
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

const DRY_RUN = !process.argv.includes("--execute");

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("sslmode", "require");
  return u.toString();
}

// ── ESPN API helpers ──────────────────────────────────────────────────────────

interface EspnAthlete {
  fullName: string;
  displayName: string;
}

interface EspnCompetitor {
  order: number;
  winner: boolean;
  athlete: EspnAthlete;
  records: { name: string; summary: string }[];
}

interface EspnStatus {
  period: number;
  displayClock: string;
  type: { completed: boolean; state: string };
}

interface EspnCompetition {
  id: string;
  date: string;
  type: { abbreviation: string };
  competitors: EspnCompetitor[];
  status: EspnStatus;
  format: { regulation: { periods: number } };
}

interface EspnEvent {
  id: string;
  name: string;
  date: string;
  competitions: EspnCompetition[];
}

async function fetchEspnEvents(fromDate: string, toDate: string): Promise<EspnEvent[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?limit=100&dates=${fromDate}-${toDate}`;
  const res = await fetch(url, { headers: { "Accept": "application/json", "User-Agent": "CageMind/1.0" } });
  if (!res.ok) throw new Error(`ESPN API ${res.status}`);
  const data = await res.json();
  return data.events || [];
}

// ── Name matching ─────────────────────────────────────────────────────────────

function normalizeName(n: string): string {
  return n.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function nameSimilarity(a: string, b: string): number {
  const wa = normalizeName(a).split(/\s+/);
  const wb = normalizeName(b).split(/\s+/);
  const shared = wa.filter(w => w.length > 1 && wb.includes(w));
  return shared.length;
}

// Map ESPN weight class abbreviations to DB values
function mapWeightClass(abbreviation: string): string {
  const wc = abbreviation.trim();
  const map: Record<string, string> = {
    "Heavyweight": "Heavyweight",
    "Light Heavyweight": "Light Heavyweight",
    "Middleweight": "Middleweight",
    "Welterweight": "Welterweight",
    "Lightweight": "Lightweight",
    "Featherweight": "Featherweight",
    "Bantamweight": "Bantamweight",
    "Flyweight": "Flyweight",
    "Strawweight": "Strawweight",
    "W Strawweight": "Strawweight",
    "W Flyweight": "Flyweight",
    "W Bantamweight": "Bantamweight",
    "W Featherweight": "Featherweight",
    "Catch Weight": "Catch Weight",
  };
  return map[wc] || wc.replace(/^W /, "");
}

function guessMethod(period: number, clock: string, maxRounds: number): string {
  const isFinalRound = period === maxRounds;
  const [mins, secs] = clock.split(":").map(Number);
  const totalSecs = (mins || 0) * 60 + (secs || 0);
  if (isFinalRound && totalSecs >= 295) return "Decision";
  return "Finish"; // KO, TKO, or Submission
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false }, max: 3 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  console.log(`\n=== ESPN Results Importer (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  // Load DB events that are missing fight data (past events with 0 fights)
  const missingEvents = await prisma.event.findMany({
    where: {
      isUpcoming: false,
      fights: { none: {} },
    },
    select: { id: true, name: true, date: true },
    orderBy: { date: "asc" },
  });

  console.log(`Events missing fights in DB: ${missingEvents.length}`);
  if (missingEvents.length === 0) { console.log("Nothing to import."); await cleanup(prisma, pool); return; }

  // ESPN scoreboard API only works for recent date ranges (≤1 year).
  // Fetch in 6-month chunks, but cap at events from 2024 onward only.
  const TODAY = new Date();
  const EARLIEST = new Date("2024-01-01");

  const relevantEvents = missingEvents.filter(e => new Date(e.date) >= EARLIEST);
  if (relevantEvents.length === 0) {
    console.log("No recent events (2024+) missing fights. Older historical data requires a paid API.");
    await cleanup(prisma, pool);
    return;
  }

  const minDate = new Date(Math.max(new Date(relevantEvents[0].date).getTime(), EARLIEST.getTime()));
  const maxDate = new Date(Math.min(new Date(relevantEvents[relevantEvents.length - 1].date).getTime(), TODAY.getTime()));
  minDate.setDate(minDate.getDate() - 7);
  maxDate.setDate(maxDate.getDate() + 7);

  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");
  console.log(`Fetching ESPN events: ${fmt(minDate)} → ${fmt(maxDate)}\n`);

  // Fetch in 3-month chunks if range > 90 days (ESPN API limit)
  const espnEvents: EspnEvent[] = [];
  let chunkStart = new Date(minDate);
  while (chunkStart <= maxDate) {
    const chunkEnd = new Date(chunkStart);
    chunkEnd.setDate(chunkEnd.getDate() + 90);
    const effectiveEnd = chunkEnd > maxDate ? maxDate : chunkEnd;
    const batch = await fetchEspnEvents(fmt(chunkStart), fmt(effectiveEnd));
    espnEvents.push(...batch);
    chunkStart = new Date(effectiveEnd);
    chunkStart.setDate(chunkStart.getDate() + 1);
  }
  console.log(`ESPN returned ${espnEvents.length} events\n`);

  // Load all DB fighters for matching
  const dbFighters = await prisma.fighter.findMany({ select: { id: true, name: true } });

  let totalFightsImported = 0;
  let totalEventsMatched = 0;

  for (const dbEvent of relevantEvents) {
    // Match ESPN event by name similarity + date proximity
    const dbDate = new Date(dbEvent.date);
    const bestMatch = espnEvents
      .map(e => {
        const espnDate = new Date(e.date);
        const daysDiff = Math.abs((espnDate.getTime() - dbDate.getTime()) / 86400000);
        const nameSim = nameSimilarity(dbEvent.name, e.name);
        return { event: e, daysDiff, nameSim };
      })
      .filter(m => m.daysDiff <= 3) // within 3 days
      .sort((a, b) => b.nameSim - a.nameSim || a.daysDiff - b.daysDiff)[0];

    if (!bestMatch) {
      console.log(`  [NO MATCH] "${dbEvent.name}" (${dbDate.toISOString().slice(0, 10)})`);
      continue;
    }

    const espnEvent = bestMatch.event;
    console.log(`  [MATCH] "${dbEvent.name}" ↔ "${espnEvent.name}" (${bestMatch.daysDiff.toFixed(1)}d diff)`);
    totalEventsMatched++;

    let fightsAdded = 0;

    for (const comp of espnEvent.competitions) {
      if (!comp.status.type.completed) continue;
      if (comp.competitors.length !== 2) continue;

      const [c1, c2] = comp.competitors.sort((a, b) => a.order - b.order);
      const f1Name = c1.athlete.fullName;
      const f2Name = c2.athlete.fullName;
      const winner = c1.winner ? c1 : c2.winner ? c2 : null;

      // Find or create fighter1
      const dbF1 = await findOrCreateFighter(prisma, dbFighters, f1Name, DRY_RUN);
      const dbF2 = await findOrCreateFighter(prisma, dbFighters, f2Name, DRY_RUN);

      if (!dbF1 || !dbF2) {
        console.log(`    [SKIP] Could not resolve: ${f1Name} vs ${f2Name}`);
        continue;
      }

      const winnerId = winner?.athlete.fullName === f1Name ? dbF1.id
        : winner?.athlete.fullName === f2Name ? dbF2.id : null;

      const weightClass = mapWeightClass(comp.type.abbreviation);
      const endingRound = comp.status.period;
      const endingTime = comp.status.displayClock;
      const maxRounds = comp.format?.regulation?.periods || 3;
      const method = guessMethod(endingRound, endingTime, maxRounds);
      const rounds = maxRounds;

      console.log(`    ${f1Name} vs ${f2Name} [${weightClass}] → winner:${winner?.athlete.fullName || "NC"} R${endingRound} ${endingTime} (${method})`);

      if (!DRY_RUN) {
        await prisma.fight.create({
          data: {
            eventId: dbEvent.id,
            fighter1Id: dbF1.id,
            fighter2Id: dbF2.id,
            winnerId,
            weightClass,
            rounds,
            method,
            endingRound,
            endingTime,
            isTitleFight: false,
          },
        });
      }
      fightsAdded++;
    }

    console.log(`    → ${fightsAdded} fights ${DRY_RUN ? "would be" : "were"} imported\n`);
    totalFightsImported += fightsAdded;
  }

  console.log(`\n========== Summary ==========`);
  console.log(`Events matched:   ${totalEventsMatched} / ${relevantEvents.length}`);
  console.log(`Fights ${DRY_RUN ? "to import" : "imported"}: ${totalFightsImported}`);
  if (DRY_RUN) console.log(`\nRun with --execute to write to DB.`);

  await cleanup(prisma, pool);
}

async function findOrCreateFighter(
  prisma: PrismaClient,
  cache: { id: string; name: string }[],
  name: string,
  dryRun: boolean
): Promise<{ id: string; name: string } | null> {
  // Exact match first
  const exact = cache.find(f => f.name.toLowerCase() === name.toLowerCase());
  if (exact) return exact;

  // Fuzzy: require 2+ shared words
  const fuzzy = cache
    .map(f => ({ f, score: nameSimilarity(f.name, name) }))
    .filter(x => x.score >= 2)
    .sort((a, b) => b.score - a.score)[0];
  if (fuzzy) return fuzzy.f;

  // Single-word match on last name (if last name is distinctive)
  const lastName = name.split(/\s+/).pop()?.toLowerCase() || "";
  if (lastName.length > 4) {
    const lastNameMatch = cache.find(f => f.name.toLowerCase().endsWith(lastName));
    if (lastNameMatch) return lastNameMatch;
  }

  // Create new fighter
  console.log(`    [NEW FIGHTER] ${name}`);
  if (dryRun) {
    const stub = { id: `dry-${name}`, name };
    cache.push(stub);
    return stub;
  }
  const created = await prisma.fighter.create({
    data: { name, isActive: true },
    select: { id: true, name: true },
  });
  cache.push(created);
  return created;
}

async function cleanup(prisma: PrismaClient, pool: Pool) {
  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
