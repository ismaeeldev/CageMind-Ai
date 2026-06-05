import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isPremium = session?.user?.isPremium === true;
    if (!isPremium) {
      return NextResponse.json({ error: "Premium required" }, { status: 403 });
    }

    // Fetch all past fights that have both an AI prediction AND a recorded winner
    const gradedFights = await prisma.fight.findMany({
      where: {
        event: { isUpcoming: false },
        aiPrediction: { not: null },
        winnerId: { not: null },
      },
      include: {
        fighter1: { select: { id: true, name: true } },
        fighter2: { select: { id: true, name: true } },
        event: { select: { id: true, name: true, date: true } },
        predictionHistory: { orderBy: { createdAt: "asc" }, take: 1 },
      },
      orderBy: { event: { date: "asc" } },
    });

    // Grade each fight
    const gradedPicks = gradedFights.map((fight) => {
      const history = fight.predictionHistory[0];
      if (!history) return null;

      // Determine AI's pick (fighter with higher predicted probability)
      const aiPickedFighter1 = history.winProbFighter1 >= history.winProbFighter2;
      const aiPickedWinnerId = aiPickedFighter1 ? fight.fighter1Id : fight.fighter2Id;

      const isCorrect = aiPickedWinnerId === fight.winnerId;
      const confidence = history.confidence; // 0-1 scale
      const isHighConfidence = confidence >= 0.6;

      // Flat $100 unit bet ROI calculation
      // Determine the odds for the AI's pick
      const aiOdds = aiPickedFighter1 ? fight.oddsFighter1 : fight.oddsFighter2;
      let profit = 0;
      let wager = 0;
      if (aiOdds !== null) {
        wager = 100;
        if (isCorrect) {
          if (aiOdds > 0) {
            profit = aiOdds; // e.g., +150 odds → $150 profit
          } else if (aiOdds < 0) {
            profit = (100 / Math.abs(aiOdds)) * 100; // e.g., -200 odds → $50 profit
          } else {
            profit = 0;
          }
        } else {
          profit = -100;
        }
      }

      return {
        fightId: fight.id,
        eventId: fight.event.id,
        eventName: fight.event.name,
        eventDate: fight.event.date,
        fighter1Name: fight.fighter1.name,
        fighter2Name: fight.fighter2.name,
        aiPickedFighter: aiPickedFighter1 ? fight.fighter1.name : fight.fighter2.name,
        actualWinner: aiPickedFighter1 === isCorrect ? fight.fighter1.name : fight.fighter2.name,
        isCorrect,
        confidence,
        isHighConfidence,
        profit, // net profit on $100 bet
        odds: aiOdds,
      };
    }).filter(Boolean) as {
      fightId: string; eventId: string; eventName: string; eventDate: Date;
      fighter1Name: string; fighter2Name: string; aiPickedFighter: string;
      actualWinner: string; isCorrect: boolean; confidence: number;
      isHighConfidence: boolean; profit: number; odds: number | null;
    }[];

    // ── Helper: compute aggregate stats ──────────────────────────────────
    const computeStats = (picks: typeof gradedPicks) => {
      if (picks.length === 0) {
        return {
          total: 0, correct: 0, accuracy: 0, totalProfit: 0, roi: 0, eventsGraded: 0, timeline: [],
        };
      }

      const eventIds = new Set(picks.map((p) => p.eventId));
      let cumBankroll = 1000; // Start with $1000 virtual bankroll
      const timeline: {
        eventName: string; date: string; correct: number; total: number;
        roi: number; cumulativeBankroll: number; rollingWinRate: number;
      }[] = [];

      // Group by event for charting
      const byEvent = picks.reduce((acc, pick) => {
        if (!acc[pick.eventId]) acc[pick.eventId] = { eventName: pick.eventName, date: pick.eventDate, picks: [] };
        acc[pick.eventId].picks.push(pick);
        return acc;
      }, {} as Record<string, { eventName: string; date: Date; picks: typeof gradedPicks }>);

      let totalCorrectSoFar = 0;
      let totalPicksSoFar = 0;

      Object.values(byEvent).forEach((evt) => {
        const evtCorrect = evt.picks.filter((p) => p.isCorrect).length;
        const evtProfit = evt.picks.reduce((s, p) => s + p.profit, 0);
        const evtWager = evt.picks.reduce((s, p) => s + (p.odds !== null ? 100 : 0), 0);
        const evtROI = evtWager > 0 ? (evtProfit / evtWager) * 100 : 0;
        cumBankroll += evtProfit;
        totalCorrectSoFar += evtCorrect;
        totalPicksSoFar += evt.picks.length;

        timeline.push({
          eventId: evt.picks[0]?.eventId || "",
          eventName: evt.eventName.split(":")[0].trim(),
          date: evt.date.toISOString().split("T")[0],
          correct: evtCorrect,
          total: evt.picks.length,
          roi: parseFloat(evtROI.toFixed(1)),
          cumulativeBankroll: parseFloat(cumBankroll.toFixed(2)),
          rollingWinRate: parseFloat(((totalCorrectSoFar / totalPicksSoFar) * 100).toFixed(1)),
          picks: evt.picks
        });
      });

      const totalCorrect = picks.filter((p) => p.isCorrect).length;
      const totalProfit = picks.reduce((s, p) => s + p.profit, 0);
      const totalWager = picks.reduce((s, p) => s + (p.odds !== null ? 100 : 0), 0);
      const overallROI = totalWager > 0 ? (totalProfit / totalWager) * 100 : 0;

      return {
        total: picks.length,
        correct: totalCorrect,
        accuracy: parseFloat(((totalCorrect / picks.length) * 100).toFixed(1)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        roi: parseFloat(overallROI.toFixed(1)),
        eventsGraded: eventIds.size,
        timeline,
      };
    };

    const allStats = computeStats(gradedPicks);
    const highConfStats = computeStats(gradedPicks.filter((p) => p.isHighConfidence));

    return NextResponse.json({ allStats, highConfStats });
  } catch (error: any) {
    console.error("Performance API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
