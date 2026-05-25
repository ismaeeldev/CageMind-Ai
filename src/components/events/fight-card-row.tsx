import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Prisma } from "@/generated/prisma";

type FightWithFighters = Prisma.FightGetPayload<{
  include: {
    fighter1: true;
    fighter2: true;
  };
}>;

export function FightCardRow({ fight, index }: { fight: FightWithFighters; index: number }) {
  const isMainEvent = index === 0;

  return (
    <div className={`p-4 sm:p-6 flex flex-col gap-5 border-b border-border/30 last:border-0 hover:bg-white/[0.02] transition-colors duration-300 ${isMainEvent ? 'bg-primary/5' : ''}`}>
      <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span>{fight.weightClass} {fight.isTitleFight ? 'Title Bout' : 'Bout'}</span>
        {isMainEvent && <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_-2px_rgba(210,40,40,0.3)]">Main Event</Badge>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* Fighter 1 */}
        <div className="text-right flex flex-col group/fighter">
          <Link href={`/fighters/${fight.fighter1.id}`} className="text-2xl sm:text-3xl font-black hover:text-primary transition-colors tracking-tight">
            {fight.fighter1.name}
          </Link>
          <div className="text-sm text-muted-foreground mt-2 font-mono">
            {fight.oddsFighter1 ? (
              <span className={`px-2 py-1 rounded-md bg-muted/30 border border-border/30 inline-block ${fight.oddsFighter1 < 0 ? "text-foreground font-bold shadow-inner" : ""}`}>
                {fight.oddsFighter1 > 0 ? `+${fight.oddsFighter1}` : fight.oddsFighter1}
              </span>
            ) : "N/A"}
          </div>
        </div>

        {/* VS */}
        <div className="text-sm font-black text-muted-foreground px-4 italic opacity-50">
          VS
        </div>

        {/* Fighter 2 */}
        <div className="text-left flex flex-col group/fighter">
          <Link href={`/fighters/${fight.fighter2.id}`} className="text-2xl sm:text-3xl font-black hover:text-primary transition-colors tracking-tight">
            {fight.fighter2.name}
          </Link>
          <div className="text-sm text-muted-foreground mt-2 font-mono">
            {fight.oddsFighter2 ? (
              <span className={`px-2 py-1 rounded-md bg-muted/30 border border-border/30 inline-block ${fight.oddsFighter2 < 0 ? "text-foreground font-bold shadow-inner" : ""}`}>
                {fight.oddsFighter2 > 0 ? `+${fight.oddsFighter2}` : fight.oddsFighter2}
              </span>
            ) : "N/A"}
          </div>
        </div>
      </div>

      {fight.aiPrediction && !fight.method && (
        <div className="mt-3 flex justify-center">
           <Badge variant="premium" className="bg-premium/10 text-premium border border-premium/30 px-3 py-1 shadow-none">
              AI Prediction: {fight.aiPrediction} ({fight.aiConfidence}% Conf)
           </Badge>
        </div>
      )}

      {fight.method && (
        <div className="mt-4 text-center text-sm border border-border/30 bg-muted/10 py-3 rounded-xl backdrop-blur-sm">
          <span className="font-bold text-foreground tracking-wide uppercase text-xs mr-2 text-primary/80">Result: </span>
          <span className="font-medium text-foreground">
            {fight.winnerId === fight.fighter1.id ? fight.fighter1.name : fight.fighter2.name} 
          </span>
          <span className="text-muted-foreground ml-1">
            def. via {fight.method} (R{fight.endingRound}, {fight.endingTime})
          </span>
        </div>
      )}
    </div>
  );
}
