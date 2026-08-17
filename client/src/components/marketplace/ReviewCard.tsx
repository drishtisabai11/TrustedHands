import React from 'react';
import { Review } from '../../types';
import { Rating } from '../ui/Rating';
import { Avatar } from '../ui/Avatar';
import { ShieldCheck } from 'lucide-react';

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`p-5 bg-bone rounded-lg border border-mist font-sans space-y-3 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={review.customerName} src={review.customerAvatar} size="sm" />
          <div>
            <h5 className="font-semibold text-sm text-ink">{review.customerName}</h5>
            <span className="text-[11px] text-charcoal-subtle">{formattedDate}</span>
          </div>
        </div>
        <Rating value={review.rating} size="sm" showValue={false} />
      </div>

      <p className="text-xs text-charcoal leading-relaxed">{review.comment}</p>

      <div className="pt-2 border-t border-mist/60 flex items-center justify-between text-[11px] text-charcoal-subtle">
        <span className="font-medium text-mineral">{review.workCategory}</span>
        {review.isVerifiedPurchase && (
          <span className="flex items-center gap-1 text-slate font-medium">
            <ShieldCheck className="w-3 h-3 text-mineral" /> Verified Booking
          </span>
        )}
      </div>
    </div>
  );
};
