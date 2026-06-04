"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/toast";

interface PremiumLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function PremiumLink({ href, children, className = "" }: PremiumLinkProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const isPremium = session?.user?.isPremium === true;

    if (!isPremium) {
      let featureName = "AI Betting Edge";
      if (href.includes("matchup")) {
        featureName = "Matchup Lab";
      } else if (href.includes("predictions")) {
        featureName = "Predictions";
      } else if (href.includes("past-events") || href.includes("performance")) {
        featureName = "Past Event Results";
      }
      toast(`First upgrade to Premium to access ${featureName}!`, "error");
      
      // Delay navigation slightly so the user sees the toast
      setTimeout(() => {
        router.push("/pricing");
      }, 800);
    } else {
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
