import "dotenv/config";
import { Pool } from "pg";

function buildConn(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  const u = new URL(raw);
  u.searchParams.delete("channel_binding");
  u.searchParams.set("sslmode", "require");
  return u.toString();
}

async function main() {
  const pool = new Pool({ connectionString: buildConn(), ssl: { rejectUnauthorized: false } });

  // ISSUE 1: Fighter records + photos
  console.log("\n=== ISSUE 1: FIGHTER RECORDS + PHOTOS ===");
  const names = ["Jon Jones", "Islam Makhachev", "Ilia Topuria", "Max Holloway"];
  for (const n of names) {
    const { rows } = await pool.query(
      'SELECT name,wins,losses,draws,"imageUrl","weightClass" FROM "Fighter" WHERE name=$1', [n]
    );
    if (rows[0]) {
      const r = rows[0];
      const img = r.imageUrl && r.imageUrl.startsWith("http") ? "HAS IMAGE" : "NO IMAGE";
      const dirty = r.weightClass && r.weightClass.includes("\n") ? "DIRTY" : "CLEAN";
      console.log(`  ${r.name}: ${r.wins}-${r.losses}-${r.draws} | weightClass:"${r.weightClass}"(${dirty}) | ${img}`);
    } else {
      console.log(`  NOT FOUND: ${n}`);
    }
  }

  // WeightClass cleanup check
  const { rows: wcDirty } = await pool.query(
    `SELECT COUNT(*) as cnt FROM "Fighter" WHERE "weightClass" LIKE $1`, ["%\n%"]
  );
  console.log(`\n  Dirty weightClass remaining: ${wcDirty[0].cnt}`);

  // ISSUE 3: Odds + predictions
  console.log("\n=== ISSUE 3: PERFORMANCE TAB DATA ===");
  const { rows: oddsRows } = await pool.query(
    `SELECT COUNT(*) as total, COUNT("oddsFighter1") as with_odds FROM "Fight"`
  );
  console.log(`  Total fights: ${oddsRows[0].total} | With odds: ${oddsRows[0].with_odds}`);
  const { rows: predRows } = await pool.query(`SELECT COUNT(*) as total FROM "PredictionHistory"`);
  console.log(`  Total predictions (PredictionHistory): ${predRows[0].total}`);

  // ISSUE 4: 2026 events
  console.log("\n=== ISSUE 4: 2026 EVENTS ===");
  const { rows: eventRows } = await pool.query(`
    SELECT e.name, e.date::date AS edate, e."isUpcoming", COUNT(f.id) as fights
    FROM "Event" e
    LEFT JOIN "Fight" f ON f."eventId"=e.id
    WHERE EXTRACT(YEAR FROM e.date)=2026
    GROUP BY e.id, e.name, e.date, e."isUpcoming"
    ORDER BY e.date
  `);
  for (const r of eventRows) {
    const tag = r.isUpcoming ? "[UPCOMING]" : "[PAST]   ";
    console.log(`  ${tag} ${r.name} | ${r.edate} | fights: ${r.fights}`);
  }

  // ISSUE 2: Show what slug candidates would be for key upcoming events
  console.log("\n=== ISSUE 2: SLUG CANDIDATES FOR UPCOMING EVENTS ===");
  const { rows: upcomingRows } = await pool.query(`
    SELECT name, date FROM "Event" WHERE "isUpcoming"=true ORDER BY date LIMIT 5
  `);
  for (const e of upcomingRows) {
    const d = new Date(e.date);
    const month = d.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const dateslug = `ufc-fight-night-${month}-${day}-${year}`;
    console.log(`  "${e.name}" → tries: ${dateslug}`);
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
