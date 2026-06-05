import "dotenv/config";
import { prisma } from "../lib/db";
import { TapologyScraper } from "../scrapers/tapology-scraper";

async function backfillPastCards() {
  console.log("Starting backfill for all past event cards...");

  const events = await prisma.event.findMany({
    where: { isUpcoming: false }
  });

  console.log(`Found ${events.length} completed events to backfill.`);

  for (const event of events) {
    console.log(`Backfilling card for event: "${event.name}" (ID: ${event.id})...`);
    const scraper = new TapologyScraper(event.id, event.name);
    const success = await scraper.scrapeAndSave();
    if (success) {
      console.log(`✓ Successfully updated fight card for event: "${event.name}"`);
    } else {
      console.error(`X Failed to update card for event: "${event.name}"`);
    }
    // Delay to be polite to Tapology
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("Event cards backfill completed.");
}

if (require.main === module) {
  backfillPastCards()
    .catch(err => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
