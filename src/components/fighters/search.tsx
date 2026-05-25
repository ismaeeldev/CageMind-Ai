"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Input
        type="search"
        placeholder="Search fighters by name..."
        className="w-full max-w-md"
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && <span className="absolute right-3 top-2 text-xs text-muted-foreground">Loading...</span>}
    </div>
  );
}
