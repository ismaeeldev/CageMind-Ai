import { NetworkError } from "@/lib/scraper-error";
import { logger } from "@/lib/logger";

export class UfcSourceAdapter {
  public async fetchHtml(url: string = "https://www.ufc.com/events"): Promise<string> {
    logger.debug(`[UfcSourceAdapter] Fetching HTML from ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5"
        },
        signal: AbortSignal.timeout(15000) 
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new NetworkError(`Rate limited by ${url}`, url);
        }
        throw new NetworkError(`Failed to fetch from ${url}. Status: ${response.status}`, url);
      }

      const html = await response.text();
      logger.debug(`[UfcSourceAdapter] Successfully fetched ${html.length} bytes from ${url}`);
      return html;
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new NetworkError(`Timeout while fetching ${url}`, url);
      }
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError(`Unexpected network error: ${error}`, url);
    }
  }
}
