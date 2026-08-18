import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  max?: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  reviewCount,
  size = 'md',
  interactive = false,
  readOnly,
  onChange,
  showValue = true,
  className = '',
}) => {
  const isInteractive = readOnly ? false : interactive;
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const currentVal = hoverValue !== null ? hoverValue : value;

  return (
    <div className={`inline-flex items-center gap-1.5 font-sans ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.floor(currentVal);
          const isHalf = !isFilled && starNumber === Math.ceil(currentVal) && currentVal % 1 !== 0;

          return (
            <button
              key={index}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange?.(starNumber)}
              onMouseEnter={() => isInteractive && setHoverValue(starNumber)}
              onMouseLeave={() => isInteractive && setHoverValue(null)}
              className={`${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform p-0.5`}
              aria-label={`Rate ${starNumber} out of ${max}`}
            >
              <Star
                className={`
                  ${starSizes[size]} transition-colors duration-150
                  ${isFilled || isHalf ? 'fill-clay text-clay' : 'fill-mist/40 text-mist-dark'}
                `}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-charcoal ml-0.5">
          {value.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-charcoal-subtle">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
