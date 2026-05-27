import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600; // Cache for 1 hour

export default async function EventPage({ params }: EventPageProps) {
  // Await the params due to Next.js 15+ dynamic route changes in Turbopack/App router
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      fights: {
        include: {
          fighter1: true,
          fighter2: true
        },
        orderBy: [
          { isTitleFight: 'desc' }
        ]
      }
    }
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 mt-16 max-w-7xl mx-auto">
      
      {/* Event Header */}
      <div className="mb-12 text-center md:text-left">
        <Badge variant={event.isUpcoming ? "default" : "secondary"} className="mb-4">
          {event.isUpcoming ? "Upcoming Event" : "Past Event"}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 premium-gradient-text">
          {event.name}
        </h1>
        <div className="flex flex-col md:flex-row items-center md:justify-start gap-4 text-muted-foreground text-lg">
          <span className="flex items-center gap-2">
            📅 {format(new Date(event.date), "MMMM do, yyyy")}
          </span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            📍 {event.location || "TBD"}
          </span>
        </div>
      </div>

      {/* Fight Card */}
      <div className="space-y-16">
        
        {event.fights.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-6 border-b border-border pb-2">
              Fight Card
            </h2>
            <div className="grid gap-4">
              {event.fights.map(fight => (
                <FightRow key={fight.id} fight={fight} />
              ))}
            </div>
          </section>
        )}

        {event.fights.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fight Card Not Yet Available</h3>
            <p>The fights for this event have not been finalized or scraped yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FightRow({ fight }: { fight: any }) {
  return (
    <Card className="hover:border-primary/50 transition-colors group">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center justify-between p-6">
          
          {/* Fighter 1 */}
          <div className="flex-1 text-center md:text-right w-full">
            <Link href={`/fighters/${fight.fighter1.id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="text-2xl font-black uppercase tracking-tight">{fight.fighter1.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {fight.fighter1.wins}-{fight.fighter1.losses}-{fight.fighter1.draws}
              </p>
            </Link>
          </div>

          {/* VS Divider */}
          <div className="flex-shrink-0 px-8 py-4 md:py-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground mb-1">VS</span>
            <div className="h-px w-full md:h-12 md:w-px bg-border"></div>
          </div>

          {/* Fighter 2 */}
          <div className="flex-1 text-center md:text-left w-full">
            <Link href={`/fighters/${fight.fighter2.id}`} className="block group-hover:text-primary transition-colors">
              <h3 className="text-2xl font-black uppercase tracking-tight">{fight.fighter2.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {fight.fighter2.wins}-{fight.fighter2.losses}-{fight.fighter2.draws}
              </p>
            </Link>
          </div>

        </div>

        {/* Fight Details Footer */}
        <div className="bg-muted/50 py-3 px-6 text-center border-t text-sm font-medium tracking-wide flex justify-center gap-4 flex-wrap">
          {fight.isTitleFight && (
            <span className="text-primary flex items-center gap-1">
              🏆 Title Bout
            </span>
          )}
          <span>{fight.weightClass || "Catchweight"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
