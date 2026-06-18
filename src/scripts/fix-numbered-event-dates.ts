/**
 * Corrects dates for UFC numbered events (UFC 100 through UFC 317) where
 * the DB has wrong or placeholder dates.
 *
 * Source of truth: official UFC event history.
 *
 * Usage:
 *   npx tsx src/scripts/fix-numbered-event-dates.ts          dry run
 *   npx tsx src/scripts/fix-numbered-event-dates.ts --execute apply
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

// Official UFC numbered event dates (YYYY-MM-DD)
// Only include events where we know the DB may be wrong
const CORRECT_DATES: Record<string, string> = {
  "UFC 100": "2009-07-11",
  "UFC 101": "2009-08-08",
  "UFC 102": "2009-08-29",
  "UFC 103": "2009-09-19",
  "UFC 104": "2009-10-24",
  "UFC 105": "2009-11-14",
  "UFC 106": "2009-11-21",
  "UFC 107": "2009-12-12",
  "UFC 108": "2010-01-02",
  "UFC 109": "2010-02-06",
  "UFC 110": "2010-02-21",
  "UFC 111": "2010-03-27",
  "UFC 112": "2010-04-10",
  "UFC 113": "2010-05-08",
  "UFC 114": "2010-05-29",
  "UFC 115": "2010-06-12",
  "UFC 116": "2010-07-03",
  "UFC 117": "2010-08-07",
  "UFC 118": "2010-08-28",
  "UFC 119": "2010-09-25",
  "UFC 120": "2010-10-16",
  "UFC 121": "2010-10-23",
  "UFC 122": "2010-11-13",
  "UFC 123": "2010-11-20",
  "UFC 124": "2010-12-11",
  "UFC 125": "2011-01-01",
  "UFC 126": "2011-02-05",
  "UFC 127": "2011-02-27",
  "UFC 128": "2011-03-19",
  "UFC 129": "2011-04-30",
  "UFC 130": "2011-05-28",
  "UFC 131": "2011-06-11",
  "UFC 132": "2011-07-02",
  "UFC 133": "2011-08-06",
  "UFC 134": "2011-08-27",
  "UFC 135": "2011-09-24",
  "UFC 136": "2011-10-08",
  "UFC 137": "2011-10-29",
  "UFC 138": "2011-11-05",
  "UFC 139": "2011-11-19",
  "UFC 140": "2011-12-10",
  "UFC 141": "2012-01-01",
  "UFC 142": "2012-01-14",
  "UFC 143": "2012-02-04",
  "UFC 144": "2012-02-26",
  "UFC 145": "2012-04-21",
  "UFC 146": "2012-05-26",
  "UFC 147": "2012-06-23",
  "UFC 148": "2012-07-07",
  "UFC 149": "2012-07-21",
  "UFC 150": "2012-08-11",
  "UFC 152": "2012-09-22",
  "UFC 153": "2012-10-13",
  "UFC 154": "2012-11-17",
  "UFC 155": "2012-12-29",
  "UFC 156": "2013-02-02",
  "UFC 157": "2013-02-23",
  "UFC 158": "2013-03-16",
  "UFC 159": "2013-04-27",
  "UFC 160": "2013-05-25",
  "UFC 161": "2013-06-15",
  "UFC 162": "2013-07-06",
  "UFC 163": "2013-08-03",
  "UFC 164": "2013-08-31",
  "UFC 165": "2013-09-21",
  "UFC 166": "2013-10-19",
  "UFC 167": "2013-11-16",
  "UFC 168": "2013-12-28",
  "UFC 169": "2014-02-01",
  "UFC 170": "2014-02-22",
  "UFC 171": "2014-03-15",
  "UFC 172": "2014-04-26",
  "UFC 173": "2014-05-24",
  "UFC 174": "2014-06-14",
  "UFC 175": "2014-07-05",
  "UFC 177": "2014-08-30",
  "UFC 178": "2014-09-27",
  "UFC 179": "2014-10-25",
  "UFC 180": "2014-11-15",
  "UFC 181": "2014-12-06",
  "UFC 182": "2015-01-03",
  "UFC 183": "2015-01-31",
  "UFC 184": "2015-02-28",
  "UFC 185": "2015-03-14",
  "UFC 186": "2015-04-25",
  "UFC 187": "2015-05-23",
  "UFC 188": "2015-06-13",
  "UFC 189": "2015-07-11",
  "UFC 190": "2015-08-01",
  "UFC 191": "2015-09-05",
  "UFC 192": "2015-10-03",
  "UFC 193": "2015-11-15",
  "UFC 194": "2015-12-12",
  "UFC 195": "2016-01-02",
  "UFC 196": "2016-03-05",
  "UFC 197": "2016-04-23",
  "UFC 198": "2016-05-14",
  "UFC 199": "2016-06-04",
  "UFC 200": "2016-07-09",
  "UFC 201": "2016-07-30",
  "UFC 202": "2016-08-20",
  "UFC 203": "2016-09-10",
  "UFC 204": "2016-10-08",
  "UFC 205": "2016-11-12",
  "UFC 206": "2016-12-10",
  "UFC 207": "2016-12-30",
  "UFC 208": "2017-02-11",
  "UFC 209": "2017-03-04",
  "UFC 210": "2017-04-08",
  "UFC 211": "2017-05-13",
  "UFC 212": "2017-06-03",
  "UFC 213": "2017-07-08",
  "UFC 214": "2017-07-29",
  "UFC 215": "2017-09-09",
  "UFC 216": "2017-10-07",
  "UFC 217": "2017-11-04",
  "UFC 218": "2017-12-02",
  "UFC 219": "2017-12-30",
  "UFC 220": "2018-01-20",
  "UFC 221": "2018-02-11",
  "UFC 222": "2018-03-03",
  "UFC 223": "2018-04-07",
  "UFC 224": "2018-05-12",
  "UFC 225": "2018-06-09",
  "UFC 226": "2018-07-07",
  "UFC 227": "2018-08-04",
  "UFC 228": "2018-09-08",
  "UFC 229": "2018-10-06",
  "UFC 230": "2018-11-03",
  "UFC 231": "2018-12-08",
  "UFC 232": "2018-12-29",
  "UFC 233": "2019-01-26", // was cancelled
  "UFC 234": "2019-02-10",
  "UFC 235": "2019-03-02",
  "UFC 236": "2019-04-13",
  "UFC 237": "2019-05-11",
  "UFC 238": "2019-06-08",
  "UFC 239": "2019-07-06",
  "UFC 240": "2019-07-27",
  "UFC 241": "2019-08-17",
  "UFC 242": "2019-09-07",
  "UFC 243": "2019-10-05",
  "UFC 244": "2019-11-02",
  "UFC 245": "2019-12-14",
  "UFC 246": "2020-01-18",
  "UFC 247": "2020-02-08",
  "UFC 248": "2020-03-07",
  "UFC 249": "2020-05-09",
  "UFC 250": "2020-06-06",
  "UFC 251": "2020-07-11",
  "UFC 252": "2020-08-15",
  "UFC 253": "2020-09-26",
  "UFC 254": "2020-10-24",
  "UFC 255": "2020-11-21",
  "UFC 256": "2020-12-12",
  "UFC 257": "2021-01-23",
  "UFC 258": "2021-02-13",
  "UFC 259": "2021-03-06",
  "UFC 260": "2021-03-27",
  "UFC 261": "2021-04-24",
  "UFC 262": "2021-05-15",
  "UFC 263": "2021-06-12",
  "UFC 264": "2021-07-10",
  "UFC 265": "2021-08-07",
  "UFC 266": "2021-09-25",
  "UFC 267": "2021-10-30",
  "UFC 268": "2021-11-06",
  "UFC 269": "2021-12-11",
  "UFC 270": "2022-01-22",
  "UFC 271": "2022-02-12",
  "UFC 272": "2022-03-05",
  "UFC 273": "2022-04-09",
  "UFC 274": "2022-05-07",
  "UFC 275": "2022-06-11",
  "UFC 276": "2022-07-02",
  "UFC 277": "2022-07-30",
  "UFC 278": "2022-08-20",
  "UFC 279": "2022-09-10",
  "UFC 280": "2022-10-22",
  "UFC 281": "2022-11-12",
  "UFC 282": "2022-12-10",
  "UFC 283": "2023-01-21",
  "UFC 284": "2023-02-12",
  "UFC 285": "2023-03-04",
  "UFC 286": "2023-03-18",
  "UFC 287": "2023-04-08",
  "UFC 288": "2023-05-06",
  "UFC 289": "2023-06-10",
  "UFC 290": "2023-07-08",
  "UFC 291": "2023-07-29",
  "UFC 292": "2023-08-19",
  "UFC 293": "2023-09-09",
  "UFC 294": "2023-10-21",
  "UFC 295": "2023-11-11",
  "UFC 296": "2023-12-16",
  "UFC 297": "2024-01-20",
  "UFC 298": "2024-02-17",
  "UFC 299": "2024-03-09",
  "UFC 300": "2024-04-13",
  "UFC 301": "2024-05-04",
  "UFC 302": "2024-06-01",
  "UFC 303": "2024-06-29",
  "UFC 304": "2024-07-27",
  "UFC 305": "2024-08-17",
  "UFC 306": "2024-09-14",
  "UFC 307": "2024-10-05",
  "UFC 308": "2024-10-26",
  "UFC 309": "2024-11-16",
  "UFC 310": "2024-12-07",
  "UFC 311": "2025-01-18",
  "UFC 312": "2025-02-08",
  "UFC 313": "2025-03-08",
  "UFC 314": "2025-04-12",
  "UFC 315": "2025-05-10",
  "UFC 316": "2025-06-07",
  "UFC 317": "2025-07-05",
  "UFC 318": "2025-08-16",
  "UFC 319": "2025-09-27",
  "UFC 320": "2025-11-08",
  // Special named events
  "UFC Freedom 250": "2026-06-14",
};

function extractEventNumber(name: string): string | null {
  const m = name.match(/^UFC\s+(\d+)/i);
  return m ? `UFC ${m[1]}` : null;
}

function extractSpecialName(name: string): string | null {
  for (const key of Object.keys(CORRECT_DATES)) {
    if (!key.match(/^UFC \d+$/) && name.toLowerCase().includes(key.toLowerCase())) {
      return key;
    }
  }
  return null;
}

async function main() {
  console.log(`\n=== Fix Numbered Event Dates (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: "UFC " } },
        ],
      },
      select: { id: true, name: true, date: true },
    });

    let fixed = 0;
    let alreadyCorrect = 0;
    let noEntry = 0;

    for (const event of events) {
      const key = extractEventNumber(event.name) ?? extractSpecialName(event.name);
      if (!key) { noEntry++; continue; }
      const correctDateStr = CORRECT_DATES[key];
      if (!correctDateStr) { noEntry++; continue; }

      const correctDate = new Date(correctDateStr + "T00:00:00Z");
      const currentDate = new Date(event.date);
      const currentStr = currentDate.toISOString().split("T")[0];

      if (currentStr === correctDateStr) { alreadyCorrect++; continue; }

      console.log(`  ${DRY_RUN ? "[WOULD FIX]" : "[FIXED]"} ${event.name}`);
      console.log(`    ${currentStr} → ${correctDateStr}`);

      if (!DRY_RUN) {
        try {
          await prisma.event.update({
            where: { id: event.id },
            data: {
              date: correctDate,
              isUpcoming: correctDate > new Date() ? undefined : false,
            },
          });
        } catch {
          console.log(`    Skipped (event deleted or unavailable)`);
          continue;
        }
      }
      fixed++;
    }

    console.log(`\n── Summary ──────────────────────────────────`);
    console.log(`  Fixed (or would fix): ${fixed}`);
    console.log(`  Already correct     : ${alreadyCorrect}`);
    console.log(`  No reference date   : ${noEntry}`);
    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to apply.`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
