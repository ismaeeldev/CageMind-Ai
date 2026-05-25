import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Container className="py-20">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome, {session.user?.name || "Fighter"}</h1>
        <p className="text-muted-foreground">Manage your Octagon AI account and predictions.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>My Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You haven't made any predictions yet. (Placeholder)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Name:</strong> {session.user?.name || "N/A"}</li>
              <li><strong className="text-foreground">Email:</strong> {session.user?.email || "N/A"}</li>
              <li><strong className="text-foreground">Status:</strong> Free Tier</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
