import { Suspense } from "react";
import { getFighters } from "@/actions/fighters";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search } from "@/components/fighters/search";
import { Pagination } from "@/components/fighters/pagination";

function FighterListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="h-full bg-card/20 backdrop-blur-sm border-border/50 animate-pulse relative overflow-hidden">
          <CardHeader className="pb-4 relative z-10 border-b border-border/30 bg-muted/10 h-[68px]">
            <div className="w-2/3 h-6 bg-muted rounded-md" />
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="w-12 h-4 bg-muted rounded-md" />
                <div className="w-16 h-4 bg-muted rounded-md" />
              </div>
              <div className="flex justify-between items-center">
                <div className="w-14 h-4 bg-muted rounded-md" />
                <div className="w-12 h-4 bg-muted rounded-md" />
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
                <div className="w-8 h-4 bg-muted rounded-md" />
                <div className="w-10 h-6 bg-muted rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function FighterList({ query, page }: { query: string; page: number }) {
  const { fighters, totalPages } = await getFighters({ query, page });

  if (fighters.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground italic glass-panel rounded-2xl">
        No fighters found matching "{query}".
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        {fighters.map((fighter, i) => (
          <Link key={fighter.id} href={`/fighters/${fighter.id}`} className="group block" style={{ animationDelay: `${i * 50}ms` }}>
            <Card className="h-full bg-card/40 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(210,40,40,0.15)] hover:-translate-y-1 hover:border-primary/30 relative overflow-hidden group-hover:scale-[1.02]">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-md pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10 border-b border-border/30 bg-muted/10">
                <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                  {fighter.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Class</span>
                    <span className="font-semibold text-foreground">{fighter.weightClass || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold">Record</span>
                    <span className="font-mono font-bold text-base">
                      {fighter.wins}-{fighter.losses}-{fighter.draws}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
                    <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Elo</span>
                    <Badge variant="default" className="bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_-2px_rgba(210,40,40,0.3)] font-mono text-sm px-2">
                      {fighter.eloRating}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} />}
    </>
  );
}

export default async function FightersPage(props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  const page = Number(searchParams?.page) || 1;

  return (
    <Container className="py-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 premium-gradient-text uppercase">Fighter Directory</h1>
          <p className="text-lg text-muted-foreground">Browse all fighters, analyze physical attributes, and track Elo ratings.</p>
        </div>
        <Search />
      </div>

      <Suspense key={query + page} fallback={<FighterListSkeleton />}>
        <FighterList query={query} page={page} />
      </Suspense>
    </Container>
  );
}
