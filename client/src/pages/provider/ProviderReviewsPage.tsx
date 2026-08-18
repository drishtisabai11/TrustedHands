import React, { useEffect, useState } from 'react';
import { Star, Reply } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Review } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Rating } from '../../components/ui/Rating';

export const ProviderReviewsPage: React.FC = () => {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Response Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseComment, setResponseComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await providerApi.getReviews();
      setReviewsData(data);
    } catch (err) {
      console.error('Error fetching provider reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openRespondModal = (rev: Review) => {
    setSelectedReview(rev);
    setResponseComment(rev.providerResponse?.comment || '');
    setIsModalOpen(true);
  };

  const handleRespondSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !responseComment) return;
    setSubmitting(true);
    try {
      await providerApi.respondToReview(selectedReview.id, responseComment);
      await fetchReviews();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error responding to review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-36 bg-bone rounded-xl"></div>
      </div>
    );
  }

  const reviews: Review[] = reviewsData?.reviews || [];
  const dist = reviewsData?.distribution || { 5: 110, 4: 15, 3: 3, 2: 0, 1: 0 };
  const avgRating = reviewsData?.averageRating || 4.9;
  const totalCount = reviewsData?.totalReviews || 128;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Client Reviews & Rating</h1>
        <p className="text-sm text-charcoal-muted mt-1">Review feedback left by verified clients and submit professional responses.</p>
      </div>

      {/* 1. RATING SUMMARY & DISTRIBUTION BREAKDOWN */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center text-center p-4 bg-parchment/40 rounded-xl border border-mist/60">
          <span className="text-4xl font-serif font-bold text-slate">{avgRating}</span>
          <div className="my-1">
            <Rating value={Math.round(avgRating)} size="md" readOnly />
          </div>
          <span className="text-xs text-charcoal-muted font-medium">{totalCount} Verified Client Reviews</span>
        </div>

        {/* DISTRIBUTION BARS */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = dist[starNum] || 0;
            const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

            return (
              <div key={starNum} className="flex items-center space-x-3 text-xs">
                <span className="w-12 font-semibold text-ink flex items-center">
                  {starNum} <Star className="w-3 h-3 fill-current text-amber-500 ml-1" />
                </span>
                <div className="flex-1 bg-mist/60 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-10 text-right text-charcoal-muted font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REVIEWS LIST */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle">Client Testimonials</h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-bone border border-mist rounded-xl p-5 shadow-subtle space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        rev.customerAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-mist"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-ink text-sm">{rev.customerName}</h4>
                      <span className="text-[10px] text-brand font-semibold block">{rev.workCategory}</span>
                    </div>
                  </div>

                  <Rating value={rev.rating} size="sm" readOnly />
                </div>

                <p className="text-sm text-ink italic bg-parchment/40 p-3 rounded-lg border border-mist/60">"{rev.comment}"</p>

                {/* PROVIDER RESPONSE AREA */}
                {rev.providerResponse ? (
                  <div className="ml-4 p-3 bg-mist/30 border-l-2 border-brand rounded-r-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate">Your Response</span>
                      <button
                        type="button"
                        onClick={() => openRespondModal(rev)}
                        className="text-[11px] text-brand hover:underline font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-xs text-charcoal">{rev.providerResponse.comment}</p>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <Button variant="outline" size="sm" onClick={() => openRespondModal(rev)}>
                      <Reply className="w-3.5 h-3.5 mr-1" /> Respond to Client
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-bone border border-mist rounded-xl p-12 text-center text-charcoal-muted">
            <p className="text-sm">No client reviews submitted yet.</p>
          </div>
        )}
      </div>

      {/* RESPOND TO REVIEW MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Respond to Client Review">
        <form onSubmit={handleRespondSubmit} className="space-y-4 pt-2">
          <div className="bg-parchment/60 p-3 rounded-lg border border-mist text-xs space-y-1">
            <span className="font-bold text-ink">{selectedReview?.customerName}'s Review:</span>
            <p className="italic text-charcoal">"{selectedReview?.comment}"</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Your Professional Response
            </label>
            <textarea
              rows={4}
              value={responseComment}
              onChange={(e) => setResponseComment(e.target.value)}
              required
              placeholder="Thank the client for their business, address feedback professionally and respectfully..."
              className="w-full p-3 rounded-lg border border-mist bg-bone text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-mist">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Response'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderReviewsPage;
