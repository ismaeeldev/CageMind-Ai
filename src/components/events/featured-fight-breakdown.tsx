import { Sparkles, Target, Zap, AlertOctagon, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeaturedFightProps {
  fight: any;
  isUpcoming: boolean;
}

export function FeaturedFightBreakdown({ fight, isUpcoming }: FeaturedFightProps) {
  if (!fight) return null;

  // 1. Identify Pick and Win Probability
  let confidenceLevel = fight.aiConfidence || 0;
  
  // If we don't have explicit aiConfidence, try to extract from prediction text or use Elo
  const extractProbabilities = (summary: string | null, f1Name: string): { f1Prob: number, f2Prob: number } => {
    if (summary) {
      const match = summary.match(/(\d+\.\d+)%/);
      if (match) {
        const prob = parseFloat(match[1]);
        if (summary.includes(`${f1Name} is favored`)) {
          return { f1Prob: prob, f2Prob: 100 - prob };
        } else {
          return { f1Prob: 100 - prob, f2Prob: prob };
        }
      }
    }
    const eloDiff = (fight.fighter1?.eloRating || 1500) - (fight.fighter2?.eloRating || 1500);
    const probF1 = 1 / (1 + Math.exp(-eloDiff / 250));
    return { f1Prob: probF1 * 100, f2Prob: (1 - probF1) * 100 };
  };

  const aiProbs = extractProbabilities(fight.aiPrediction, fight.fighter1.name);
  const isF1Favored = aiProbs.f1Prob >= aiProbs.f2Prob;
  const aiPick = isF1Favored ? fight.fighter1.name : fight.fighter2.name;
  const aiPickProb = isF1Favored ? aiProbs.f1Prob : aiProbs.f2Prob;

  // 2. Parse Predicted Method and Round
  let predictedMethod = "DEC";
  let predictedRound = "3";
  const predictionText = (fight.aiPrediction || "").toLowerCase();
  
  if (predictionText.includes("ko") || predictionText.includes("knockout") || predictionText.includes("tko")) {
    predictedMethod = "KO/TKO";
  } else if (predictionText.includes("sub") || predictionText.includes("submission")) {
    predictedMethod = "SUB";
  }

  const roundMatch = predictionText.match(/round (\d)/);
  if (roundMatch) {
    predictedRound = roundMatch[1];
  } else if (predictedMethod !== "DEC") {
    predictedRound = "2"; // Default fallback if not DEC but no round specified
  }

  // 3. Calculate Upset Risk
  const getImpliedProbability = (odds: number | null): number => {
    if (!odds) return 50;
    if (odds > 0) return (100 / (odds + 100)) * 100;
    return (Math.abs(odds) / (Math.abs(odds) + 100)) * 100;
  };

  const pickOdds = isF1Favored ? fight.oddsFighter1 : fight.oddsFighter2;
  const opponentOdds = isF1Favored ? fight.oddsFighter2 : fight.oddsFighter1;
  const impliedPickProb = getImpliedProbability(pickOdds);
  
  let upsetRisk = "LOW";
  let upsetColor = "text-emerald-400";
  let bgUpsetColor = "bg-emerald-500/10 border-emerald-500/20";
  
  // If the opponent is favored by Vegas but AI picks our guy, or if odds are very close
  if (getImpliedProbability(opponentOdds) > impliedPickProb + 5) {
    upsetRisk = "HIGH";
    upsetColor = "text-red-400";
    bgUpsetColor = "bg-red-500/10 border-red-500/20";
  } else if (Math.abs(impliedPickProb - getImpliedProbability(opponentOdds)) < 15) {
    upsetRisk = "MODERATE";
    upsetColor = "text-yellow-400";
    bgUpsetColor = "bg-yellow-500/10 border-yellow-500/20";
  }

  return (
    <div className="mb-10 relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-1000"></div>
      
      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/60 bg-gradient-to-r from-zinc-900/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <BrainCircuit className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-white flex items-center gap-2">
              Featured AI Breakdown
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 text-[10px]">High Confidence</Badge>
            </h3>
          </div>
          <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase hidden md:inline-block">
            {fight.fighter1.name} vs {fight.fighter2.name}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          
          {/* Main Pick Column */}
          <div className="md:col-span-1 flex flex-col justify-center border-r border-zinc-800/60 pr-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Most Confident Pick</span>
            <div className="text-3xl font-black uppercase text-white mb-1 drop-shadow-md">
              {aiPick}
            </div>
            <div className="flex items-center gap-2 text-primary font-mono text-xl font-bold mb-4">
              <Target className="w-5 h-5" />
              {aiPickProb.toFixed(1)}% Win Prob
            </div>
            
            <div className={`p-3 rounded-lg border ${bgUpsetColor} flex items-center gap-3 mt-auto`}>
              <AlertOctagon className={`w-5 h-5 ${upsetColor}`} />
              <div>
                <div className={`text-[10px] uppercase tracking-widest font-bold ${upsetColor}`}>Upset Risk</div>
                <div className="font-black text-white text-sm">{upsetRisk}</div>
              </div>
            </div>
          </div>

          {/* AI Narrative & Method Column */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div className="mb-6">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" /> AI Fight Narrative
              </span>
              <p className="text-zinc-300 text-sm leading-relaxed italic border-l-2 border-zinc-800 pl-4">
                "{fight.aiPrediction || `${aiPick} is favored to win based on a significant Elo advantage and superior stylistic metrics. The model predicts a decisive victory.`}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/60">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Predicted Method</span>
                <span className="text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> {predictedMethod}
                </span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/60">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Predicted Round</span>
                <span className="text-lg font-black text-white">
                  Round {predictedRound}
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
