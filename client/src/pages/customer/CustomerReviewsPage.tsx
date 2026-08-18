import React, { useEffect, useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Review, Booking } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Rating } from '../../components/ui/Rating';

export const CustomerReviewsPage: React.FC = () => {
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [eligibleBookings, setEligibleBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getReviews();
      setSubmittedReviews(data?.submittedReviews || []);
      setEligibleBookings(data?.eligibleBookings || []);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !comment) return;
    setSubmitting(true);
    try {
      await customerApi.createReview({
        bookingId: selectedBooking.id,
        rating,
        comment,
        workCategory: selectedBooking.service?.title || 'General Service',
      });
      await fetchReviewsData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-32 bg-bone rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Reviews & Feedback</h1>
        <p className="text-sm text-charcoal-muted mt-1">Share your experience to help local professionals maintain high standards.</p>
      </div>

      {/* 1. ELIGIBLE REVIEWS / REVIEW REMINDER SECTION */}
      {eligibleBookings.length > 0 && (
        <div className="bg-bone border-2 border-brand/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5" /> How did it go?
          </h2>

          <div className="space-y-3">
            {eligibleBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-parchment/60 border border-mist rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">{b.service?.title || 'Completed Job'}</h3>
                  <p className="text-xs text-charcoal">
                    with{' '}
                    <span className="font-semibold text-brand">
                      {b.provider?.user?.name || b.provider?.businessName || 'Rajesh Kumar'}
                    </span>{' '}
                    · Completed on {b.completedAt ? new Date(b.completedAt).toLocaleDateString() : b.scheduledDate}
                  </p>
                </div>

                <Button variant="primary" size="sm" onClick={() => openReviewModal(b)}>
                  <Star className="w-3.5 h-3.5 mr-1.5" /> Leave a Review
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SUBMITTED REVIEWS LIST */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle">Your Submitted Reviews</h2>

        {submittedReviews.length > 0 ? (
          <div className="space-y-4">
            {submittedReviews.map((rev) => (
              <div key={rev.id} className="bg-bone border border-mist rounded-xl p-5 shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand uppercase tracking-wider block">{rev.workCategory}</span>
                    <span className="text-xs text-charcoal-muted">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Rating value={rev.rating} size="sm" readOnly />
                </div>

                <p className="text-sm text-ink italic bg-parchment/40 p-3 rounded-lg border border-mist/60">"{rev.comment}"</p>

                {rev.providerResponse && (
                  <div className="ml-4 p-3 bg-mist/30 border-l-2 border-brand rounded-r-lg space-y-1">
                    <span className="text-xs font-bold text-slate block">Provider Response</span>
                    <p className="text-xs text-charcoal">{rev.providerResponse.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bone border border-mist rounded-xl p-12 text-center text-charcoal-muted">
            <p className="text-sm">No reviews submitted yet.</p>
          </div>
        )}
      </div>

      {/* LEAVE REVIEW MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Leave a Service Review">
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div>
            <p className="text-sm font-bold text-ink">{selectedBooking?.service?.title}</p>
            <p className="text-xs text-charcoal-muted">
              with {selectedBooking?.provider?.user?.name || selectedBooking?.provider?.businessName}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Your Overall Rating
            </label>
            <Rating value={rating} onChange={(val) => setRating(val)} size="lg" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Your Review / Experience
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Describe the punctuality, quality of work, cleanliness, and professionalism..."
              className="w-full p-3 rounded-lg border border-mist bg-bone text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-mist">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerReviewsPage;
