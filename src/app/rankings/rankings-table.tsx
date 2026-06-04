"use client";

import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface Fighter {
  id: string;
  name: string;
  imageUrl: string | null;
  weightClass: string | null;
  wins: number;
  losses: number;
  draws: number;
  eloRating: number;
  isActive: boolean;
}

const DIVISIONS = [
  "All",
  "Pound-for-Pound",
  "Heavyweight",
  "Light Heavyweight",
  "Middleweight",
  "Welterweight",
  "Lightweight",
  "Featherweight",
  "Bantamweight",
  "Flyweight",
  "Women's Bantamweight",
  "Women's Flyweight",
  "Women's Strawweight"
];

export function RankingsTable({ fighters }: { fighters: Fighter[] }) {
  const router = useRouter();
  const [activeDivision, setActiveDivision] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "retired" | "all">("active");

  const filteredFighters = useMemo(() => {
    return fighters.filter((f) => {
      // Status filter
      if (statusFilter === "active" && !f.isActive) return false;
      if (statusFilter === "retired" && f.isActive) return false;

      // Search filter
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Division filter
      if (activeDivision === "All") return true;
      if (activeDivision === "Pound-for-Pound") return true; 

      const wc = (f.weightClass || "").toLowerCase();
      const div = activeDivision.toLowerCase();
      
      return wc.includes(div);
    });
  }, [fighters, activeDivision, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {/* Division Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 flex-1">
          {DIVISIONS.map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                activeDivision === div
                  ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                  : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Secondary Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-zinc-800 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("active")}
              className={`flex-1 sm:w-20 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${statusFilter === "active" ? "bg-primary text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("retired")}
              className={`flex-1 sm:w-20 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${statusFilter === "retired" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              Retired
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex-1 sm:w-16 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${statusFilter === "all" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              All
            </button>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search fighters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Datatable */}
      <div className="bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 text-zinc-500 text-xs font-bold uppercase tracking-widest bg-zinc-900/30">
                <th className="p-4 text-center w-20">Rank</th>
                <th className="p-4">Fighter</th>
                <th className="p-4 hidden sm:table-cell">Division</th>
                <th className="p-4 hidden md:table-cell text-center">Record</th>
                <th className="p-4 text-right">Elo Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredFighters.slice(0, 100).map((fighter, idx) => (
                <tr 
                  key={fighter.id} 
                  className="hover:bg-zinc-900/30 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/fighters/${fighter.id}`)}
                >
                  <td className="p-4 text-center">
                    <span className="font-mono text-lg font-bold text-zinc-400 group-hover:text-zinc-200">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center text-zinc-600 font-bold uppercase">
                        {fighter.imageUrl && fighter.imageUrl !== "N/A" && fighter.imageUrl !== "null" ? (
                          <img
                            src={fighter.imageUrl}
                            alt={fighter.name}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          fighter.name.substring(0,2)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-100 text-lg group-hover:text-primary transition-colors">
                          {fighter.name}
                        </div>
                        {!fighter.isActive && (
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Retired</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge variant="outline" className="text-zinc-400 border-zinc-800 uppercase tracking-wider text-[10px]">
                      {fighter.weightClass || "Unknown"}
                    </Badge>
                  </td>
                  <td className="p-4 hidden md:table-cell text-center">
                    <span className="font-mono font-bold text-zinc-300">
                      {fighter.wins}-{fighter.losses}-{fighter.draws}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center justify-center bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg font-mono font-black text-emerald-400">
                      {fighter.eloRating}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredFighters.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono">
                    No fighters found in this division.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
