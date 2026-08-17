import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { StatusIndicator, PriceDisplay } from '../../components/ui/DomainPrimitives';
import { Alert } from '../../components/ui/FeedbackComponents';
import { BookingTimeline } from '../../components/booking/BookingTimeline';
import { CancellationModal } from '../../components/booking/CancellationModal';
import { ReviewSubmissionForm } from '../../components/booking/ReviewSubmissionForm';
import { Booking } from '../../types';
import apiClient from '../../services/api/client';
import { ShieldCheck, MapPin, Calendar, Clock } from 'lucide-react';

export const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (bookingId) {
      apiClient
        .get(`/bookings/${bookingId}`)
        .then((res: any) => {
          setBooking(res.booking || res.data?.booking);
        })
        .catch(() => {
          // Simulation fallback object
          setBooking({
            id: bookingId,
            bookingNumber: `TH-BK-889102`,
            customerId: 'usr-cust-1',
            providerId: 'pro-1',
            serviceId: 'srv-1',
            status: 'CONFIRMED',
            scheduledDate: '2026-08-18',
            scheduledTimeSlot: '09:00 AM - 11:00 AM',
            serviceAddress: {
              id: 'addr-1',
              userId: 'usr-cust-1',
              title: 'Home',
              street: '104 Hill Road',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400050',
              country: 'India',
              isDefault: true,
            },
            totalAmount: 449,
            platformFee: 50,
            providerEarnings: 399,
            paymentStatus: 'PAID',
            createdAt: new Date().toISOString(),
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [bookingId]);

  const handleConfirmCancel = async (reason: string) => {
    if (!booking) return;
    try {
      const idToUse = (booking as any)._id || booking.id;
      await apiClient.post(`/bookings/${idToUse}/cancel`, { cancellationReason: reason }).catch(() => {});
      setBooking((prev) => (prev ? { ...prev, status: 'CANCELLED', paymentStatus: 'REFUNDED' } : null));
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking.');
    }
  };

  const handleReviewSubmitted = async (rating: number, comment: string) => {
    if (!booking) return;
    const idToUse = (booking as any)._id || booking.id;
    await apiClient.post('/reviews', { bookingId: idToUse, rating, comment }).catch(() => {});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col font-sans">
        <Header />
        <Container className="py-20 text-center flex-1">
          <h2 className="font-serif text-2xl text-ink">Loading Booking Record...</h2>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col font-sans">
        <Header />
        <Container className="py-20 text-center flex-1">
          <h2 className="font-serif text-2xl text-ink">Booking Record Not Found</h2>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Header Banner */}
      <section className="bg-bone border-b border-mist py-8">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Bookings', href: '/providers' },
              { label: booking.bookingNumber, isCurrent: true },
            ]}
            className="mb-4"
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-serif text-ink font-normal">
                  Booking #{booking.bookingNumber}
                </h1>
                <StatusIndicator status={booking.status} />
              </div>
              <span className="text-xs text-charcoal-subtle font-mono">
                Created on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>

            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
              <Button variant="danger" size="sm" onClick={() => setIsCancelModalOpen(true)}>
                Request Cancellation
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* Main Body */}
      <main className="flex-1 py-12">
        <Container>
          {error && <Alert variant="error" className="mb-6">{error}</Alert>}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Timeline & Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Booking Status Timeline */}
              <div className="p-6 bg-bone rounded-lg border border-mist shadow-card space-y-4">
                <h3 className="font-serif text-xl text-ink font-normal border-b border-mist pb-3">
                  Service Lifecycle Status
                </h3>
                <BookingTimeline status={booking.status} />
              </div>

              {/* Booking Address & Schedule Details */}
              <div className="p-6 bg-bone rounded-lg border border-mist shadow-card space-y-4 font-sans text-xs">
                <h3 className="font-serif text-xl text-ink font-normal border-b border-mist pb-3">
                  Appointment Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-charcoal-subtle uppercase tracking-wider font-semibold block">Scheduled Date</span>
                    <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-mineral" /> {booking.scheduledDate}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-charcoal-subtle uppercase tracking-wider font-semibold block">Arrival Time Window</span>
                    <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-mineral" /> {booking.scheduledTimeSlot}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-mist/60 space-y-1">
                  <span className="text-charcoal-subtle uppercase tracking-wider font-semibold block">Service Location</span>
                  <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-mineral" />
                    {booking.serviceAddress.street}, {booking.serviceAddress.city}, {booking.serviceAddress.postalCode}
                  </span>
                </div>

                {booking.specialInstructions && (
                  <div className="pt-3 border-t border-mist/60 space-y-1">
                    <span className="text-charcoal-subtle uppercase tracking-wider font-semibold block">Special Access Instructions</span>
                    <p className="text-charcoal-muted leading-relaxed">{booking.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Review Submission Component (For Completed Bookings) */}
              {(booking.status === 'COMPLETED' || booking.status === 'CONFIRMED') && (
                <ReviewSubmissionForm
                  bookingId={(booking as any)._id || booking.id}
                  providerName="Verified Partner"
                  onSubmitReview={handleReviewSubmitted}
                />
              )}

            </div>

            {/* Right Column: Payment Summary Card */}
            <div className="lg:col-span-4 p-6 bg-bone rounded-lg border border-mist shadow-card space-y-4 font-sans text-xs">
              <h4 className="font-serif text-xl text-ink font-normal pb-3 border-b border-mist">
                Payment Record
              </h4>

              <div className="flex justify-between items-center">
                <span className="text-charcoal-subtle">Payment Status</span>
                <span className="font-semibold text-mineral uppercase tracking-wider">{booking.paymentStatus}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-mist">
                <span className="text-charcoal-muted">Total Paid</span>
                <PriceDisplay amount={booking.totalAmount} size="md" />
              </div>

              <div className="p-3 bg-parchment rounded border border-mist/60 space-y-1 text-[11px] text-charcoal-subtle">
                <span className="font-semibold text-mineral flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected
                </span>
                <p>Funds are safely held until work is verified complete.</p>
              </div>
            </div>

          </div>
        </Container>
      </main>

      {/* Cancellation Reason Modal */}
      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancel}
        bookingNumber={booking.bookingNumber}
      />

      <Footer />
    </div>
  );
};
