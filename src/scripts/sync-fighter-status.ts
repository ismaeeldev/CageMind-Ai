import "dotenv/config";
import * as cheerio from "cheerio";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Build a clean pg-compatible connection string from DATABASE_URL or DIRECT_URL.
// Uses Node's URL class to properly remove unsupported params (channel_binding)
// and adds uselibpqcompat=true so sslmode=require doesn't force cert verification.
function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    // uselibpqcompat makes sslmode=require behave as standard TCP+SSL (no cert verification)
    u.searchParams.set("uselibpqcompat", "true");
    u.searchParams.set("sslmode", "require");
    const result = u.toString();
    console.log(`  Using DB host: ${u.hostname}`);
    return result;
  } catch {
    // If URL parsing fails, return raw string and let pg handle it
    console.log("  Warning: Could not parse DB URL, using raw string");
    return raw;
  }
}

const pool = new Pool({
  connectionString: buildConnectionString(),
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 60000,  // 60s — gives Neon time to wake from cold-start
  idleTimeoutMillis: 120000,
  max: 3,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Ping the DB with retry to ensure Neon is awake before starting the sync
async function ensureDbReady(retries = 7, delayMs = 10000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      console.log("✓ Database connection established.");
      return;
    } catch (err: any) {
      const detail = err?.message || err?.code || JSON.stringify(err) || "(no error detail)";
      console.log(`  DB not ready (attempt ${attempt}/${retries}): ${detail}`);
      if (attempt < retries) {
        console.log(`  Retrying in ${delayMs / 1000}s...`);
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }
  throw new Error("Could not connect to database after multiple attempts.");
}


// Rate-limit helper — pause between UFC.com requests to avoid ECONNRESET
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


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
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        // 404 = page not found on this slug, try next
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // ── PRIMARY CHECK ─────────────────────────────────────────────────────
      // Read the "Status" field from the bio section.
      // HTML structure:
      //   <div class="c-bio__label">Status</div>
      //   <div class="c-bio__text">Active</div>   ← or "Inactive" / "Retired"
      // ─────────────────────────────────────────────────────────────────────
      let statusValue: string | null = null;

      $(".c-bio__field").each((_, field) => {
        const label = $(field).find(".c-bio__label").text().trim().toLowerCase();
        if (label === "status") {
          statusValue = $(field).find(".c-bio__text").text().trim().toLowerCase();
          return false; // break loop
        }
      });

      if (statusValue !== null) {
        const isActive = statusValue === "active";
        console.log(`  → [UFC] "${name}" Status field = "${statusValue}" → ${isActive ? "ACTIVE" : "INACTIVE"}`);
        return isActive;
      }

      // ── FALLBACK CHECK ────────────────────────────────────────────────────
      // No "Status" field found on this profile.
      // Use last fight date: if fighter has not fought in 4+ years → inactive.
      // HTML structure:
      //   <div class="c-card-event--athlete-fight__date">Oct. 31, 2020</div>
      // ─────────────────────────────────────────────────────────────────────
      const lastFightDateText = $(".c-card-event--athlete-fight__date").first().text().trim();

      if (lastFightDateText) {
        const lastFightDate = new Date(lastFightDateText);
        const fourYearsAgo = new Date();
        fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

        if (!isNaN(lastFightDate.getTime())) {
          const isStillActive = lastFightDate >= fourYearsAgo;
          console.log(`  → [UFC] "${name}" no status field, last fight: ${lastFightDateText} → ${isStillActive ? "ACTIVE" : "INACTIVE (4+ yrs ago)"}`);
          return isStillActive;
        }
      }

      // ── HERO-PROFILE TAG FALLBACK ────────────────────────────────────────
      // Some older profiles still use hero-profile__tag with "Retired" text
      // ─────────────────────────────────────────────────────────────────────
      let heroTagActive = false;
      let heroTagRetired = false;

      $(".hero-profile__tag").each((_, el) => {
        const t = $(el).text().trim().toLowerCase();
        if (t === "active") heroTagActive = true;
        if (t === "retired" || t.includes("former athlete")) heroTagRetired = true;
      });

      if (heroTagRetired) {
        console.log(`  → [UFC] "${name}" hero tag = Retired/Former Athlete → INACTIVE`);
        return false;
      }
      if (heroTagActive) {
        console.log(`  → [UFC] "${name}" hero tag = Active → ACTIVE`);
        return true;
      }

      // Profile page exists but we couldn't determine status — default to active (safe)
      console.log(`  → [UFC] "${name}" profile found, no status info, defaulting to ACTIVE`);
      return true;

    } catch (error: any) {
      const errMsg = error?.message || "";
      const errName = error?.name || "";
      const errCode = error?.code || "";

      // Re-throw only real internet-down errors (DNS failure, refused connection)
      if (
        errCode === "ENOTFOUND" ||
        errCode === "ECONNREFUSED" ||
        errMsg.includes("ENOTFOUND") ||
        errMsg.includes("ECONNREFUSED")
      ) {
        throw error;
      }

      // ECONNRESET = UFC.com closed connection (rate limit) — skip slug, try next
      if (errCode === "ECONNRESET" || errMsg.includes("ECONNRESET")) {
        console.log(`  → UFC rate-limited for "${name}", skipping slug…`);
        await sleep(2000); // back off before trying next slug
        continue;
      }

      // Timeout — skip this slug, try next
      if (errName === "TimeoutError" || errCode === "ETIMEDOUT" || errMsg.includes("ETIMEDOUT")) {
        console.log(`  → Timeout on ${url}, trying next slug…`);
        continue;
      }

      // Any other error: skip slug
      console.log(`  → Error for "${name}" at ${url}: ${errMsg}`);
      continue;
    }
  }

  // All slugs returned 404 — fighter is no longer on UFC.com → inactive
  console.log(`  → [UFC] No profile found for "${name}" → INACTIVE`);
  return false;
}

