"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback, useRef } from "react";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((term: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);
  }, [pathname, replace, searchParams]);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Input
        type="search"
        placeholder="Search fighters by name..."
        className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors"
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
