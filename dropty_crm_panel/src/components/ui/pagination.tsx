"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 mt-4",
        className
      )}
    >
      {/* Previous */}
      <Button
        variant="ghost"
        
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
         
          variant={page === currentPage ? "ghost" : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Next */}
      <Button
        variant="ghost"
       
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
