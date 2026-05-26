import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";

export type JobFunction = () => Promise<void>;

export class JobRunner {
  private static activeJobs = new Set<string>();

  /**
   * Wraps a job function with logging, monitoring, failure tracking, and DB persistence.
   * Prevents duplicate runs of the same job.
   */
  static async run(jobName: string, jobFn: JobFunction): Promise<void> {
    if (this.activeJobs.has(jobName)) {
      logger.warn(`[JobRunner] Job ${jobName} is already running. Preventing duplicate run.`);
      return;
    }

    this.activeJobs.add(jobName);
    logger.info(`[JobRunner] Starting scheduled job: ${jobName}`);
    
    // Create DB Record
    let executionRecord;
    try {
      executionRecord = await prisma.jobExecution.create({
        data: {
          jobName,
          status: "RUNNING",
        }
      });
    } catch (e) {
      logger.error(`[JobRunner] Failed to create JobExecution record for ${jobName}`, e);
    }

    const startTime = Date.now();

    try {
      await jobFn();
      
      const durationMs = Date.now() - startTime;
      logger.info(`[JobRunner] Job completed successfully: ${jobName} (Duration: ${durationMs}ms)`);
      
      if (executionRecord) {
        await prisma.jobExecution.update({
          where: { id: executionRecord.id },
          data: {
            status: "SUCCESS",
            completedAt: new Date(),
            durationMs
          }
        });
      }
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      logger.error(`[JobRunner] Job FAILED: ${jobName} (Duration: ${durationMs}ms)`, error);
      
      if (executionRecord) {
        await prisma.jobExecution.update({
          where: { id: executionRecord.id },
          data: {
            status: "FAILED",
            completedAt: new Date(),
            durationMs,
            error: error?.message || String(error)
          }
        });
      }
    } finally {
      this.activeJobs.delete(jobName);
    }
  }
}
