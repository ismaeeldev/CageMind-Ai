import 'dotenv/config';
import { TapologyScraper } from '../scrapers/tapology-scraper';
import { prisma } from '../lib/db';

async function testTapologyScraper() {
  console.log("=== Testing Tapology Scraper Refactoring ===");

  // 1. Create a mock event for scraping
  const eventName = "UFC 300";
  console.log(`Creating mock event: ${eventName}...`);

  let event = await prisma.event.findFirst({
    where: { name: eventName }
  });

  if (!event) {
    event = await prisma.event.create({
      data: {
        name: eventName,
        date: new Date("2026-04-13T22:00:00.000Z"),
        isUpcoming: false,
        isProcessed: false,
        location: "Las Vegas, NV"
      }
    });
  }

  // 2. Instantiate and run scraper
  console.log(`Running TapologyScraper on event: "${eventName}" (ID: ${event.id})...`);
  const scraper = new TapologyScraper(event.id, event.name, true);
  const success = await scraper.scrapeAndSave();

  if (success) {
    console.log("✓ Scraper completed successfully.");
  } else {
    console.error("X Scraper execution failed.");
    process.exit(1);
  }

  // 3. Assertions
  const fights = await prisma.fight.findMany({
    where: { eventId: event.id },
    include: { fighter1: true, fighter2: true }
  });

  console.log(`\nFound ${fights.length} fights in database for UFC 300.`);
  
  if (fights.length > 5) {
    console.log("✓ Success: Found main card and prelim card fights.");
  } else {
    console.error("X Failure: Roster count is too low, got:", fights.length);
    process.exit(1);
  }

  // Let's verify that Alex Pereira vs Jamahal Hill (main event) is 5 rounds
  const mainEvent = fights.find(f => 
    (f.fighter1.name.toLowerCase().includes("pereira") && f.fighter2.name.toLowerCase().includes("hill")) ||
    (f.fighter1.name.toLowerCase().includes("hill") && f.fighter2.name.toLowerCase().includes("pereira"))
  );

  if (mainEvent) {
    console.log(`✓ Main event found: ${mainEvent.fighter1.name} vs ${mainEvent.fighter2.name}`);
    if (mainEvent.rounds === 5) {
      console.log(`✓ Success: Main event round count is correctly set to 5 rounds.`);
    } else {
      console.error(`X Failure: Main event round count should be 5, got: ${mainEvent.rounds}`);
      process.exit(1);
    }
  } else {
    console.log("! Main event fight not found in scraped roster. Skipping rounds check.");
  }

  console.log("ALL TAPOLOGY SCRAPER TESTS PASSED ✓");
}

testTapologyScraper()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
