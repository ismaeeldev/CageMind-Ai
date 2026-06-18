/**
 * Re-creates blank event records for all UFC numbered PPV events
 * that were accidentally deleted by cleanup-garbage-events.ts.
 *
 * Events are created with correct dates (isUpcoming=false for past events).
 * The on-demand fight card API will re-scrape fight cards when users visit
 * each event page. After all cards are populated, run:
 *   npm run predictions:backfill
 *   npm run elo:recalculate
 */

import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const DRY_RUN = !process.argv.includes("--execute");
const NOW = new Date();

function buildConnectionString(): string {
  const raw = (process.env.DIRECT_URL || process.env.DATABASE_URL)!;
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    u.searchParams.set("sslmode", "require");
    return u.toString();
  } catch { return raw; }
}

const UFC_EVENTS: { name: string; date: string; location?: string }[] = [
  { name: "UFC 100", date: "2009-07-11", location: "Las Vegas, NV" },
  { name: "UFC 101", date: "2009-08-08", location: "Philadelphia, PA" },
  { name: "UFC 102", date: "2009-08-29", location: "Portland, OR" },
  { name: "UFC 103", date: "2009-09-19", location: "Dallas, TX" },
  { name: "UFC 104", date: "2009-10-24", location: "Los Angeles, CA" },
  { name: "UFC 105", date: "2009-11-14", location: "Manchester, UK" },
  { name: "UFC 106", date: "2009-11-21", location: "Las Vegas, NV" },
  { name: "UFC 107", date: "2009-12-12", location: "Memphis, TN" },
  { name: "UFC 108", date: "2010-01-02", location: "Las Vegas, NV" },
  { name: "UFC 109", date: "2010-02-06", location: "Las Vegas, NV" },
  { name: "UFC 110", date: "2010-02-21", location: "Sydney, Australia" },
  { name: "UFC 111", date: "2010-03-27", location: "Newark, NJ" },
  { name: "UFC 112", date: "2010-04-10", location: "Abu Dhabi, UAE" },
  { name: "UFC 113", date: "2010-05-08", location: "Montreal, QC" },
  { name: "UFC 114", date: "2010-05-29", location: "Las Vegas, NV" },
  { name: "UFC 115", date: "2010-06-12", location: "Vancouver, BC" },
  { name: "UFC 116", date: "2010-07-03", location: "Las Vegas, NV" },
  { name: "UFC 117", date: "2010-08-07", location: "Oakland, CA" },
  { name: "UFC 118", date: "2010-08-28", location: "Boston, MA" },
  { name: "UFC 119", date: "2010-09-25", location: "Indianapolis, IN" },
  { name: "UFC 120", date: "2010-10-16", location: "London, UK" },
  { name: "UFC 121", date: "2010-10-23", location: "Anaheim, CA" },
  { name: "UFC 122", date: "2010-11-13", location: "Oberhausen, Germany" },
  { name: "UFC 123", date: "2010-11-20", location: "Auburn Hills, MI" },
  { name: "UFC 124", date: "2010-12-11", location: "Montreal, QC" },
  { name: "UFC 125", date: "2011-01-01", location: "Las Vegas, NV" },
  { name: "UFC 126", date: "2011-02-05", location: "Las Vegas, NV" },
  { name: "UFC 127", date: "2011-02-27", location: "Sydney, Australia" },
  { name: "UFC 128", date: "2011-03-19", location: "Newark, NJ" },
  { name: "UFC 129", date: "2011-04-30", location: "Vancouver, BC" },
  { name: "UFC 130", date: "2011-05-28", location: "Las Vegas, NV" },
  { name: "UFC 131", date: "2011-06-11", location: "Vancouver, BC" },
  { name: "UFC 132", date: "2011-07-02", location: "Las Vegas, NV" },
  { name: "UFC 133", date: "2011-08-06", location: "Philadelphia, PA" },
  { name: "UFC 134", date: "2011-08-27", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 135", date: "2011-09-24", location: "Denver, CO" },
  { name: "UFC 136", date: "2011-10-08", location: "Houston, TX" },
  { name: "UFC 137", date: "2011-10-29", location: "Las Vegas, NV" },
  { name: "UFC 138", date: "2011-11-05", location: "Birmingham, UK" },
  { name: "UFC 139", date: "2011-11-19", location: "San Jose, CA" },
  { name: "UFC 140", date: "2011-12-10", location: "Toronto, ON" },
  { name: "UFC 141", date: "2012-01-01", location: "Las Vegas, NV" },
  { name: "UFC 142", date: "2012-01-14", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 143", date: "2012-02-04", location: "Las Vegas, NV" },
  { name: "UFC 144", date: "2012-02-26", location: "Saitama, Japan" },
  { name: "UFC 145", date: "2012-04-21", location: "Atlanta, GA" },
  { name: "UFC 146", date: "2012-05-26", location: "Las Vegas, NV" },
  { name: "UFC 147", date: "2012-06-23", location: "Belo Horizonte, Brazil" },
  { name: "UFC 148", date: "2012-07-07", location: "Las Vegas, NV" },
  { name: "UFC 149", date: "2012-07-21", location: "Calgary, AB" },
  { name: "UFC 150", date: "2012-08-11", location: "Denver, CO" },
  { name: "UFC 152", date: "2012-09-22", location: "Toronto, ON" },
  { name: "UFC 153", date: "2012-10-13", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 154", date: "2012-11-17", location: "Montreal, QC" },
  { name: "UFC 155", date: "2012-12-29", location: "Las Vegas, NV" },
  { name: "UFC 156", date: "2013-02-02", location: "Las Vegas, NV" },
  { name: "UFC 157", date: "2013-02-23", location: "Anaheim, CA" },
  { name: "UFC 158", date: "2013-03-16", location: "Montreal, QC" },
  { name: "UFC 159", date: "2013-04-27", location: "Newark, NJ" },
  { name: "UFC 160", date: "2013-05-25", location: "Las Vegas, NV" },
  { name: "UFC 161", date: "2013-06-15", location: "Winnipeg, MB" },
  { name: "UFC 162", date: "2013-07-06", location: "Las Vegas, NV" },
  { name: "UFC 163", date: "2013-08-03", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 164", date: "2013-08-31", location: "Milwaukee, WI" },
  { name: "UFC 165", date: "2013-09-21", location: "Toronto, ON" },
  { name: "UFC 166", date: "2013-10-19", location: "Houston, TX" },
  { name: "UFC 167", date: "2013-11-16", location: "Las Vegas, NV" },
  { name: "UFC 168", date: "2013-12-28", location: "Las Vegas, NV" },
  { name: "UFC 169", date: "2014-02-01", location: "Newark, NJ" },
  { name: "UFC 170", date: "2014-02-22", location: "Las Vegas, NV" },
  { name: "UFC 171", date: "2014-03-15", location: "Dallas, TX" },
  { name: "UFC 172", date: "2014-04-26", location: "Baltimore, MD" },
  { name: "UFC 173", date: "2014-05-24", location: "Las Vegas, NV" },
  { name: "UFC 174", date: "2014-06-14", location: "Vancouver, BC" },
  { name: "UFC 175", date: "2014-07-05", location: "Las Vegas, NV" },
  { name: "UFC 177", date: "2014-08-30", location: "Sacramento, CA" },
  { name: "UFC 178", date: "2014-09-27", location: "Las Vegas, NV" },
  { name: "UFC 179", date: "2014-10-25", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 180", date: "2014-11-15", location: "Mexico City, Mexico" },
  { name: "UFC 181", date: "2014-12-06", location: "Las Vegas, NV" },
  { name: "UFC 182", date: "2015-01-03", location: "Las Vegas, NV" },
  { name: "UFC 183", date: "2015-01-31", location: "Las Vegas, NV" },
  { name: "UFC 184", date: "2015-02-28", location: "Los Angeles, CA" },
  { name: "UFC 185", date: "2015-03-14", location: "Dallas, TX" },
  { name: "UFC 186", date: "2015-04-25", location: "Montreal, QC" },
  { name: "UFC 187", date: "2015-05-23", location: "Las Vegas, NV" },
  { name: "UFC 188", date: "2015-06-13", location: "Mexico City, Mexico" },
  { name: "UFC 189", date: "2015-07-11", location: "Las Vegas, NV" },
  { name: "UFC 190", date: "2015-08-01", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 191", date: "2015-09-05", location: "Las Vegas, NV" },
  { name: "UFC 192", date: "2015-10-03", location: "Houston, TX" },
  { name: "UFC 193", date: "2015-11-15", location: "Melbourne, Australia" },
  { name: "UFC 194", date: "2015-12-12", location: "Las Vegas, NV" },
  { name: "UFC 195", date: "2016-01-02", location: "Las Vegas, NV" },
  { name: "UFC 196", date: "2016-03-05", location: "Las Vegas, NV" },
  { name: "UFC 197", date: "2016-04-23", location: "Las Vegas, NV" },
  { name: "UFC 198", date: "2016-05-14", location: "Curitiba, Brazil" },
  { name: "UFC 199", date: "2016-06-04", location: "Inglewood, CA" },
  { name: "UFC 200", date: "2016-07-09", location: "Las Vegas, NV" },
  { name: "UFC 201", date: "2016-07-30", location: "Atlanta, GA" },
  { name: "UFC 202", date: "2016-08-20", location: "Las Vegas, NV" },
  { name: "UFC 203", date: "2016-09-10", location: "Cleveland, OH" },
  { name: "UFC 204", date: "2016-10-08", location: "Manchester, UK" },
  { name: "UFC 205", date: "2016-11-12", location: "New York, NY" },
  { name: "UFC 206", date: "2016-12-10", location: "Toronto, ON" },
  { name: "UFC 207", date: "2016-12-30", location: "Las Vegas, NV" },
  { name: "UFC 208", date: "2017-02-11", location: "Brooklyn, NY" },
  { name: "UFC 209", date: "2017-03-04", location: "Las Vegas, NV" },
  { name: "UFC 210", date: "2017-04-08", location: "Buffalo, NY" },
  { name: "UFC 211", date: "2017-05-13", location: "Dallas, TX" },
  { name: "UFC 212", date: "2017-06-03", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 213", date: "2017-07-08", location: "Las Vegas, NV" },
  { name: "UFC 214", date: "2017-07-29", location: "Anaheim, CA" },
  { name: "UFC 215", date: "2017-09-09", location: "Edmonton, AB" },
  { name: "UFC 216", date: "2017-10-07", location: "Las Vegas, NV" },
  { name: "UFC 217", date: "2017-11-04", location: "New York, NY" },
  { name: "UFC 218", date: "2017-12-02", location: "Detroit, MI" },
  { name: "UFC 219", date: "2017-12-30", location: "Las Vegas, NV" },
  { name: "UFC 220", date: "2018-01-20", location: "Boston, MA" },
  { name: "UFC 221", date: "2018-02-11", location: "Perth, Australia" },
  { name: "UFC 222", date: "2018-03-03", location: "Las Vegas, NV" },
  { name: "UFC 223", date: "2018-04-07", location: "Brooklyn, NY" },
  { name: "UFC 224", date: "2018-05-12", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 225", date: "2018-06-09", location: "Chicago, IL" },
  { name: "UFC 226", date: "2018-07-07", location: "Las Vegas, NV" },
  { name: "UFC 227", date: "2018-08-04", location: "Los Angeles, CA" },
  { name: "UFC 228", date: "2018-09-08", location: "Dallas, TX" },
  { name: "UFC 229", date: "2018-10-06", location: "Las Vegas, NV" },
  { name: "UFC 230", date: "2018-11-03", location: "New York, NY" },
  { name: "UFC 231", date: "2018-12-08", location: "Toronto, ON" },
  { name: "UFC 232", date: "2018-12-29", location: "Inglewood, CA" },
  { name: "UFC 234", date: "2019-02-10", location: "Melbourne, Australia" },
  { name: "UFC 235", date: "2019-03-02", location: "Las Vegas, NV" },
  { name: "UFC 236", date: "2019-04-13", location: "Atlanta, GA" },
  { name: "UFC 237", date: "2019-05-11", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 238", date: "2019-06-08", location: "Chicago, IL" },
  { name: "UFC 239", date: "2019-07-06", location: "Las Vegas, NV" },
  { name: "UFC 240", date: "2019-07-27", location: "Edmonton, AB" },
  { name: "UFC 241", date: "2019-08-17", location: "Anaheim, CA" },
  { name: "UFC 242", date: "2019-09-07", location: "Abu Dhabi, UAE" },
  { name: "UFC 243", date: "2019-10-05", location: "Melbourne, Australia" },
  { name: "UFC 244", date: "2019-11-02", location: "New York, NY" },
  { name: "UFC 245", date: "2019-12-14", location: "Las Vegas, NV" },
  { name: "UFC 246", date: "2020-01-18", location: "Las Vegas, NV" },
  { name: "UFC 247", date: "2020-02-08", location: "Houston, TX" },
  { name: "UFC 248", date: "2020-03-07", location: "Las Vegas, NV" },
  { name: "UFC 249", date: "2020-05-09", location: "Jacksonville, FL" },
  { name: "UFC 250", date: "2020-06-06", location: "Las Vegas, NV" },
  { name: "UFC 251", date: "2020-07-11", location: "Abu Dhabi, UAE" },
  { name: "UFC 252", date: "2020-08-15", location: "Las Vegas, NV" },
  { name: "UFC 253", date: "2020-09-26", location: "Abu Dhabi, UAE" },
  { name: "UFC 254", date: "2020-10-24", location: "Abu Dhabi, UAE" },
  { name: "UFC 255", date: "2020-11-21", location: "Las Vegas, NV" },
  { name: "UFC 256", date: "2020-12-12", location: "Las Vegas, NV" },
  { name: "UFC 257", date: "2021-01-23", location: "Abu Dhabi, UAE" },
  { name: "UFC 258", date: "2021-02-13", location: "Las Vegas, NV" },
  { name: "UFC 259", date: "2021-03-06", location: "Las Vegas, NV" },
  { name: "UFC 260", date: "2021-03-27", location: "Las Vegas, NV" },
  { name: "UFC 261", date: "2021-04-24", location: "Jacksonville, FL" },
  { name: "UFC 262", date: "2021-05-15", location: "Houston, TX" },
  { name: "UFC 263", date: "2021-06-12", location: "Glendale, AZ" },
  { name: "UFC 264", date: "2021-07-10", location: "Las Vegas, NV" },
  { name: "UFC 265", date: "2021-08-07", location: "Houston, TX" },
  { name: "UFC 266", date: "2021-09-25", location: "Las Vegas, NV" },
  { name: "UFC 267", date: "2021-10-30", location: "Abu Dhabi, UAE" },
  { name: "UFC 268", date: "2021-11-06", location: "New York, NY" },
  { name: "UFC 269", date: "2021-12-11", location: "Las Vegas, NV" },
  { name: "UFC 270", date: "2022-01-22", location: "Anaheim, CA" },
  { name: "UFC 271", date: "2022-02-12", location: "Houston, TX" },
  { name: "UFC 272", date: "2022-03-05", location: "Las Vegas, NV" },
  { name: "UFC 273", date: "2022-04-09", location: "Jacksonville, FL" },
  { name: "UFC 274", date: "2022-05-07", location: "Phoenix, AZ" },
  { name: "UFC 275", date: "2022-06-11", location: "Singapore" },
  { name: "UFC 276", date: "2022-07-02", location: "Las Vegas, NV" },
  { name: "UFC 277", date: "2022-07-30", location: "Dallas, TX" },
  { name: "UFC 278", date: "2022-08-20", location: "Salt Lake City, UT" },
  { name: "UFC 279", date: "2022-09-10", location: "Las Vegas, NV" },
  { name: "UFC 280", date: "2022-10-22", location: "Abu Dhabi, UAE" },
  { name: "UFC 281", date: "2022-11-12", location: "New York, NY" },
  { name: "UFC 282", date: "2022-12-10", location: "Las Vegas, NV" },
  { name: "UFC 283", date: "2023-01-21", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 284", date: "2023-02-12", location: "Perth, Australia" },
  { name: "UFC 285", date: "2023-03-04", location: "Las Vegas, NV" },
  { name: "UFC 286", date: "2023-03-18", location: "London, UK" },
  { name: "UFC 287", date: "2023-04-08", location: "Miami, FL" },
  { name: "UFC 288", date: "2023-05-06", location: "Newark, NJ" },
  { name: "UFC 289", date: "2023-06-10", location: "Vancouver, BC" },
  { name: "UFC 290", date: "2023-07-08", location: "Las Vegas, NV" },
  { name: "UFC 291", date: "2023-07-29", location: "Salt Lake City, UT" },
  { name: "UFC 292", date: "2023-08-19", location: "Boston, MA" },
  { name: "UFC 293", date: "2023-09-09", location: "Sydney, Australia" },
  { name: "UFC 294", date: "2023-10-21", location: "Abu Dhabi, UAE" },
  { name: "UFC 295", date: "2023-11-11", location: "New York, NY" },
  { name: "UFC 296", date: "2023-12-16", location: "Las Vegas, NV" },
  { name: "UFC 297", date: "2024-01-20", location: "Toronto, ON" },
  { name: "UFC 298", date: "2024-02-17", location: "Anaheim, CA" },
  { name: "UFC 299", date: "2024-03-09", location: "Miami, FL" },
  { name: "UFC 300", date: "2024-04-13", location: "Las Vegas, NV" },
  { name: "UFC 301", date: "2024-05-04", location: "Rio de Janeiro, Brazil" },
  { name: "UFC 302", date: "2024-06-01", location: "Newark, NJ" },
  { name: "UFC 303", date: "2024-06-29", location: "Las Vegas, NV" },
  { name: "UFC 304", date: "2024-07-27", location: "Manchester, UK" },
  { name: "UFC 305", date: "2024-08-17", location: "Perth, Australia" },
  { name: "UFC 306", date: "2024-09-14", location: "Las Vegas, NV" },
  { name: "UFC 307", date: "2024-10-05", location: "Salt Lake City, UT" },
  { name: "UFC 308", date: "2024-10-26", location: "Abu Dhabi, UAE" },
  { name: "UFC 309", date: "2024-11-16", location: "New York, NY" },
  { name: "UFC 310", date: "2024-12-07", location: "Las Vegas, NV" },
  { name: "UFC 311", date: "2025-01-18", location: "Inglewood, CA" },
  { name: "UFC 312", date: "2025-02-08", location: "Sydney, Australia" },
  { name: "UFC 313", date: "2025-03-08", location: "Las Vegas, NV" },
  { name: "UFC 314", date: "2025-04-12", location: "Miami, FL" },
  { name: "UFC 315", date: "2025-05-10", location: "Montreal, QC" },
  { name: "UFC 316", date: "2025-06-07", location: "Las Vegas, NV" },
  { name: "UFC 317", date: "2025-07-05", location: "Las Vegas, NV" },
  { name: "UFC 318", date: "2025-08-16", location: "Las Vegas, NV" },
  { name: "UFC 319", date: "2025-09-27", location: "Las Vegas, NV" },
  { name: "UFC 320", date: "2025-11-08", location: "Las Vegas, NV" },
];

async function main() {
  console.log(`\n=== Restore UFC PPV Events (${DRY_RUN ? "DRY RUN" : "EXECUTE"}) ===\n`);

  const pool = new Pool({ connectionString: buildConnectionString(), ssl: { rejectUnauthorized: false } });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    // Load existing events to avoid duplicates
    const existing = await prisma.event.findMany({
      where: { name: { contains: "UFC" } },
      select: { name: true },
    });
    const existingNames = new Set(existing.map(e => e.name.toLowerCase().trim()));

    const toCreate = UFC_EVENTS.filter(e =>
      !existingNames.has(e.name.toLowerCase())
    );

    console.log(`Events in reference list: ${UFC_EVENTS.length}`);
    console.log(`Already in DB:            ${UFC_EVENTS.length - toCreate.length}`);
    console.log(`Need to create:           ${toCreate.length}\n`);

    if (toCreate.length === 0) {
      console.log("All events already exist.");
      return;
    }

    toCreate.slice(0, 10).forEach(e => console.log(`  ${e.date} | ${e.name}`));
    if (toCreate.length > 10) console.log(`  ... and ${toCreate.length - 10} more`);

    if (DRY_RUN) {
      console.log(`\nDry run — run with --execute to create these ${toCreate.length} events.`);
      return;
    }

    let created = 0;
    for (const evt of toCreate) {
      const d = new Date(evt.date + "T00:00:00Z");
      await prisma.event.create({
        data: {
          name: evt.name,
          date: d,
          location: evt.location ?? null,
          isUpcoming: d > NOW,
          isProcessed: false,
        },
      });
      created++;
    }

    console.log(`\nCreated ${created} event records.`);
    console.log("Fight cards will be scraped on-demand when users visit each event page.");
    console.log("After all cards are populated, run:");
    console.log("  npm run predictions:backfill");
    console.log("  npm run elo:recalculate");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
