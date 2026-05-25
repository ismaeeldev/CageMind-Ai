"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button variant="ghost" disabled>Loading...</Button>;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Button variant="outline" onClick={() => signOut()}>
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/login" className="hidden md:flex">
        <Button variant="ghost">Log in</Button>
      </Link>
      <Link href="/register">
        <Button variant="default">Sign up</Button>
      </Link>
    </div>
  );
}
