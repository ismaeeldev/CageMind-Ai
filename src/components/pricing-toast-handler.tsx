"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";

function ToastHandlerInner() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "premium") {
      toast("First upgrade to Premium to access this feature!", "error");
    }
  }, [searchParams, toast]);

  return null;
}

export function PricingToastHandler() {
  return (
    <Suspense fallback={null}>
      <ToastHandlerInner />
    </Suspense>
  );
}
