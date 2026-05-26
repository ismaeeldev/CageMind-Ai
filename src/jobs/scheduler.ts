import cron, { type ScheduledTask } from "node-cron";
import { logger } from "@/lib/logger";
import { JobRunner } from "./job-runner";
import { ScraperManager } from "./scraper-manager";
import { UfcEventScraper } from "../scrapers/ufc-event-scraper";
import { FightCardScraper } from "../scrapers/fight-card-scraper";
import { FighterScraper } from "../scrapers/fighter-scraper";
import { prisma } from "@/lib/db";

export class Scheduler {
  private dailyTask: ScheduledTask | null = null;
  private weeklyTask: ScheduledTask | null = null;

  public start() {
    logger.info("[Scheduler] Initializing cron jobs...");

    // Daily Job: Runs at 02:00 AM every day
    // Pattern: '0 2 * * *'
    this.dailyTask = cron.schedule("0 2 * * *", async () => {
      await JobRunner.run("DailyScrapePipeline", this.runDailyJobs.bind(this));
    });

    // Weekly Job: Runs at 03:00 AM every Sunday
    // Pattern: '0 3 * * 0'
    this.weeklyTask = cron.schedule("0 3 * * 0", async () => {
      await JobRunner.run("WeeklyDeepScrape", this.runWeeklyJobs.bind(this));
    });

    logger.info("[Scheduler] Started successfully. Waiting for cron triggers...");
  }

  public stop() {
    logger.info("[Scheduler] Stopping cron jobs...");
    if (this.dailyTask) this.dailyTask.stop();
    if (this.weeklyTask) this.weeklyTask.stop();
  }

  /**
   * Manual Trigger
   * Can be exposed via an API route or a CLI flag to run jobs instantly.
   */
  public async triggerManual(jobType: 'daily' | 'weekly') {
    logger.info(`[Scheduler] MANUAL TRIGGER executing ${jobType} jobs...`);
    if (jobType === 'daily') {
      await JobRunner.run("Manual-DailyScrapePipeline", this.runDailyJobs.bind(this));
    } else {
      await JobRunner.run("Manual-WeeklyDeepScrape", this.runWeeklyJobs.bind(this));
    }
  }

  // --- Actual Job Definitions ---

  private async runDailyJobs() {
    logger.info("[Jobs] Executing Daily Sync Jobs...");
    const manager = new ScraperManager();
    
    // 1. Sync the events list (LIVE MODE)
    manager.register(new UfcEventScraper(false));
    
    // 2. Sync fighters (MOCK MODE with archiving test)
    manager.register(new FighterScraper(true));
    
    await manager.runAllSequentially();

    // 3. Fetch the newly synced upcoming events to deep-scrape their fight cards
    const upcomingEvents = await prisma.event.findMany({
      where: { isUpcoming: true },
      orderBy: { date: 'asc' },
      take: 3 // Limit to next 3 events to prevent rate limiting
    });

    const fightCardManager = new ScraperManager();
    for (const event of upcomingEvents) {
      const match = event.name.match(/UFC\s(\d+)/i);
      const urlSlug = match ? `ufc-${match[1]}` : event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const eventUrl = `https://www.ufc.com/event/${urlSlug}`;
      
      fightCardManager.register(new FightCardScraper(eventUrl, event.id, false));
    }
    
    if (upcomingEvents.length > 0) {
      await fightCardManager.runAllSequentially();
    }
    
    logger.info("[Jobs] Daily Sync Jobs completed.");
  }

  private async runWeeklyJobs() {
    logger.info("[Jobs] Executing weekly job suite (Placeholder for Fighter Sync)");
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
}
