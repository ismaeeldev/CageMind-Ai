"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      
      if (response.status === 401) {
        window.location.href = "/login?callbackUrl=/pricing";
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to subscribe", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="premium" 
      size="lg" 
      onClick={handleSubscribe} 
      disabled={loading}
      className="w-full text-base font-bold shadow-[0_0_15px_rgba(202,138,4,0.4)]"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        "Subscribe to Premium"
      )}
    </Button>
  );
}
