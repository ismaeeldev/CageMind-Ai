import { logger } from "@/lib/logger";
import { ScraperError, RateLimitError } from "@/lib/scraper-error";

export interface ScraperConfig {
  maxRetries?: number;
  timeoutMs?: number;
  delayBetweenRequestsMs?: number;
}

export abstract class BaseScraper<T> {
  protected maxRetries: number;
  protected timeoutMs: number;
  protected delayBetweenRequestsMs: number;
  public scraperName: string;

  constructor(scraperName: string, config: ScraperConfig = {}) {
    this.scraperName = scraperName;
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 10000;
    this.delayBetweenRequestsMs = config.delayBetweenRequestsMs ?? 1000;
  }

  /**
   * Core execution block that must be implemented by child classes.
   * Do the actual fetch and parse here.
   */
  protected abstract execute(): Promise<T>;

  /**
   * Helper sleep function for rate limiting and backoff
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Public entrypoint that wraps the execute function with retries, logging, and error handling.
   */
  public async run(): Promise<T> {
    let attempt = 1;

    while (attempt <= this.maxRetries) {
      try {
        logger.info(`[${this.scraperName}] Starting scrape attempt ${attempt}/${this.maxRetries}`);
        const result = await this.execute();
        logger.info(`[${this.scraperName}] Scrape successful on attempt ${attempt}`);
        return result;
      } catch (error) {
        logger.warn(`[${this.scraperName}] Scrape attempt ${attempt} failed.`, { error });

        if (error instanceof ScraperError) {
          if (!error.isRetryable) {
            logger.error(`[${this.scraperName}] Non-retryable error encountered. Aborting.`, error);
            throw error;
          }

          if (error instanceof RateLimitError) {
            logger.warn(`[${this.scraperName}] Rate limited. Waiting ${error.retryAfterMs}ms before next attempt.`);
            await this.sleep(error.retryAfterMs);
          }
        }

        if (attempt === this.maxRetries) {
          logger.error(`[${this.scraperName}] Max retries reached (${this.maxRetries}). Scrape failed.`, error);
          throw error;
        }

        // Exponential backoff
        const backoffMs = this.delayBetweenRequestsMs * Math.pow(2, attempt - 1);
        logger.info(`[${this.scraperName}] Waiting ${backoffMs}ms before retry...`);
        await this.sleep(backoffMs);
        
        attempt++;
      }
    }

    throw new Error("Unexpected end of run loop");
  }
}
