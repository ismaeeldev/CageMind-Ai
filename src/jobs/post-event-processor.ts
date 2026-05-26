import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export class PostEventProcessor {
  /**
   * Main entry point to process all completed events.
   */
  public async processCompletedEvents() {
    logger.info("[PostEventProcessor] Scanning for completed events...");

    // Find all events that have occurred but haven't been processed yet
    const eventsToProcess = await prisma.event.findMany({
      where: {
        isUpcoming: false,
        isProcessed: false,
      },
      include: {
        fights: {
          include: {
            fighter1: true,
            fighter2: true,
          }
        }
      }
    });

    if (eventsToProcess.length === 0) {
      logger.info("[PostEventProcessor] No new completed events to process.");
      return;
    }

    for (const event of eventsToProcess) {
      logger.info(`[PostEventProcessor] Processing Event: ${event.name}`);
      try {
        await this.processSingleEvent(event);
      } catch (error) {
        logger.error(`[PostEventProcessor] Critical failure processing event ${event.name}. Transaction rolled back.`, error);
      }
    }
  }

  /**
   * Processes a single event entirely within a Prisma Transaction.
   * If any step fails, all database modifications for this event are rolled back.
   */
  private async processSingleEvent(event: any) {
    await prisma.$transaction(async (tx) => {
      let auditDetails: any[] = [];

      for (const fight of event.fights) {
        // Skip fights that somehow don't have fighters
        if (!fight.fighter1 || !fight.fighter2) continue;

        // In a fully live environment, we would fetch/scrape actual results here.
        // For testing/mock architecture, if winnerId is null, we simulate a result.
        let winnerId = fight.winnerId;
        let method = fight.method;
        if (!winnerId) {
          // Simulate a winner (randomly pick f1 or f2) for test purposes
          const f1Wins = Math.random() > 0.5;
          winnerId = f1Wins ? fight.fighter1.id : fight.fighter2.id;
          method = f1Wins ? "KO/TKO" : "Submission";

          // Update the fight record with the result
          await tx.fight.update({
            where: { id: fight.id },
            data: { winnerId, method, endingRound: 1, endingTime: "2:30" }
          });
        }

        const f1 = fight.fighter1;
        const f2 = fight.fighter2;

        const f1Won = winnerId === f1.id;
        const f2Won = winnerId === f2.id;
        
        // If somehow neither won, treat as a draw
        const isDraw = !f1Won && !f2Won;

        // 1. Calculate New Elo
        const kFactor = 32;
        
        // Expected score formula: 1 / (1 + 10^((OppRating - MyRating) / 400))
        const f1Expected = 1 / (1 + Math.pow(10, (f2.eloRating - f1.eloRating) / 400));
        const f2Expected = 1 / (1 + Math.pow(10, (f1.eloRating - f2.eloRating) / 400));

        const f1Actual = f1Won ? 1 : (isDraw ? 0.5 : 0);
        const f2Actual = f2Won ? 1 : (isDraw ? 0.5 : 0);

        const f1NewElo = Math.round(f1.eloRating + kFactor * (f1Actual - f1Expected));
        const f2NewElo = Math.round(f2.eloRating + kFactor * (f2Actual - f2Expected));

        // 2. Update Fighter Records
        await tx.fighter.update({
          where: { id: f1.id },
          data: {
            wins: f1Won ? { increment: 1 } : undefined,
            losses: f2Won ? { increment: 1 } : undefined,
            draws: isDraw ? { increment: 1 } : undefined,
            eloRating: f1NewElo,
          }
        });

        await tx.fighter.update({
          where: { id: f2.id },
          data: {
            wins: f2Won ? { increment: 1 } : undefined,
            losses: f1Won ? { increment: 1 } : undefined,
            draws: isDraw ? { increment: 1 } : undefined,
            eloRating: f2NewElo,
          }
        });

        // Add to audit trail
        auditDetails.push({
          fightId: fight.id,
          fighter1: { name: f1.name, oldElo: f1.eloRating, newElo: f1NewElo, result: f1Actual },
          fighter2: { name: f2.name, oldElo: f2.eloRating, newElo: f2NewElo, result: f2Actual },
          method: method
        });
      }

      // 3. Mark Event as Processed
      await tx.event.update({
        where: { id: event.id },
        data: { isProcessed: true }
      });

      // 4. Generate Audit Log
      await tx.auditLog.create({
        data: {
          action: "POST_EVENT_PROCESSING",
          details: JSON.stringify({
            eventId: event.id,
            eventName: event.name,
            fightsProcessed: event.fights.length,
            eloShifts: auditDetails
          })
        }
      });

      logger.info(`[PostEventProcessor] Successfully processed ${event.name} and updated Elo ratings.`);
    });
  }
}
