"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button variant="outline" disabled={currentPage <= 1} asChild={currentPage > 1}>
        {currentPage > 1 ? <Link href={createPageURL(currentPage - 1)}>Previous</Link> : <span>Previous</span>}
      </Button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
      </span>

      <Button variant="outline" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
        {currentPage < totalPages ? <Link href={createPageURL(currentPage + 1)}>Next</Link> : <span>Next</span>}
      </Button>
    </div>
  );
}
