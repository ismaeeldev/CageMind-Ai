import "dotenv/config";
import { prisma } from "../lib/db";
import { logger } from "../lib/logger";

async function main() {
  try {
    const { count: phCount } = await prisma.predictionHistory.deleteMany({});
    logger.info(`Successfully deleted ${phCount} PredictionHistory entries.`);

    const { count: fightCount } = await prisma.fight.updateMany({
      where: { event: { isUpcoming: false } },
      data: { aiPrediction: null, aiConfidence: null }
    });
    logger.info(`Successfully reset aiPrediction on ${fightCount} past fights.`);
  } catch (error) {
    logger.error("Failed to reset stats:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
