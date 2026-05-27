import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ManageBillingButton } from "@/components/stripe/manage-billing-button";
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BillingSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/settings/billing");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isPremium = 
    subscription?.status === "active" && 
    subscription.currentPeriodEnd && 
    subscription.currentPeriodEnd.getTime() > Date.now();

  const isCanceled = subscription?.status === "canceled";

  return (
    <Container className="py-20 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your Octagon AI profile, security, and subscription details.
          </p>
        </div>

        <Card className="glass-panel border-border/50 relative overflow-hidden mb-8">
          <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight">Account Profile</CardTitle>
            <CardDescription>Your personal information and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Name</p>
                  <p className="text-lg font-bold">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Email Address</p>
                  <p className="text-lg font-bold">{session.user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[200px]">
                <ChangePasswordDialog />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50 relative overflow-hidden mb-8">
          <CardHeader className="bg-muted/10 border-b border-border/30 pb-6">
            <CardTitle className="text-2xl font-black tracking-tight">Current Plan</CardTitle>
            <CardDescription>Your current subscription status.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {isPremium ? "Octagon AI Premium" : "Free Tier"}
                </h3>
                
                {isPremium ? (
                  <div className="flex items-center gap-3 mt-4">
                    <Badge variant="premium" className="px-3 py-1 text-xs shadow-none">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      Renews on {subscription?.currentPeriodEnd && new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                ) : isCanceled ? (
                  <div className="flex items-center gap-3 mt-4">
                    <Badge variant="destructive" className="px-3 py-1 text-xs shadow-none">Canceled</Badge>
                    <span className="text-sm text-muted-foreground">
                      Your subscription has been canceled.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-4">
                    <Badge variant="outline" className="px-3 py-1 text-xs shadow-none bg-muted/50 border-border/50">Free</Badge>
                    <span className="text-sm text-muted-foreground">
                      You are currently on the free tier.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                {subscription?.stripeCustomerId ? (
                  <ManageBillingButton />
                ) : (
                  <Button asChild variant="premium" className="w-full">
                    <Link href="/pricing">Upgrade to Premium</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
