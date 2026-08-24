import React from 'react';
import { Star } from 'lucide-react';

export interface RatingStarsProps {
  rating: number;
  count?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  showScore = true,
  size = 'md',
  interactive = false,
  onRate,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1.5 text-text-primary">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <button
              key={star}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRate?.(star)}
              className={interactive ? 'cursor-pointer hover:scale-110 transition-transform p-0.5' : 'cursor-default'}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-border fill-surface-raised'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-mono font-medium text-text-primary">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-text-muted font-normal">
          ({count})
        </span>
      )}
    </div>
  );
};
