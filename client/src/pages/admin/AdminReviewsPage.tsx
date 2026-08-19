import React, { useEffect, useState } from 'react';
import { Star, Download } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, statusFilter]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getReviews(ratingFilter, statusFilter, 1, 15);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async (reviewId: string, nextStatus: string) => {
    const reason = prompt(`Administrative reason for setting review status to ${nextStatus}:`) || `Moderated to ${nextStatus}`;
    if (!reason) return;

    try {
      await adminService.moderateReview(reviewId, nextStatus, reason);
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Moderation action failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Review Moderation Workspace
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Monitor customer reviews, flag inappropriate content, hide policy violations, and maintain marketplace trust
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => adminService.exportData('reviews')} className="text-xs">
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Reviews CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-bone border border-mist p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal-muted">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 bg-parchment border border-mist rounded-lg text-xs"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal-muted">Moderation Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-parchment border border-mist rounded-lg text-xs"
            >
              <option value="">All Statuses</option>
              <option value="VISIBLE">VISIBLE</option>
              <option value="FLAGGED">FLAGGED</option>
              <option value="HIDDEN">HIDDEN</option>
              <option value="RESTORED">RESTORED</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-bone border border-mist p-8 rounded-xl text-center text-xs text-charcoal-muted">
          No customer reviews match the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-bone border border-mist rounded-xl p-5 space-y-3 shadow-subtle">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-mist/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-sm">{r.customer?.name || r.customerName || 'Customer'}</span>
                    <span className="text-xs text-charcoal-muted">reviewed</span>
                    <span className="font-bold text-crimson text-sm">{r.provider?.user?.name || 'Provider'}</span>
                  </div>
                  <div className="text-[11px] text-mineral mt-0.5">Category: {r.workCategory} • Date: {new Date(r.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500 font-bold text-sm">
                    ★ {r.rating} / 5
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      r.moderationStatus === 'VISIBLE' || r.moderationStatus === 'RESTORED'
                        ? 'bg-seafoam/20 text-seafoam'
                        : r.moderationStatus === 'FLAGGED'
                        ? 'bg-amber-500/20 text-amber-900'
                        : 'bg-crimson/10 text-crimson'
                    }`}
                  >
                    {r.moderationStatus || 'VISIBLE'}
                  </span>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-xs text-charcoal italic">"{r.comment}"</p>

              {r.flaggedReason && (
                <div className="text-[11px] bg-parchment p-2 rounded text-crimson font-medium">
                  Flagged Reason: {r.flaggedReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2 text-xs">
                {r.moderationStatus !== 'FLAGGED' && (
                  <button
                    onClick={() => handleModerate(r._id, 'FLAGGED')}
                    className="px-3 py-1 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 rounded font-semibold"
                  >
                    Flag Review
                  </button>
                )}
                {r.moderationStatus !== 'HIDDEN' ? (
                  <button
                    onClick={() => handleModerate(r._id, 'HIDDEN')}
                    className="px-3 py-1 bg-crimson/10 text-crimson hover:bg-crimson hover:text-parchment rounded font-semibold"
                  >
                    Hide Review
                  </button>
                ) : (
                  <button
                    onClick={() => handleModerate(r._id, 'RESTORED')}
                    className="px-3 py-1 bg-seafoam text-parchment hover:bg-seafoam/90 rounded font-semibold"
                  >
                    Restore Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
