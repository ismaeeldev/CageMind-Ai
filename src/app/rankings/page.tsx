import { prisma } from "@/lib/db";
import { RankingsTable } from "./rankings-table";
import { Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  const fighters = await prisma.fighter.findMany({
    orderBy: {
      eloRating: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Global Elo Rankings
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              The world's most accurate MMA rating system, mathematically ranking every active fighter across all divisions.
            </p>
          </div>
        </div>

        <RankingsTable fighters={fighters} />
      </div>
    </div>
  );
}
