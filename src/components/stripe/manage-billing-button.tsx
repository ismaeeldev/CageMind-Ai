"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to redirect to billing portal", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleManage} 
      disabled={loading}
      className="w-full text-base"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Portal...
        </>
      ) : (
        "Manage Subscription"
      )}
    </Button>
  );
}
