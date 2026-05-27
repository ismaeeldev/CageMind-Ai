"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FighterDetails {
  age: number | null;
  height: number | null;
  reach: number | null;
  koWins: number;
  subWins: number;
  wins: number;
  losses: number;
  draws: number;
}

export function FighterDetailsSection({
  id,
  name,
  initialWins,
  initialLosses,
  initialDraws,
}: {
  id: string;
  name: string;
  initialWins: number;
  initialLosses: number;
  initialDraws: number;
}) {
  const [details, setDetails] = useState<FighterDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    
    async function loadDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/fighters/${id}/details`);
        if (res.ok && active) {
          const data = await res.json();
          setDetails(data);
        }
      } catch (err) {
        console.error("Failed to load fighter live details", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
        {/* Physical Attributes Skeleton */}
        <Card className="glass-panel overflow-hidden border-white/10 bg-card/20 backdrop-blur-sm animate-pulse">
          <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center">
              <span className="w-1.5 h-6 bg-primary/40 mr-3 rounded-full"></span>
              Physical Attributes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0 border-border/20">
                <div className="w-20 h-4 bg-muted/20 rounded-md" />
                <div className="w-12 h-6 bg-muted/30 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Method of Victory Skeleton */}
        <Card className="glass-panel overflow-hidden border-white/10 bg-card/20 backdrop-blur-sm animate-pulse">
          <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center">
              <span className="w-1.5 h-6 bg-primary/40 mr-3 rounded-full"></span>
              Method of Victory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0 border-border/20">
                <div className="w-28 h-4 bg-muted/20 rounded-md" />
                <div className="w-10 h-8 bg-muted/30 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeDetails = details || {
    age: null,
    height: null,
    reach: null,
    koWins: 0,
    subWins: 0,
    wins: initialWins,
    losses: initialLosses,
    draws: initialDraws,
  };

  const decisionWins = Math.max(0, activeDetails.wins - activeDetails.koWins - activeDetails.subWins);

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Physical Attributes Card */}
      <Card className="glass-panel overflow-hidden border-white/10 hover:border-primary/20 transition-all duration-300">
        <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
          <CardTitle className="text-2xl font-black tracking-tight flex items-center">
            <span className="w-1.5 h-6 bg-primary mr-3 rounded-full shadow-[0_0_10px_rgba(210,40,40,0.6)]"></span>
            Physical Attributes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ul className="space-y-6">
            <li className="flex justify-between items-center border-b pb-4 border-border/20">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Age</span>
              <span className="font-mono text-xl font-bold">{activeDetails.age || "N/A"}</span>
            </li>
            <li className="flex justify-between items-center border-b pb-4 border-border/20">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Height</span>
              <span className="font-mono text-xl font-bold">
                {activeDetails.height ? `${activeDetails.height}"` : "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Reach</span>
              <span className="font-mono text-xl font-bold">
                {activeDetails.reach ? `${activeDetails.reach}"` : "N/A"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Method of Victory Card */}
      <Card className="glass-panel overflow-hidden border-white/10 hover:border-primary/20 transition-all duration-300">
        <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
          <CardTitle className="text-2xl font-black tracking-tight flex items-center">
            <span className="w-1.5 h-6 bg-primary mr-3 rounded-full shadow-[0_0_10px_rgba(210,40,40,0.6)]"></span>
            Method of Victory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ul className="space-y-6">
            <li className="flex justify-between items-center border-b pb-4 border-border/20">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">KO/TKO</span>
              <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">
                {activeDetails.koWins}
              </span>
            </li>
            <li className="flex justify-between items-center border-b pb-4 border-border/20">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Submission</span>
              <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">
                {activeDetails.subWins}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Decision</span>
              <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">
                {decisionWins}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
