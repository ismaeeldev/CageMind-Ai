import { logger } from "@/lib/logger";
import { BaseScraper } from "@/scrapers/base-scraper";

/**
 * Manages the execution of scraper jobs.
 * This can be wired up to a cron job, Next.js API route, or background worker.
 */
export class ScraperManager {
  private scrapers: BaseScraper<any>[] = [];

  /**
   * Register a scraper to be managed
   */
  public register(scraper: BaseScraper<any>) {
    this.scrapers.push(scraper);
    logger.info(`[ScraperManager] Registered scraper: ${scraper.scraperName}`);
  }

  /**
   * Run all registered scrapers sequentially
   */
  public async runAllSequentially(): Promise<void> {
    logger.info(`[ScraperManager] Starting sequential run for ${this.scrapers.length} scrapers`);
    
    for (const scraper of this.scrapers) {
      try {
        await scraper.run();
      } catch (error) {
        logger.error(`[ScraperManager] Scraper ${scraper.scraperName} completely failed. Continuing to next scraper...`, error);
      }
    }
    
    logger.info(`[ScraperManager] Finished sequential run`);
  }

  /**
   * Run all registered scrapers in parallel
   */
  public async runAllParallel(): Promise<void> {
    logger.info(`[ScraperManager] Starting parallel run for ${this.scrapers.length} scrapers`);
    
    const promises = this.scrapers.map(scraper => 
      scraper.run().catch(error => {
        logger.error(`[ScraperManager] Scraper ${scraper.scraperName} completely failed during parallel run.`, error);
      })
    );

    await Promise.allSettled(promises);
    
    logger.info(`[ScraperManager] Finished parallel run`);
  }
}
