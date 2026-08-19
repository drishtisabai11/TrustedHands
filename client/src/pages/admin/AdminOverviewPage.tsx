import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Star,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminOverview } from '../../types';
import Button from '../../components/ui/Button';

export const AdminOverviewPage: React.FC = () => {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setIsLoading(true);
      try {
        const data = await adminService.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to fetch admin overview:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 font-sans">
        <div className="h-8 bg-mist/40 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-bone border border-mist rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const attention = overview?.attention || {
    pendingProviderApprovals: 8,
    bookingsRequiringIntervention: 3,
    paymentIssues: 2,
    flaggedReviews: 4,
  };

  const snapshot = overview?.snapshot || {
    totalCustomers: 1240,
    activeProviders: 184,
    bookingsToday: 26,
    bookingsThisMonth: 412,
    completedBookings: 388,
    grossBookingValue: 485000,
    platformRevenue: 72750,
    averageRating: 4.8,
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold">What is Happening Across Trusted Hands?</h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Real-time marketplace operational control center & attention queue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" className="text-xs">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              Download Reports
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="cta" size="sm" className="text-xs">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Analytics & Insights
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. ADMIN PRIORITY AREA: TODAY'S ATTENTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-ink font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-crimson" />
            <span>Today's Attention</span>
          </h3>
          <span className="text-xs text-charcoal-muted font-medium">Action required items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 1 */}
          <Link
            to="/admin/providers/pending"
            className="group p-5 bg-bone border border-mist hover:border-crimson rounded-xl shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted group-hover:text-crimson transition-colors">
                Pending Verification
              </span>
              <div className="w-8 h-8 rounded-full bg-crimson/10 text-crimson flex items-center justify-center font-bold text-xs">
                {attention.pendingProviderApprovals}
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink mb-1">{attention.pendingProviderApprovals} Providers</div>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 group-hover:text-crimson">
                Review submitted documents <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Item 2 */}
          <Link
            to="/admin/bookings?status=DISPUTED"
            className="group p-5 bg-bone border border-mist hover:border-crimson rounded-xl shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted group-hover:text-crimson transition-colors">
                Disputed / Pending Bookings
              </span>
              <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center font-bold text-xs">
                {attention.bookingsRequiringIntervention}
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink mb-1">{attention.bookingsRequiringIntervention} Bookings</div>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 group-hover:text-crimson">
                Intervene in booking disputes <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Item 3 */}
          <Link
            to="/admin/payments?status=FAILED"
            className="group p-5 bg-bone border border-mist hover:border-crimson rounded-xl shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted group-hover:text-crimson transition-colors">
                Payment Issues
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                {attention.paymentIssues}
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink mb-1">{attention.paymentIssues} Failed</div>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 group-hover:text-crimson">
                Inspect payment transactions <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>

          {/* Item 4 */}
          <Link
            to="/admin/reviews?status=FLAGGED"
            className="group p-5 bg-bone border border-mist hover:border-crimson rounded-xl shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted group-hover:text-crimson transition-colors">
                Flagged Reviews
              </span>
              <div className="w-8 h-8 rounded-full bg-seafoam/30 text-ink flex items-center justify-center font-bold text-xs">
                {attention.flaggedReviews}
              </div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-ink mb-1">{attention.flaggedReviews} Reports</div>
              <p className="text-xs text-charcoal-muted flex items-center gap-1 group-hover:text-crimson">
                Moderate reported feedback <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. PLATFORM SNAPSHOT */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg text-ink font-semibold">Platform Snapshot</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <Users className="w-4 h-4 text-seafoam" /> Total Customers
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{snapshot.totalCustomers.toLocaleString()}</div>
            <span className="text-[11px] text-seafoam font-semibold">Verified User Base</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <ShieldCheck className="w-4 h-4 text-seafoam" /> Active Providers
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{snapshot.activeProviders.toLocaleString()}</div>
            <span className="text-[11px] text-seafoam font-semibold">Approved Professionals</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <Clock className="w-4 h-4 text-crimson" /> Bookings Today
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{snapshot.bookingsToday}</div>
            <span className="text-[11px] text-charcoal-muted font-medium">Scheduled for today</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <Calendar className="w-4 h-4 text-burgundy" /> Bookings This Month
            </div>
            <div className="text-2xl font-serif font-bold text-ink">{snapshot.bookingsThisMonth}</div>
            <span className="text-[11px] text-charcoal-muted font-medium">{snapshot.completedBookings} Completed</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <IndianRupee className="w-4 h-4 text-seafoam" /> Gross Booking Value
            </div>
            <div className="text-2xl font-serif font-bold text-ink">₹{snapshot.grossBookingValue.toLocaleString()}</div>
            <span className="text-[11px] text-charcoal-muted font-medium">Total Volume</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <CreditCard className="w-4 h-4 text-crimson" /> Platform Revenue
            </div>
            <div className="text-2xl font-serif font-bold text-crimson">₹{snapshot.platformRevenue.toLocaleString()}</div>
            <span className="text-[11px] text-crimson font-semibold">Platform Commission</span>
          </div>

          <div className="p-4 bg-bone border border-mist rounded-xl col-span-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-muted mb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Marketplace Average Rating
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-ink">{snapshot.averageRating}</span>
              <span className="text-xs text-charcoal-muted">/ 5.0 Rating Across Completed Jobs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONAL QUICK SHORTCUTS */}
      <section className="bg-bone border border-mist rounded-xl p-6 space-y-4">
        <h3 className="font-serif text-lg text-ink font-semibold">Quick Administrative Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link to="/admin/providers/pending" className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson font-semibold text-ink flex items-center justify-between">
            Verify Providers <ArrowUpRight className="w-4 h-4 text-crimson" />
          </Link>
          <Link to="/admin/services/categories" className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson font-semibold text-ink flex items-center justify-between">
            Manage Categories <ArrowUpRight className="w-4 h-4 text-crimson" />
          </Link>
          <Link to="/admin/content/homepage" className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson font-semibold text-ink flex items-center justify-between">
            Edit Homepage CMS <ArrowUpRight className="w-4 h-4 text-crimson" />
          </Link>
          <Link to="/admin/settings" className="p-3 bg-parchment border border-mist rounded-lg hover:border-crimson font-semibold text-ink flex items-center justify-between">
            Platform Settings <ArrowUpRight className="w-4 h-4 text-crimson" />
          </Link>
        </div>
      </section>
    </div>
  );
};
