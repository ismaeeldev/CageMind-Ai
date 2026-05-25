import { getEventById } from "@/actions/events";
import { Container } from "@/components/layout/container";
import { FightCardRow } from "@/components/events/fight-card-row";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) return { title: "Event Not Found" };
  
  return {
    title: `${event.name} | Octagon AI`,
    description: `Fight card and details for ${event.name}`,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const { fights } = event;

  return (
    <Container className="py-12 md:py-20 animate-in fade-in duration-700">
      <div className="mb-10">
        <Link href="/events" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <div>
          <div className="flex items-center gap-3 mb-6">
            {event.isUpcoming ? (
              <Badge className="bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-3px_rgba(210,40,40,0.4)] px-3 py-1 text-xs">Upcoming Event</Badge>
            ) : (
              <Badge variant="outline" className="border-border/50 text-muted-foreground bg-black/20 backdrop-blur-md px-3 py-1 text-xs">Past Event</Badge>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 drop-shadow-sm">
            {event.name}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-muted-foreground bg-muted/10 p-4 rounded-xl border border-border/30 backdrop-blur-sm w-fit">
            <div className="flex items-center">
              <span className="font-bold text-foreground mr-2 uppercase tracking-wider text-xs opacity-70">Date</span>
              <span className="font-mono">{new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(event.date))}</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border/50"></div>
            <div className="flex items-center">
              <span className="font-bold text-foreground mr-2 uppercase tracking-wider text-xs opacity-70">Location</span>
              <span className="font-medium">{event.location || "TBA"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center uppercase">
          <span className="w-1.5 h-6 bg-primary mr-4 rounded-full shadow-[0_0_10px_rgba(210,40,40,0.6)]"></span>
          Fight Card
        </h2>
        
        {fights.length === 0 ? (
          <div className="text-muted-foreground italic glass-panel p-16 rounded-2xl text-center flex flex-col items-center justify-center">
            <span className="block text-4xl mb-4 opacity-50">🥊</span>
            No fights have been announced for this event yet.
          </div>
        ) : (
          <Card className="overflow-hidden border-white/10 shadow-2xl glass-panel p-1 md:p-2 rounded-[20px]">
             <div className="bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden">
                {fights.map((fight, index) => (
                  <FightCardRow key={fight.id} fight={fight} index={index} />
                ))}
             </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
