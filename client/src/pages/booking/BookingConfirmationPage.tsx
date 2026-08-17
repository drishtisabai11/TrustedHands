import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { PriceDisplay } from '../../components/ui/DomainPrimitives';
import { Booking } from '../../types';
import apiClient from '../../services/api/client';
import { Check, ShieldCheck, ArrowRight, Home } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (bookingId) {
      apiClient
        .get(`/bookings/${bookingId}`)
        .then((res: any) => {
          setBooking(res.booking || res.data?.booking || null);
        })
        .catch(() => {
          // Simulation fallback object
          setBooking({
            id: bookingId,
            bookingNumber: `TH-BK-${Math.floor(100000 + Math.random() * 900000)}`,
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
        });
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <Container size="narrow" className="max-w-2xl">
          <div className="bg-bone p-8 sm:p-12 rounded-lg border border-mist shadow-elevated space-y-8">
            
            {/* Top Confirmation Header */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-mineral text-white flex items-center justify-center mx-auto shadow-subtle">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Booking Confirmed
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
                You're all set.
              </h1>
              <p className="text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
                Your service appointment has been scheduled and your payment is held securely in escrow.
              </p>
            </div>

            {/* Booking Reference Box */}
            {booking && (
              <div className="p-6 bg-parchment rounded-lg border border-mist space-y-4 text-xs font-sans">
                <div className="flex justify-between items-center pb-3 border-b border-mist">
                  <span className="text-charcoal-subtle uppercase tracking-wider font-semibold">Booking ID</span>
                  <span className="font-mono font-bold text-ink text-sm">{booking.bookingNumber}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-charcoal-subtle block mb-1">Scheduled Arrival Window</span>
                    <span className="font-semibold text-ink text-sm block">{booking.scheduledDate}</span>
                    <span className="text-charcoal-muted">{booking.scheduledTimeSlot}</span>
                  </div>

                  <div>
                    <span className="text-charcoal-subtle block mb-1">Service Address</span>
                    <span className="font-semibold text-ink block">{booking.serviceAddress.street}</span>
                    <span className="text-charcoal-muted">
                      {booking.serviceAddress.city}, {booking.serviceAddress.postalCode}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-mist flex justify-between items-center text-sm font-bold text-ink">
                  <span>Total Amount Paid</span>
                  <PriceDisplay amount={booking.totalAmount} size="md" />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <RouterLink to={`/booking/${bookingId}`}>
                <Button variant="cta" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Booking Details
                </Button>
              </RouterLink>
              <RouterLink to="/">
                <Button variant="outline" size="lg" leftIcon={<Home className="w-4 h-4" />}>
                  Back to Homepage
                </Button>
              </RouterLink>
            </div>

            <div className="pt-4 text-center text-xs text-charcoal-subtle flex items-center justify-center gap-1.5 border-t border-mist/60">
              <ShieldCheck className="w-4 h-4 text-mineral" />
              <span>A confirmation summary has been sent to your registered email address.</span>
            </div>

          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
