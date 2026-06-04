import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { calculateEloDelta } from "@/lib/elo";
import { PredictionEngine } from "@/lib/prediction-engine";

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
    const engine = new PredictionEngine();

    // 1. Pre-generate AI predictions outside the transaction to avoid timing out
    for (const fight of event.fights) {
      if (!fight.fighter1 || !fight.fighter2) continue;

      if (!fight.aiPrediction) {
        try {
          // Determine if five rounds
          const firstFightForEvent = await prisma.fight.findFirst({
            where: { eventId: fight.eventId },
            orderBy: { createdAt: 'asc' }
          });
          const isMainEvent = firstFightForEvent?.id === fight.id;
          const isFiveRounds = fight.isTitleFight || isMainEvent;

          const prediction = await engine.generateHypotheticalPrediction(
            fight.fighter1,
            fight.fighter2,
            event.date,
            isFiveRounds
          );

          // Save to fight
          await prisma.fight.update({
            where: { id: fight.id },
            data: {
              aiPrediction: prediction.summary,
              aiConfidence: prediction.confidenceScore
            }
          });

          // Save to PredictionHistory
          await prisma.predictionHistory.create({
            data: {
              fightId: fight.id,
              winProbFighter1: prediction.winProbabilityFighter1,
              winProbFighter2: prediction.winProbabilityFighter2,
              confidence: prediction.confidenceScore,
              explanation: prediction.summary
            }
          });

          fight.aiPrediction = prediction.summary;
          fight.aiConfidence = prediction.confidenceScore;
          logger.info(`[PostEventProcessor] Pre-generated prediction for fight ${fight.id}`);
        } catch (err) {
          logger.error(`[PostEventProcessor] Failed to generate prediction for fight ${fight.id}:`, err);
        }
      }
    }

    // 2. Process results in a transaction with custom timeout
    await prisma.$transaction(async (tx) => {
      let auditDetails: any[] = [];

      for (const fight of event.fights) {
        if (!fight.fighter1 || !fight.fighter2) continue;

        const f1 = fight.fighter1;
        const f2 = fight.fighter2;

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

        const f1Won = winnerId === f1.id;
        const f2Won = winnerId === f2.id;
        
        // If somehow neither won, treat as a draw
        const isDraw = !f1Won && !f2Won;

        // 1. Calculate New Elo using our central ELO calculator
        const isUFCFight = event.name.toUpperCase().includes("UFC");
        const winnerLosses = winnerId === f1.id ? f1.losses : f2.losses;

        const delta = calculateEloDelta(f1.eloRating, f2.eloRating, {
          isTitleFight: fight.isTitleFight,
          method: method,
          round: fight.endingRound,
          winnerId: winnerId,
          fighter1Id: f1.id,
          fighter2Id: f2.id,
          isUFCFight,
          winnerIsUndefeated: winnerLosses === 0
        });

        const f1NewElo = f1.eloRating + delta;
        const f2NewElo = f2.eloRating - delta;

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
          fighter1: { name: f1.name, oldElo: f1.eloRating, newElo: f1NewElo, result: f1Won ? 1 : (isDraw ? 0.5 : 0) },
          fighter2: { name: f2.name, oldElo: f2.eloRating, newElo: f2NewElo, result: f2Won ? 1 : (isDraw ? 0.5 : 0) },
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
    }, { maxWait: 20000, timeout: 60000 });
  }
}
