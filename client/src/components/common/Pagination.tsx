import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 my-8 text-text-primary">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised disabled:opacity-30 disabled:hover:bg-surface transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 text-[12px] font-mono font-medium rounded transition-colors ${
            currentPage === page
              ? 'bg-accent text-white'
              : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised disabled:opacity-30 disabled:hover:bg-surface transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
