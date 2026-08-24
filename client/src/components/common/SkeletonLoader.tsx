import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-surface border border-border rounded-card overflow-hidden animate-pulse flex flex-col h-full">
    <div className="aspect-[4/3] bg-surface-raised w-full" />
    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
      <div className="flex flex-col gap-2">
        <div className="h-3 bg-surface-raised rounded w-1/3" />
        <div className="h-4 bg-surface-raised rounded w-4/5" />
        <div className="h-3 bg-surface-raised rounded w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="h-5 bg-surface-raised rounded w-24" />
        <div className="h-8 bg-surface-raised rounded w-8" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="border-b border-border animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-surface-raised rounded w-3/4" />
      </td>
    ))}
  </tr>
);
