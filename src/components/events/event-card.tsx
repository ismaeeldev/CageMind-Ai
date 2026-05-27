import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Event } from "@/generated/prisma";


export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <Card className="h-[250px] flex flex-col justify-between bg-card/40 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(210,40,40,0.15)] hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 z-10">
          {event.isUpcoming ? (
            <Badge variant="default" className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-[0_0_10px_-2px_rgba(210,40,40,0.3)]">
              Upcoming
            </Badge>
          ) : (
            <Badge variant="outline" className="border-border/50 text-muted-foreground bg-black/20 backdrop-blur-md">
              Past
            </Badge>
          )}
        </div>
        
        {/* Subtle background glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md pointer-events-none"></div>

        <CardHeader className="relative z-10">
          <CardTitle className="text-xl md:text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300 pr-16">
            {event.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-sm bg-muted/20 p-2.5 rounded-lg border border-border/30">
              <span className="text-muted-foreground w-16 text-xs uppercase tracking-wider font-bold">Date</span>
              <span className="font-semibold text-foreground font-mono">
                {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(event.date))}
              </span>
            </div>
            <div className="flex items-center text-sm bg-muted/20 p-2.5 rounded-lg border border-border/30">
              <span className="text-muted-foreground w-16 text-xs uppercase tracking-wider font-bold">Venue</span>
              <span className="font-semibold text-foreground">{event.location || "TBA"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
