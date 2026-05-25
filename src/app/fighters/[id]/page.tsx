import { getFighterById } from "@/actions/fighters";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function FighterDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const fighter = await getFighterById(params.id);

  if (!fighter) {
    notFound();
  }

  return (
    <Container className="py-12 md:py-20 animate-in fade-in duration-700">
      <div className="mb-12">
        <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-primary transition-all hover:-translate-x-1 font-bold uppercase tracking-widest text-xs">
          <Link href="/fighters">← Back to Fighters</Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-sm">{fighter.name}</h1>
            <div className="flex gap-4 items-center">
              <Badge variant="outline" className="text-sm border-white/20 bg-black/20 backdrop-blur-md px-4 py-1.5 font-bold uppercase tracking-widest shadow-sm">
                {fighter.weightClass || "Unranked"}
              </Badge>
              <Badge variant="default" className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-[0_0_15px_-3px_rgba(210,40,40,0.4)] text-sm px-4 py-1.5 font-mono">
                Elo: {fighter.eloRating}
              </Badge>
            </div>
          </div>
          <div className="text-left md:text-right bg-muted/10 p-6 rounded-2xl border border-border/30 backdrop-blur-sm shadow-xl min-w-[200px]">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Pro Record</p>
            <p className="text-5xl font-black font-mono tracking-tighter">
              {fighter.wins}<span className="text-muted-foreground opacity-50 mx-1">-</span>{fighter.losses}<span className="text-muted-foreground opacity-50 mx-1">-</span>{fighter.draws}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <Card className="glass-panel overflow-hidden border-white/10">
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
                <span className="font-mono text-xl font-bold">{fighter.age || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center border-b pb-4 border-border/20">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Height</span>
                <span className="font-mono text-xl font-bold">{fighter.height ? `${fighter.height}"` : "N/A"}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Reach</span>
                <span className="font-mono text-xl font-bold">{fighter.reach ? `${fighter.reach}"` : "N/A"}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-panel overflow-hidden border-white/10">
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
                <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">{fighter.koWins}</span>
              </li>
              <li className="flex justify-between items-center border-b pb-4 border-border/20">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Submission</span>
                <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">{fighter.subWins}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Decision</span>
                <span className="font-mono text-2xl font-black text-primary drop-shadow-[0_0_8px_rgba(210,40,40,0.5)]">{fighter.wins - fighter.koWins - fighter.subWins}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
