import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Star,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ProviderOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await providerApi.getDashboardSummary();
        setSummaryData(data);
        setIsOnline(data?.provider?.isOnline ?? true);
      } catch (err) {
        console.error('Error loading provider dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const toggleAvailability = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      await providerApi.updateAvailability({ isOnline: nextState });
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-bone rounded-xl"></div>
        <div className="h-36 bg-bone rounded-xl"></div>
        <div className="h-48 bg-bone rounded-xl"></div>
      </div>
    );
  }

  const provider = summaryData?.provider;
  const stats = summaryData?.stats;
  const todayBookings: Booking[] = summaryData?.todayBookings || [];
  const completion = summaryData?.profileCompletionPercentage || 88;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER WITH GREETING & ONLINE TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">
            {getGreeting()}, {user?.name?.split(' ')[0] || provider?.name?.split(' ')[0] || 'Partner'}.
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">Here's how your workday looks.</p>
        </div>

        {/* ONLINE / OFFLINE AVAILABILITY TOGGLE */}
        <div className="flex items-center space-x-3 bg-bone border border-mist px-4 py-2 rounded-xl shadow-subtle self-start sm:self-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal">Status:</span>
          <button
            type="button"
            onClick={toggleAvailability}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              isOnline ? 'bg-sage/20 text-sage-dark border border-sage' : 'bg-mist/40 text-charcoal-muted'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-sage animate-ping"></span>
                <span>ONLINE & ACCEPTING</span>
              </>
            ) : (
              <span>OFFLINE / BUSY</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. VERIFICATION STATUS & PROFILE COMPLETION BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* VERIFICATION STATUS CARD */}
        <div className="md:col-span-2 bg-bone border border-sage/40 rounded-2xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-sage-dark" />
              <span className="font-serif font-bold text-slate text-base">TRUSTED HANDS VERIFIED</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-charcoal">
              <span className="flex items-center text-sage-dark">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Govt ID Verified
              </span>
              <span className="flex items-center text-sage-dark">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Background Checked
              </span>
              <span className="flex items-center text-sage-dark">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Profile Reviewed
              </span>
            </div>
          </div>

          <Badge variant="verified" size="md">
            Active Partner Badge
          </Badge>
        </div>

        {/* PROFILE COMPLETION INDICATOR */}
        <div className="bg-bone border border-mist rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-charcoal-subtle">
            <span>Profile Completion</span>
            <span className="text-brand font-bold">{completion}%</span>
          </div>

          <div className="w-full bg-mist/60 h-2.5 rounded-full overflow-hidden">
            <div className="bg-brand h-full rounded-full transition-all duration-500" style={{ width: `${completion}%` }}></div>
          </div>

          <p className="text-[11px] text-charcoal-muted">Add portfolio items to reach 100% complete.</p>
        </div>
      </div>

      {/* 3. KEY WORKDAY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bone border border-mist p-4 rounded-xl shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
            Pending Action
          </span>
          <span className="text-2xl font-serif font-bold text-brand block">{stats?.pendingAcceptance || 0}</span>
          <span className="text-[11px] text-charcoal-muted">Bookings waiting response</span>
        </div>

        <div className="bg-bone border border-mist p-4 rounded-xl shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
            Upcoming Jobs
          </span>
          <span className="text-2xl font-serif font-bold text-slate block">{stats?.upcomingJobs || 0}</span>
          <span className="text-[11px] text-charcoal-muted">Scheduled upcoming</span>
        </div>

        <div className="bg-bone border border-mist p-4 rounded-xl shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
            This Month Earnings
          </span>
          <span className="text-2xl font-serif font-bold text-sage-dark block">₹{stats?.thisMonthEarnings || 0}</span>
          <span className="text-[11px] text-charcoal-muted">Gross net earnings</span>
        </div>

        <div className="bg-bone border border-mist p-4 rounded-xl shadow-subtle space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-subtle block">
            Client Rating
          </span>
          <span className="text-2xl font-serif font-bold text-ink block flex items-center">
            {stats?.rating || 4.9} <Star className="w-4 h-4 fill-current text-amber-500 ml-1" />
          </span>
          <span className="text-[11px] text-charcoal-muted">Based on reviews</span>
        </div>
      </div>

      {/* 4. TODAY OVERVIEW FOCUS SCHEDULE */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-mist/80 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate">Today's Schedule</h2>
            <p className="text-xs text-charcoal-muted">Time-based schedule for your active workday</p>
          </div>

          <Link to="/provider/calendar" className="text-xs font-semibold text-brand hover:underline flex items-center">
            View Calendar <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        {todayBookings.length > 0 ? (
          <div className="space-y-3">
            {todayBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 border border-mist rounded-xl hover:border-brand/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-parchment rounded-xl border border-mist text-center shrink-0">
                    <Clock className="w-4 h-4 text-brand mx-auto mb-1" />
                    <span className="text-xs font-bold text-ink block">{b.scheduledTimeSlot.split(' - ')[0]}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif font-bold text-ink text-base">{b.service?.title || 'Service Job'}</h3>
                      <Badge variant={b.status === 'CONFIRMED' ? 'secondary' : 'verified'}>
                        {b.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <p className="text-xs text-charcoal">
                      Client:{' '}
                      <span className="font-semibold text-ink">
                        {b.customer?.name || 'Anita Sharma'}
                      </span>{' '}
                      · {b.serviceAddress?.city || 'South Delhi'}
                    </p>

                    <p className="text-[11px] text-charcoal-muted italic">{b.specialInstructions || 'No special notes'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-mist">
                  <span className="text-base font-serif font-bold text-slate">₹{b.providerEarnings}</span>
                  <Link to={`/provider/bookings`}>
                    <Button variant="primary" size="sm">
                      Manage Job
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-charcoal-muted space-y-1">
            <p className="text-sm font-semibold text-ink">No scheduled appointments for today.</p>
            <p className="text-xs">Your upcoming bookings will appear here chronologically.</p>
          </div>
        )}
      </div>

      {/* 5. QUICK ACTIONS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-3">Professional Shortcuts</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Link
            to="/provider/calendar"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand transition-all flex flex-col justify-between group"
          >
            <Calendar className="w-5 h-5 text-brand mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-ink group-hover:text-brand">View Calendar</span>
          </Link>

          <Link
            to="/provider/bookings"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand transition-all flex flex-col justify-between group"
          >
            <Briefcase className="w-5 h-5 text-slate mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-ink group-hover:text-brand">Manage Bookings</span>
          </Link>

          <Link
            to="/provider/services"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand transition-all flex flex-col justify-between group"
          >
            <Clock className="w-5 h-5 text-sage-dark mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-ink group-hover:text-brand">Edit Services</span>
          </Link>

          <Link
            to="/provider/availability"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand transition-all flex flex-col justify-between group"
          >
            <UserCheck className="w-5 h-5 text-brand mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-ink group-hover:text-brand">Availability</span>
          </Link>

          <Link
            to="/provider/earnings"
            className="p-4 bg-bone border border-mist rounded-xl hover:border-brand transition-all flex flex-col justify-between group"
          >
            <DollarSign className="w-5 h-5 text-sage-dark mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-ink group-hover:text-brand">View Earnings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderOverviewPage;
