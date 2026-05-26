"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real production app, log this to Sentry, Datadog, etc.
    console.error("Production Error Caught by Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#18181B] text-zinc-100 p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-[#D22828]/10 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-[#D22828]" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Something went wrong</h2>
        <p className="text-zinc-400 mb-8">We apologize for the inconvenience. Our automated monitoring has logged this issue.</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#D22828] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
