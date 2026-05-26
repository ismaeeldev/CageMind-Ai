"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Lock, ChevronLeft, ChevronRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";

interface Fight {
  id: string;
  weightClass: string | null;
  aiPrediction: string | null;
  aiConfidence: number | null;
  fighter1: { name: string };
  fighter2: { name: string };
  event: { name: string; date: string };
}

const WEIGHT_CLASSES = [
  "Flyweight", "Bantamweight", "Featherweight", "Lightweight",
  "Welterweight", "Middleweight", "Light Heavyweight", "Heavyweight",
  "Women's Strawweight", "Women's Flyweight", "Women's Bantamweight"
];

export default function PredictionsDashboard() {
  const [fights, setFights] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  
  const [search, setSearch] = useState("");
  const [weightClass, setWeightClass] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchPredictions();
  }, [debouncedSearch, weightClass, page]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
        weightClass: weightClass
      });
      const res = await fetch(`/api/predictions?${params}`);
      const data = await res.json();
      if (res.ok) {
        setFights(data.fights || []);
        setTotalPages(data.totalPages || 1);
        setIsPremium(data.isPremium);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const extractProbabilities = (summary: string, f1Name: string): { f1Prob: number, f2Prob: number } | null => {
    // Basic extraction if premium (since summary contains something like "83.5%")
    const match = summary.match(/(\d+\.\d+)%/);
    if (!match) return null;
    const prob = parseFloat(match[1]);
    
    // Check who is favored
    if (summary.includes(`${f1Name} is favored`)) {
      return { f1Prob: prob, f2Prob: 100 - prob };
    } else {
      return { f1Prob: 100 - prob, f2Prob: prob };
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#D22828]" /> AI Predictions
          </h1>
          <p className="text-zinc-400">Unlock mathematically precise fight predictions powered by our proprietary heuristic engine.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search fighters..." 
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-[#D22828] transition-colors"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg py-3 pl-12 pr-4 appearance-none focus:outline-none focus:border-[#D22828] transition-colors"
              value={weightClass}
              onChange={(e) => { setWeightClass(e.target.value); setPage(1); }}
            >
              <option value="">All Weights</option>
              {WEIGHT_CLASSES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-zinc-500 animate-pulse">Analyzing matrix...</div>
          ) : fights.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <p className="text-zinc-400">No predictions found.</p>
            </div>
          ) : (
            fights.map((fight) => {
              const isLocked = fight.aiPrediction === "LOCKED_PREMIUM";
              const probs = !isLocked && fight.aiPrediction ? extractProbabilities(fight.aiPrediction, fight.fighter1.name) : null;

              return (
                <div key={fight.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                  
                  {/* Top Bar */}
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-medium tracking-wide">
                      {fight.weightClass || "Catchweight"}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4"/> {new Date(fight.event.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Fighters Header */}
                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div className="text-left w-2/5">
                      <h2 className="text-2xl font-black text-white uppercase truncate">{fight.fighter1.name}</h2>
                    </div>
                    <div className="text-zinc-500 font-bold uppercase tracking-widest px-4">VS</div>
                    <div className="text-right w-2/5">
                      <h2 className="text-2xl font-black text-white uppercase truncate">{fight.fighter2.name}</h2>
                    </div>
                  </div>

                  {/* Prediction Area */}
                  <div className="relative">
                    {isLocked ? (
                      // Locked State
                      <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-950/50 border border-zinc-800/50">
                        {/* Fake blurred content */}
                        <div className="absolute inset-0 flex flex-col justify-center px-8 blur-md opacity-30 select-none pointer-events-none">
                          <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mb-4"></div>
                          <div className="h-2 w-3/4 bg-zinc-400 rounded mb-2"></div>
                          <div className="h-2 w-1/2 bg-zinc-400 rounded"></div>
                        </div>

                        {/* Lock Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20 backdrop-blur-sm">
                          <Lock className="w-8 h-8 text-[#D22828] mb-3 drop-shadow-lg" />
                          <h3 className="text-white font-bold tracking-wider mb-2 drop-shadow-md text-lg">Premium Prediction</h3>
                          <Link href="/pricing" className="bg-[#D22828] hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wide text-sm transition-all hover:scale-105 shadow-lg shadow-red-500/20">
                            Unlock Now
                          </Link>
                        </div>
                      </div>
                    ) : (
                      // Premium Unlocked State
                      <div className="bg-zinc-950/80 rounded-xl p-6 border border-zinc-800/50">
                        {probs && (
                          <div className="mb-6">
                            <div className="flex justify-between text-xl font-black mb-2">
                              <span className="text-blue-400">{probs.f1Prob.toFixed(1)}%</span>
                              <span className="text-orange-400">{probs.f2Prob.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-3 bg-zinc-900 rounded-full flex overflow-hidden border border-zinc-800">
                              <div className="h-full bg-blue-500" style={{ width: `${probs.f1Prob}%` }}></div>
                              <div className="h-full bg-orange-500" style={{ width: `${probs.f2Prob}%` }}></div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <Activity className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                          <div>
                            <div className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                              AI Summary
                              {fight.aiConfidence && (
                                <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-[10px]">
                                  {(fight.aiConfidence * 100).toFixed(0)}% Confidence
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-200 leading-relaxed text-sm">{fight.aiPrediction}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-zinc-400">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
