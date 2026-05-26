import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EventsLoading() {
  return (
    <Container className="py-20">
      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 premium-gradient-text uppercase">Events Directory</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Stay up to date with the latest fight cards, live odds, and AI predictions.</p>
      </div>

      <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center gap-3 uppercase">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Upcoming Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-full bg-card/20 backdrop-blur-sm border-border/50 animate-pulse relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 z-10">
                <div className="w-16 h-6 bg-muted rounded-md" />
              </div>
              <CardHeader className="relative z-10 pt-8 pb-4">
                <div className="w-3/4 h-8 bg-muted rounded-md" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center text-sm bg-muted/10 p-2.5 rounded-lg border border-border/10">
                    <div className="w-16 h-4 bg-muted rounded-md mr-4" />
                    <div className="w-32 h-4 bg-muted rounded-md" />
                  </div>
                  <div className="flex items-center text-sm bg-muted/10 p-2.5 rounded-lg border border-border/10">
                    <div className="w-16 h-4 bg-muted rounded-md mr-4" />
                    <div className="w-24 h-4 bg-muted rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <h2 className="text-3xl font-black tracking-tighter mb-8 flex items-center uppercase text-muted-foreground">
          <span className="w-1.5 h-6 bg-muted-foreground/30 mr-4 rounded-full"></span>
          Past Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-full bg-card/20 backdrop-blur-sm border-border/50 animate-pulse relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 z-10">
                <div className="w-16 h-6 bg-muted rounded-md" />
              </div>
              <CardHeader className="relative z-10 pt-8 pb-4">
                <div className="w-3/4 h-8 bg-muted rounded-md" />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center text-sm bg-muted/10 p-2.5 rounded-lg border border-border/10">
                    <div className="w-16 h-4 bg-muted rounded-md mr-4" />
                    <div className="w-32 h-4 bg-muted rounded-md" />
                  </div>
                  <div className="flex items-center text-sm bg-muted/10 p-2.5 rounded-lg border border-border/10">
                    <div className="w-16 h-4 bg-muted rounded-md mr-4" />
                    <div className="w-24 h-4 bg-muted rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
