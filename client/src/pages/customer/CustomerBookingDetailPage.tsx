import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  FileText,
  CreditCard,
} from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Booking } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CustomerBookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!bookingId) return;
      setLoading(true);
      try {
        const data = await customerApi.getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      booking.status = 'CANCELLED';
      booking.cancellationReason = 'Cancelled by customer';
      setBooking({ ...booking });
    } finally {
      setCancelling(false);
    }
  };

  // TIMELINE STEP COMPUTATION
  const timelineSteps = [
    { label: 'Booking Confirmed', key: 'CONFIRMED' },
    { label: 'Provider Accepted', key: 'PROVIDER_ACCEPTED' },
    { label: 'On The Way', key: 'PROVIDER_ON_THE_WAY' },
    { label: 'Service Started', key: 'SERVICE_STARTED' },
    { label: 'Completed', key: 'COMPLETED' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!booking) return 'pending';
    if (booking.status === 'CANCELLED') return 'cancelled';

    const statusOrder = ['CONFIRMED', 'PROVIDER_ACCEPTED', 'PROVIDER_ON_THE_WAY', 'SERVICE_STARTED', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(booking.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentIndex === -1) {
      // Default fallback for PENDING or initial state
      return stepIndex === 0 ? 'active' : 'pending';
    }

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-32 bg-bone rounded-lg"></div>
        <div className="h-64 bg-bone rounded-2xl"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-bone border border-mist rounded-2xl p-12 text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate">Booking Not Found</h2>
        <p className="text-sm text-charcoal-muted">We couldn't locate booking record #{bookingId}.</p>
        <Link to="/dashboard/bookings">
          <Button variant="outline" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Bookings
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* TOP BACK BAR */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard/bookings" className="text-sm font-semibold text-charcoal hover:text-brand flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Bookings
        </Link>
        <span className="text-xs font-mono uppercase tracking-wider text-charcoal-subtle">
          ID: {booking.bookingNumber}
        </span>
      </div>

      {/* HEADER SUMMARY CARD */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="font-serif text-2xl font-bold text-slate">{booking.service?.title || 'Service Booking'}</h1>
            <Badge variant={booking.status === 'COMPLETED' ? 'outline' : booking.status === 'CANCELLED' ? 'secondary' : 'verified'}>
              {booking.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-sm text-charcoal">
            Scheduled for <span className="font-semibold text-ink">{booking.scheduledDate}</span> during{' '}
            <span className="font-semibold text-ink">{booking.scheduledTimeSlot}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href={`tel:${booking.provider?.user?.phone || '+919820099881'}`}>
            <Button variant="primary" size="md">
              <PhoneCall className="w-4 h-4 mr-2" /> Contact Professional
            </Button>
          </a>
          {['CONFIRMED', 'PENDING', 'PROVIDER_ACCEPTED'].includes(booking.status) && (
            <Button variant="outline" size="md" onClick={handleCancelBooking} disabled={cancelling}>
              Cancel Booking
            </Button>
          )}
        </div>
      </div>

      {/* DYNAMIC BOOKING TIMELINE TRACKER */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle">Service Timeline</h2>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-2">
          {timelineSteps.map((step, idx) => {
            const status = getStepStatus(step.key);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isCancelled = status === 'cancelled';

            return (
              <div key={step.key} className="flex-1 flex md:flex-col items-center text-left md:text-center gap-3 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCancelled
                      ? 'bg-mist text-charcoal-muted'
                      : isCompleted
                      ? 'bg-sage text-bone'
                      : isActive
                      ? 'bg-brand text-bone ring-4 ring-brand/20'
                      : 'bg-parchment text-charcoal-subtle border border-mist'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold block ${
                      isActive ? 'text-brand font-bold' : isCompleted ? 'text-ink' : 'text-charcoal-subtle'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && <span className="text-[10px] text-brand font-medium">Current Status</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: PROVIDER & SERVICE & ADDRESS */}
        <div className="md:col-span-2 space-y-6">
          {/* PROVIDER DETAILS CARD */}
          <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle">Service Professional</h3>

            <div className="flex items-start space-x-4">
              <img
                src={
                  booking.provider?.user?.avatar ||
                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
                }
                alt={booking.provider?.user?.name || 'Provider'}
                className="w-16 h-16 rounded-xl object-cover border border-mist"
              />

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-lg font-bold text-ink">
                    {booking.provider?.user?.name || booking.provider?.businessName || 'Rajesh Kumar'}
                  </h4>
                  <Badge variant="verified">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                </div>
                <p className="text-xs font-medium text-brand">{booking.provider?.headline || 'Government Licensed Specialist'}</p>
                <p className="text-xs text-charcoal-muted">
                  {booking.provider?.yearsOfExperience || 10}+ Years Experience · {booking.provider?.rating || 4.9} ★ Rating
                </p>
              </div>
            </div>
          </div>

          {/* SERVICE ADDRESS CARD */}
          <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-brand" /> Service Location
            </h3>
            <div className="text-sm text-ink space-y-1 font-medium">
              <p>{booking.serviceAddress?.street}</p>
              {booking.serviceAddress?.apartment && <p>{booking.serviceAddress.apartment}</p>}
              <p>
                {booking.serviceAddress?.city}, {booking.serviceAddress?.state} - {booking.serviceAddress?.postalCode}
              </p>
            </div>
          </div>

          {/* SPECIAL INSTRUCTIONS */}
          {booking.specialInstructions && (
            <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
                <FileText className="w-4 h-4 mr-1 text-brand" /> Customer Notes
              </h3>
              <p className="text-sm text-charcoal bg-parchment/60 p-3 rounded-lg border border-mist italic">
                "{booking.specialInstructions}"
              </p>
            </div>
          )}
        </div>

        {/* RIGHT 1 COL: PRICE BREAKDOWN & PAYMENT */}
        <div className="space-y-6">
          <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-subtle flex items-center">
              <CreditCard className="w-4 h-4 mr-1 text-brand" /> Payment Summary
            </h3>

            <div className="space-y-2.5 text-sm border-b border-mist pb-4">
              <div className="flex justify-between text-charcoal">
                <span>Service Fee</span>
                <span>₹{booking.totalAmount - booking.platformFee}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Platform Assurance Fee</span>
                <span>₹{booking.platformFee}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-base font-serif font-bold text-slate">
              <span>Total Paid</span>
              <span>₹{booking.totalAmount}</span>
            </div>

            <div className="bg-parchment p-3 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal">Payment Status:</span>
              <span className="font-bold text-sage-dark uppercase tracking-wider">{booking.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBookingDetailPage;
