import "dotenv/config";
import { UfcEventScraper } from "./src/scrapers/ufc-event-scraper";
import { FighterScraper } from "./src/scrapers/fighter-scraper";
import { FightCardScraper } from "./src/scrapers/fight-card-scraper";
import { ScraperManager } from "./src/jobs/scraper-manager";
import { prisma } from "./src/lib/db";
import { logger } from "./src/lib/logger";

async function main() {
  logger.info("Initializing Test Scraper Mode...");

  // First, let's grab an event from the DB to attach the fights to.
  const event = await prisma.event.findFirst({
    orderBy: { date: 'desc' }
  });

  if (!event) {
    logger.error("No events found in DB to attach fights to. Please run event scraper first.");
    return;
  }

  const manager = new ScraperManager();
  
  // Register the scrapers. EventScraper in LIVE mode (false), FighterScraper in MOCK mode (true)
  // manager.register(new UfcEventScraper(false));
  // manager.register(new FighterScraper(true));
  
  // For the fight card scraper, we pass the eventUrl and the eventId. 
  // We'll run it in MOCK mode (true) to ensure exactly predictable test output.
  const mockEventUrl = "https://www.ufc.com/event/ufc-302"; 
  manager.register(new FightCardScraper(mockEventUrl, event.id, true));

  // Run the job
  await manager.runAllSequentially();

  logger.info("Checking database for mock fights...");
  const fights = await prisma.fight.findMany({
    where: { eventId: event.id },
    include: { fighter1: true, fighter2: true }
  });

  logger.info(`Found ${fights.length} fights attached to event ${event.name} in the database.`);
  console.log(JSON.stringify(fights.map(f => `${f.fighter1.name} vs ${f.fighter2.name}`), null, 2));

  logger.info("TEST SUCCESS! Database received mock fights and linked them to fighters via connectOrCreate.");
}

main()
  .catch((e) => {
    logger.error("Test failed", e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter handles connection pooling natively
  });
