"use client";

import { useEffect, useState } from "react";
import { Swords, Activity, User, Ruler, TrendingUp, HelpCircle } from "lucide-react";

interface FighterBasic {
  id: string;
  name: string;
  weightClass: string | null;
}

interface FighterDetails extends FighterBasic {
  age: number | null;
  height: number | null;
  reach: number | null;
  wins: number;
  losses: number;
  draws: number;
  eloRating: number;
}

interface Prediction {
  winProbabilityFighter1: number;
  winProbabilityFighter2: number;
  confidenceScore: number;
  summary: string;
}

export default function MatchupPage() {
  const [fighters, setFighters] = useState<FighterBasic[]>([]);
  const [f1Id, setF1Id] = useState<string>("");
  const [f2Id, setF2Id] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [f1Details, setF1Details] = useState<FighterDetails | null>(null);
  const [f2Details, setF2Details] = useState<FighterDetails | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    fetch("/api/matchup")
      .then(res => res.json())
      .then(data => {
        if (data.fighters) setFighters(data.fighters);
      });
  }, []);

  const handleCompare = async () => {
    if (!f1Id || !f2Id) return;
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch("/api/matchup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fighter1Id: f1Id, fighter2Id: f2Id })
      });
      const data = await res.json();
      if (res.ok) {
        setF1Details(data.fighter1);
        setF2Details(data.fighter2);
        setPrediction(data.prediction);
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getAdvantageClass = (val1: number | null, val2: number | null, invert = false) => {
    if (val1 === null || val2 === null) return "text-zinc-400";
    if (val1 > val2) return invert ? "text-[#D22828]" : "text-green-400";
    if (val1 < val2) return invert ? "text-green-400" : "text-[#D22828]";
    return "text-zinc-400";
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-zinc-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-[#D22828]/10 rounded-full mb-4 border border-[#D22828]/20">
            <Swords className="w-8 h-8 text-[#D22828]" />
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Matchup Engine</h1>
          <p className="text-zinc-400 max-w-lg mx-auto">Select two fighters to instantly generate a hypothetical AI prediction based on historical data and physical attributes.</p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center mb-12 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="w-full">
            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Fighter A</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-4 focus:outline-none focus:border-[#D22828] transition-colors"
              value={f1Id}
              onChange={(e) => setF1Id(e.target.value)}
            >
              <option value="">-- Select Fighter --</option>
              {fighters.map(f => <option key={f.id} value={f.id}>{f.name} {f.weightClass ? `(${f.weightClass})` : ''}</option>)}
            </select>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleCompare}
              disabled={loading || !f1Id || !f2Id || f1Id === f2Id}
              className="bg-[#D22828] hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-[#D22828] text-white font-bold px-8 py-4 rounded-full uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#D22828]/20"
            >
              {loading ? "Analyzing..." : "Compare"}
            </button>
          </div>

          <div className="w-full">
            <label className="block text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 text-right">Fighter B</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-4 focus:outline-none focus:border-[#D22828] transition-colors text-right"
              value={f2Id}
              onChange={(e) => setF2Id(e.target.value)}
            >
              <option value="">-- Select Fighter --</option>
              {fighters.map(f => <option key={f.id} value={f.id}>{f.name} {f.weightClass ? `(${f.weightClass})` : ''}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        {f1Details && f2Details && prediction && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Probability Bar */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 opacity-50"></div>
              
              <div className="flex justify-between items-end mb-4">
                <div className="text-left">
                  <h2 className="text-3xl font-black text-white uppercase">{f1Details.name}</h2>
                  <p className="text-5xl font-black text-blue-400 mt-2">{prediction.winProbabilityFighter1}%</p>
                </div>
                <div className="text-zinc-500 font-bold uppercase tracking-widest px-4">VS</div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-white uppercase">{f2Details.name}</h2>
                  <p className="text-5xl font-black text-orange-400 mt-2">{prediction.winProbabilityFighter2}%</p>
                </div>
              </div>

              <div className="w-full h-6 bg-zinc-950 rounded-full flex overflow-hidden border border-zinc-800">
                <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${prediction.winProbabilityFighter1}%` }}></div>
                <div className="h-full bg-orange-500 transition-all duration-1000 ease-out" style={{ width: `${prediction.winProbabilityFighter2}%` }}></div>
              </div>

              <div className="mt-8 bg-zinc-950/50 p-6 rounded-xl border border-zinc-800/50 flex items-start gap-4">
                <Activity className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    AI Summary 
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs">{(prediction.confidenceScore * 100).toFixed(0)}% Confidence</span>
                  </h4>
                  <p className="text-zinc-200 leading-relaxed text-lg">{prediction.summary}</p>
                </div>
              </div>
            </div>

            {/* Stat Matrix */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 p-4 border-b border-zinc-800 bg-zinc-950/50">
                <div className="font-bold text-white text-lg">{f1Details.name}</div>
                <div className="text-zinc-500 font-bold uppercase tracking-widest px-4 text-center text-sm mt-1">Attribute</div>
                <div className="font-bold text-white text-lg text-right">{f2Details.name}</div>
              </div>

              <div className="p-4 space-y-2">
                {[
                  { label: "Age", icon: <User className="w-4 h-4"/>, v1: f1Details.age, v2: f2Details.age, suffix: "", invert: true },
                  { label: "Height", icon: <Ruler className="w-4 h-4"/>, v1: f1Details.height, v2: f2Details.height, suffix: '"', invert: false },
                  { label: "Reach", icon: <Ruler className="w-4 h-4"/>, v1: f1Details.reach, v2: f2Details.reach, suffix: '"', invert: false },
                  { label: "Elo Rating", icon: <TrendingUp className="w-4 h-4"/>, v1: f1Details.eloRating, v2: f2Details.eloRating, suffix: "", invert: false },
                ].map((stat, i) => (
                  <div key={i} className="grid grid-cols-[1fr,auto,1fr] gap-4 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors rounded-lg px-4">
                    <div className={`text-xl font-bold ${getAdvantageClass(stat.v1, stat.v2, stat.invert)}`}>
                      {stat.v1 !== null ? `${stat.v1}${stat.suffix}` : 'N/A'}
                    </div>
                    <div className="text-zinc-400 flex items-center justify-center gap-2 font-medium uppercase tracking-wider text-sm w-32">
                      {stat.icon} {stat.label}
                    </div>
                    <div className={`text-xl font-bold text-right ${getAdvantageClass(stat.v2, stat.v1, stat.invert)}`}>
                      {stat.v2 !== null ? `${stat.v2}${stat.suffix}` : 'N/A'}
                    </div>
                  </div>
                ))}
                
                {/* Record Row (Special Format) */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 py-4 px-4 hover:bg-zinc-800/20 transition-colors rounded-lg">
                  <div className="text-xl font-bold text-white">
                    {f1Details.wins}-{f1Details.losses}-{f1Details.draws}
                  </div>
                  <div className="text-zinc-400 flex items-center justify-center gap-2 font-medium uppercase tracking-wider text-sm w-32">
                    <Swords className="w-4 h-4"/> Record
                  </div>
                  <div className="text-xl font-bold text-white text-right">
                    {f2Details.wins}-{f2Details.losses}-{f2Details.draws}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
