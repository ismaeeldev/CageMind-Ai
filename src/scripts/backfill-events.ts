import "dotenv/config";
import { prisma } from "../lib/db";
import { UfcEventScraper } from "../scrapers/ufc-event-scraper";
import { FightCardScraper } from "../scrapers/fight-card-scraper";

async function main() {
  console.log("Starting backfill for all events...");

  // 1. We could run the FighterScraper first to seed ufcIds for existing fighters,
  // but it takes a long time (400 pages). 
  // Instead, the FightCardScraper will naturally populate ufcIds for the fighters it encounters.

  // 2. Run the Event Scraper to make sure we have all events
  console.log("Fetching latest events list...");
  const eventScraper = new UfcEventScraper(false);
  const events = await eventScraper.run();
  
  if (events.length === 0) {
    console.log("No events found. Check your scraper or connection.");
  } else {
    console.log(`Event scraper finished. Found ${events.length} events.`);
  }

  // 3. For every event in the DB, run the FightCardScraper
  console.log("Fetching all events from the database to backfill fights...");
  const dbEvents = await prisma.event.findMany({
    orderBy: { date: 'desc' }
  });

  console.log(`Found ${dbEvents.length} events in DB. Processing each one...`);

  for (const event of dbEvents) {
    // We need the UFC event URL to scrape it.
    // UFC.com URLs usually follow /event/name-of-event formatted with dashes.
    // Example: "UFC 305: Du Plessis vs. Adesanya" -> "ufc-305" or "ufc-fight-night-..."
    // Because we don't store the exact URL, we can reconstruct it from the name 
    // or just scrape the ones we can guess.
    // Wait, the scheduler uses `/event/` + slug. Let's create a basic slugifier:
    
    const slug = event.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
      
    // However, UFC event URLs are sometimes just "ufc-300" not "ufc-300-pereira-vs-hill".
    // We will try the full slug first.
    let url = `https://www.ufc.com/event/${slug}`;
    
    // For numbered events like "UFC 305: Du Plessis vs. Adesanya", the url is often just "ufc-305"
    if (event.name.toLowerCase().startsWith("ufc ") && /\d/.test(event.name)) {
      const match = event.name.match(/UFC\s(\d+)/i);
      if (match) {
         url = `https://www.ufc.com/event/ufc-${match[1]}`;
      }
    } else if (event.name.toLowerCase().includes("fight night")) {
       // "UFC Fight Night: Sandhagen vs. Nurmagomedov" -> "ufc-fight-night-august-3-2024" or something similar.
       // Actually, UFC uses "ufc-fight-night-123" or names. 
       // This might fail for some events, but we will try the slug.
    }

    console.log(`\n--- Backfilling fights for: ${event.name} ---`);
    console.log(`Trying URL: ${url}`);
    
    const fightCardScraper = new FightCardScraper(url, event.id, false);
    
    try {
      await fightCardScraper.run();
    } catch (e) {
      console.log(`Failed to scrape ${event.name} at ${url}. It may require a different URL format.`);
    }
    
    // Slight delay to be polite
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\nBackfill complete! You should now run `npm run elo:recalculate` to update rankings with these new fights.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
