import React, { useState } from 'react';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { Alert } from '../ui/FeedbackComponents';
import { Send } from 'lucide-react';

export interface ReviewSubmissionFormProps {
  bookingId: string;
  providerName: string;
  onSubmitReview: (rating: number, comment: string) => Promise<void>;
  className?: string;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  bookingId,
  providerName,
  onSubmitReview,
  className = '',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please enter a brief written review.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onSubmitReview(rating, comment.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="Review Submitted">
        Thank you for reviewing your service experience with {providerName}! Your feedback helps maintain community trust.
      </Alert>
    );
  }

  return (
    <div data-booking-id={bookingId} className={`p-6 bg-bone rounded-lg border border-mist font-sans space-y-4 ${className}`}>
      <div>
        <h4 className="font-serif text-xl text-ink font-normal mb-1">How was your service experience?</h4>
        <p className="text-xs text-charcoal-subtle">
          Leave an unedited rating & review for <strong>{providerName}</strong>.
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted block">
            Overall Rating
          </label>
          <Rating value={rating} interactive onChange={setRating} size="lg" showValue={true} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Written Feedback
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Share details about your service with ${providerName}...`}
            className="w-full p-3 bg-parchment border border-mist rounded text-xs text-charcoal focus:outline-none focus:border-mineral"
            required
          />
        </div>

        <Button type="submit" variant="cta" size="md" isLoading={isLoading} leftIcon={<Send className="w-4 h-4" />}>
          Submit Verified Review
        </Button>
      </form>
    </div>
  );
};
