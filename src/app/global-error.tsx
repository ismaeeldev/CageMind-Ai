"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#18181B] text-zinc-100 flex items-center justify-center min-h-screen">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <div className="inline-flex items-center justify-center p-4 bg-[#D22828]/10 rounded-full mb-6">
            <AlertTriangle className="w-10 h-10 text-[#D22828]" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Critical System Error</h2>
          <p className="text-zinc-400 mb-8">A fatal error occurred. We have logged the trace for our engineering team.</p>
          
          <button
            onClick={() => reset()}
            className="w-full bg-[#D22828] hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wider transition-colors"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