export async function syncFighterStatus() {
  console.log("Starting Fighter Status Synchronization (In-Memory)...");

  // Wake up Neon DB (auto-suspend after 5 min inactivity on free tier)
  await ensureDbReady();
  
  // 1. Fetch all fighters in the DB
  const allFighters = await prisma.fighter.findMany({});
  console.log(`Analyzing ${allFighters.length} fighters in database...`);


  // 2. Fetch all upcoming fights in the DB to check immunity
  const upcomingFights = await prisma.fight.findMany({
    where: { event: { isUpcoming: true } },
    select: { fighter1Id: true, fighter2Id: true }
  });
  const upcomingFighterIds = new Set(upcomingFights.flatMap(f => [f.fighter1Id, f.fighter2Id]));

  let retiredCount = 0;
  let reactivatedCount = 0;

  let skippedCount = 0;

  for (const fighter of allFighters) {
    try {
      const isImmune = upcomingFighterIds.has(fighter.id);

      if (isImmune) {
        if (!fighter.isActive) {
          console.log(`[REACTIVATE] Reactivating ${fighter.name} (has upcoming fight)`);
          await prisma.fighter.update({
            where: { id: fighter.id },
            data: { isActive: true }
          });
          reactivatedCount++;
        }
        continue;
      }

      // Verify active status from UFC website (using name or ufcId)
      const isStillActive = await verifyUfcAthleteActive(fighter.ufcId || "", fighter.name);

      if (fighter.isActive && !isStillActive) {
        console.log(`[RETIRE] Setting ${fighter.name} to inactive (not active on UFC.com)`);
        await prisma.fighter.update({
          where: { id: fighter.id },
          data: { isActive: false }
        });
        retiredCount++;
      } else if (!fighter.isActive && isStillActive) {
        console.log(`[REACTIVATE] Reactivating ${fighter.name} (verified active on UFC.com)`);
        await prisma.fighter.update({
          where: { id: fighter.id },
          data: { isActive: true }
        });
        reactivatedCount++;
      }

      // Small delay between UFC requests to avoid rate-limiting
      await sleep(800);

    } catch (err: any) {
      // If internet is truly down, abort the whole run
      if (err?.code === "ENOTFOUND" || err?.code === "ECONNREFUSED") {
        throw err;
      }
      // Any other error (DB timeout, unexpected, etc.) — log and skip this fighter
      console.log(`[SKIP] Error processing "${fighter.name}": ${err?.message || err} — skipping`);
      skippedCount++;
    }
  }

  console.log(`\n✓ Fighter status synchronization complete.`);
  console.log(`  Retired:     ${retiredCount}`);
  console.log(`  Reactivated: ${reactivatedCount}`);
  console.log(`  Skipped:     ${skippedCount}`);
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
      await pool.end();
    });
}
