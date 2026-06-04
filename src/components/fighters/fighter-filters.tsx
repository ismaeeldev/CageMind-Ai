"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export function FighterFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStatus = searchParams.get("status") || "active";

  const handleStatusChange = useCallback((status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (status && status !== "active") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [pathname, replace, searchParams]);

  return (
    <div className="flex bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md self-start md:self-auto shrink-0">
      {[
        { id: "active", label: "Active" },
        { id: "retired", label: "Retired" },
        { id: "all", label: "All" }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleStatusChange(tab.id)}
          className={cn(
            "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
            currentStatus === tab.id
              ? "bg-primary text-white shadow-[0_0_15px_rgba(210,40,40,0.35)]"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
