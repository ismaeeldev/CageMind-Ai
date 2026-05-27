import 'dotenv/config';
import { FighterScraper } from '../scrapers/fighter-scraper';

async function main() {
  console.log("Starting manual fighter scraper script...");
  const scraper = new FighterScraper(false); // real data
  const result = await scraper.run();
  console.log(`Scraper run finished. Processed ${result.length} fighters.`);
}

main().catch(err => {
  console.error("Error running scraper script:", err);
  process.exit(1);
});
