/**
 * Updates fighter status (active / inactive / retired) for every fighter.
 * Only the `status` and `isActive` fields are written — nothing else is touched.
 *
 * Decision order (UFC.com page check is ALWAYS first):
 *   1. Fetch UFC.com hero section
 *      a. Hero explicitly says "retired" or "former fighter"
 *         → status = "retired", isActive = false
 *      b. Hero shows a division (fighter still on roster):
 *         → check last-fight date (4-year cutoff)
 *            - Last fight within 4 years → status = "active",   isActive = true
 *            - No fight in 4+ years      → status = "inactive",  isActive = false
 *      c. Page 404 (not on UFC roster)
 *         → status = "inactive", isActive = false
 *   2. If page fetch fails (timeout / network error):
 *      → fallback to 4-year fight history
 *         - Last fight within 4 years → status = "active",   isActive = true
 *         - Otherwise                 → status = "inactive",  isActive = false
 *
 * Usage:
 *   npm run fighters:update-status-dry   (preview — no DB writes)
 *   npm run fighters:update-status       (apply changes)
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as cheerio from "cheerio";

const DRY_RUN = !process.argv.includes("--execute");
const DELAY_MS = 700;
const FOUR_YEARS_AGO = new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000);

type FighterStatus = "active" | "inactive" | "retired";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function nameToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['''""\.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns:
 *   "retired"   — hero section explicitly says retired / former fighter
 *   "active"    — page exists and hero section does NOT say retired
 *   "not-found" — 404 or not a real athlete page
 *   "error"     — timeout / network error
 */
async function checkUfcPage(
  ufcId: string | null,
  name: string
): Promise<"retired" | "active" | "not-found" | "error"> {
  const url = ufcId
    ? (ufcId.startsWith("http") ? ufcId : `https://www.ufc.com${ufcId}`)
    : `https://www.ufc.com/athlete/${nameToSlug(name)}`;

  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return "not-found";

    const html = await res.text();
    const $ = cheerio.load(html);

    // Verify it's a real athlete page (not a redirect to homepage)
    if ($(".hero-profile__name, .hero-profile__division").length === 0) return "not-found";

    // Only check hero/profile header — NOT full body (avoids false positives
    // where active fighter bios mention retired opponents)
    const heroText = $(
      ".hero-profile__division-body, .c-hero--fighter__status, .hero-profile__division, .hero-profile__tag"
    ).text().toLowerCase();

    if (heroText.includes("retired") || heroText.includes("former fighter")) return "retired";

    return "active";
  } catch {
    return "error";
  }
}

function deriveStatus(pageResult: "retired" | "active" | "not-found" | "error", lastFight: Date | null): FighterStatus {
  if (pageResult === "retired") return "retired";
  if (pageResult === "not-found") return "inactive";
  // "active" (on roster) or "error" (couldn't reach page) → fall back to fight history
  const foughtRecently = lastFight !== null && lastFight >= FOUR_YEARS_AGO;
  return foughtRecently ? "active" : "inactive";
}

async function main() {
  console.log(`\n=== Update Fighter Status (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===`);
  console.log(`Only "status" and "isActive" are updated — no other fields touched.\n`);

  const pool = new Pool({
    connectionString: buildConnectionString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 60_000,
    connectionTimeoutMillis: 30_000,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const fighters = await prisma.fighter.findMany({
      select: {
        id: true,
        name: true,
        ufcId: true,
        isActive: true,
        status: true,
        fightsAsFighter1: {
          select: { event: { select: { date: true } } },
          orderBy: { event: { date: "desc" } },
          take: 1,
        },
        fightsAsFighter2: {
          select: { event: { select: { date: true } } },
          orderBy: { event: { date: "desc" } },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    console.log(`Total fighters: ${fighters.length}`);
    console.log(`4-year cutoff: ${FOUR_YEARS_AGO.toISOString().slice(0, 10)}\n`);

    const counts = { active: 0, inactive: 0, retired: 0, alreadyCorrect: 0 };

    for (let i = 0; i < fighters.length; i++) {
      const f = fighters[i];

      // Most recent fight date (from either corner)
      const dates: Date[] = [];
      if (f.fightsAsFighter1[0]) dates.push(new Date(f.fightsAsFighter1[0].event.date));
      if (f.fightsAsFighter2[0]) dates.push(new Date(f.fightsAsFighter2[0].event.date));
      const lastFight = dates.length > 0
        ? new Date(Math.max(...dates.map(d => d.getTime())))
        : null;

      // Always check UFC.com first
      const pageResult = await checkUfcPage(f.ufcId, f.name);
      await sleep(DELAY_MS);

      const newStatus = deriveStatus(pageResult, lastFight);
      const newIsActive = newStatus === "active";

      const reason =
        pageResult === "retired"   ? "UFC.com hero: retired tag" :
        pageResult === "not-found" ? "UFC.com: 404" :
        pageResult === "error"     ? `page error → 4yr fallback (last fight: ${lastFight?.toISOString().slice(0, 10) ?? "none"})` :
                                     `UFC.com: on roster → 4yr check (last fight: ${lastFight?.toISOString().slice(0, 10) ?? "none"})`;

      if (newStatus !== f.status) {
        const arrow = `${f.status ?? "?"} → ${newStatus}`;
        console.log(`  [${newStatus.toUpperCase().padEnd(8)}] ${f.name}  (${arrow}) — ${reason}`);
        if (!DRY_RUN) {
          await prisma.fighter.update({
            where: { id: f.id },
            data: { status: newStatus, isActive: newIsActive },
          });
        }
        counts[newStatus]++;
      } else {
        counts.alreadyCorrect++;
      }

      if ((i + 1) % 100 === 0) {
        console.log(`  ── ${i + 1}/${fighters.length} processed — active:${counts.active} inactive:${counts.inactive} retired:${counts.retired}`);
      }
    }

    console.log(`\n── Results ─────────────────────────────────────`);
    console.log(`  Total fighters   : ${fighters.length}`);
    console.log(`  → active         : ${counts.active}`);
    console.log(`  → inactive       : ${counts.inactive}`);
    console.log(`  → retired        : ${counts.retired}`);
    console.log(`  Already correct  : ${counts.alreadyCorrect}`);
    if (DRY_RUN) console.log(`\nRun with --execute to apply changes.`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });
