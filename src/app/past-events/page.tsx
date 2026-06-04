"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { PerformanceDashboard } from "@/components/performance/performance-dashboard";

export default function PerformancePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isPremium = session?.user?.isPremium === true;

  const [perfData, setPerfData] = useState<{
    allStats: any;
    highConfStats: any;
  } | null>(null);
  const [perfLoading, setPerfLoading] = useState(false);

  useEffect(() => {
    if (status !== "loading" && !isPremium) {
      router.push("/pricing?reason=premium");
    }
  }, [status, isPremium, router]);

  useEffect(() => {
    if (isPremium && !perfData) {
      setPerfLoading(true);
      fetch("/api/performance")
        .then((res) => res.json())
        .then((data) => {
          if (data.allStats) setPerfData(data);
        })
        .catch(console.error)
        .finally(() => setPerfLoading(false));
    }
  }, [isPremium, perfData]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#18181B] text-zinc-100 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 font-mono">Verifying authorization credentials...</div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-[#18181B] text-zinc-100 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500 font-mono">Verifying authorization credentials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2 flex items-center gap-3">
            <Activity className="w-9 h-9 text-purple-400" />
            Past Event Results
          </h1>
          <p className="text-zinc-400 text-lg">
            Track the model's graded pick history and past performance metrics.
          </p>
        </div>

        {perfLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-pulse text-zinc-500 font-mono">Loading historical data...</div>
          </div>
        ) : perfData ? (
          <PerformanceDashboard
            allStats={perfData.allStats}
            highConfStats={perfData.highConfStats}
          />
        ) : (
          <div className="flex items-center justify-center py-32">
            <div className="text-zinc-600 font-mono">Failed to load past event data.</div>
          </div>
        )}

      </div>
    </div>
  );
}
