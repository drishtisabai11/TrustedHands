import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Avatar } from '../../components/ui/Avatar';
import { Rating } from '../../components/ui/Rating';
import { Button } from '../../components/ui/Button';
import { VerificationBadge } from '../../components/ui/Badge';
import { PriceDisplay } from '../../components/ui/DomainPrimitives';
import { Tabs } from '../../components/ui/Tabs';
import { Divider } from '../../components/ui/Divider';
import { Modal } from '../../components/ui/Modal';
import { Toast } from '../../components/ui/FeedbackComponents';
import { ServiceBookingItem } from '../../components/marketplace/ServiceBookingItem';
import { ReviewCard } from '../../components/marketplace/ReviewCard';
import { SaveProviderButton } from '../../components/marketplace/SaveProviderButton';
import { DateSelector, TimeSlot } from '../../components/ui/BookingPrimitives';
import { Provider, Service, Review } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { 
  ShieldCheck, MapPin, Briefcase, CheckCircle2, 
  Award, Star 
} from 'lucide-react';

export const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('services');

  // Booking modal state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-08-18');
  const [selectedSlot, setSelectedSlot] = useState('slot-1');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  const mockDates = [
    { dateString: '2026-08-18', dayName: 'Tue', dayNumber: 18, monthName: 'Aug' },
    { dateString: '2026-08-19', dayName: 'Wed', dayNumber: 19, monthName: 'Aug' },
    { dateString: '2026-08-20', dayName: 'Thu', dayNumber: 20, monthName: 'Aug' },
    { dateString: '2026-08-21', dayName: 'Fri', dayNumber: 21, monthName: 'Aug' },
    { dateString: '2026-08-22', dayName: 'Sat', dayNumber: 22, monthName: 'Aug', isAvailable: false },
    { dateString: '2026-08-23', dayName: 'Sun', dayNumber: 23, monthName: 'Aug' },
  ];

  const mockTimeSlots = [
    { id: 'slot-1', timeLabel: '09:00 AM - 11:00 AM', period: 'MORNING' as const },
    { id: 'slot-2', timeLabel: '11:00 AM - 01:00 PM', period: 'MORNING' as const },
    { id: 'slot-3', timeLabel: '02:00 PM - 04:00 PM', period: 'AFTERNOON' as const },
    { id: 'slot-4', timeLabel: '04:00 PM - 06:00 PM', period: 'AFTERNOON' as const, isAvailable: false },
    { id: 'slot-5', timeLabel: '06:00 PM - 08:00 PM', period: 'EVENING' as const },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (providerId) {
      marketplaceService.getProviderById(providerId).then((pro) => {
        if (pro) {
          setProvider(pro);
          marketplaceService.getServices().then((srvs) => {
            // Filter services for provider
            setServices(srvs.slice(0, 3));
          });
          marketplaceService.getReviews(pro.id).then(setReviews);
        }
      });
    }
  }, [providerId]);

  if (!provider) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col font-sans">
        <Header />
        <Container className="py-20 text-center flex-1">
          <h2 className="font-serif text-2xl text-ink">Provider Loading or Not Found</h2>
        </Container>
        <Footer />
      </div>
    );
  }

  const handleStartBooking = (service?: Service) => {
    if (service) setSelectedService(service);
    else if (services.length > 0) setSelectedService(services[0]);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Profile Header Hero */}
      <section className="bg-bone border-b border-mist pt-8 pb-12 md:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Professionals', href: '/providers' },
              { label: provider.user.name, isCurrent: true },
            ]}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Avatar & Metadata */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start gap-6">
              <Avatar
                name={provider.user.name}
                src={provider.user.avatar}
                size="xl"
                isOnline={true}
                className="shrink-0 border-2 border-mist shadow-card"
              />

              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
                    {provider.user.name}
                  </h1>
                  <VerificationBadge type="identity" />
                  <VerificationBadge type="background" />
                </div>

                {provider.businessName && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-mineral block">
                    {provider.businessName}
                  </span>
                )}

                <p className="text-sm text-charcoal-muted leading-relaxed max-w-xl">
                  {provider.headline}
                </p>

                {/* Key Stats Bar */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-charcoal pt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-mineral" />
                    {provider.location.city}, {provider.location.state}
                  </span>

                  <span className="flex items-center gap-1 font-bold">
                    <Star className="w-4 h-4 fill-clay text-clay" />
                    {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                  </span>

                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-mineral" />
                    {provider.yearsOfExperience}+ Years Experience
                  </span>

                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-mineral" />
                    120+ Jobs Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Booking Action Box */}
            <div className="lg:col-span-4 p-6 bg-parchment rounded-lg border border-mist shadow-card space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-subtle block font-semibold">
                  Standard Hourly Rate
                </span>
                <PriceDisplay amount={provider.hourlyRate} unit="hour" size="lg" />
              </div>

              <div className="space-y-2 pt-2 border-t border-mist/60 text-xs text-charcoal-muted">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <ShieldCheck className="w-4 h-4 text-mineral shrink-0" />
                  Identity & background verified
                </span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <CheckCircle2 className="w-4 h-4 text-mineral shrink-0" />
                  Escrow payment protection
                </span>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button variant="cta" fullWidth size="lg" onClick={() => handleStartBooking()}>
                  Book This Professional
                </Button>
                <SaveProviderButton
                  providerId={provider.id}
                  providerName={provider.user.name}
                  className="w-full justify-center py-2.5"
                />
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Main Content Tabs */}
      <main className="flex-1 py-12">
        <Container>
          <Tabs
            tabs={[
              { id: 'services', label: 'Offered Services', count: services.length },
              { id: 'about', label: 'About & Craft' },
              { id: 'verification', label: 'Trust & Verification' },
              { id: 'availability', label: 'Schedule & Slots' },
              { id: 'reviews', label: 'Customer Reviews', count: reviews.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-8"
          />

          {/* TAB 1: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="font-serif text-2xl text-ink font-normal mb-1">
                  Services Provided by {provider.user.name}
                </h3>
                <p className="text-xs text-charcoal-subtle">
                  Select a specific service task to view included items and book an arrival slot.
                </p>
              </div>

              <div className="space-y-4">
                {services.map((srv) => (
                  <ServiceBookingItem
                    key={srv.id}
                    service={srv}
                    onBook={(s) => handleStartBooking(s)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="font-serif text-2xl text-ink font-normal mb-3">About the Craft</h3>
                <p className="text-sm text-charcoal leading-relaxed whitespace-pre-line font-sans">
                  {provider.bio}
                </p>
              </div>

              <Divider />

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-4">
                  Craftsmanship Highlights & Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {provider.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-sage-subtle text-slate text-xs font-semibold rounded border border-sage/40 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-mineral" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="font-serif text-2xl text-ink font-normal mb-2">
                  TRUSTED HANDS VERIFIED
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Every listed professional passes manual identity check, trade certificate review, and ongoing review auditing.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-ink block">Identity & Government Photo ID</span>
                    <span className="text-xs text-charcoal-subtle">Aadhaar / Passport verified & background checked.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-mist">
                  <CheckCircle2 className="w-5 h-5 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-ink block">Trade Certification & License</span>
                    <span className="text-xs text-charcoal-subtle">Electrical PWD license / Master carpentry trade proof reviewed.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-mist">
                  <CheckCircle2 className="w-5 h-5 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-ink block">Active Service Insurance</span>
                    <span className="text-xs text-charcoal-subtle">Fully covered against unintentional home damage during service.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AVAILABILITY */}
          {activeTab === 'availability' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif text-2xl text-ink font-normal mb-1">Provider Schedule & Arrival Slots</h3>
                <p className="text-xs text-charcoal-subtle">
                  Select a date and arrival time window to check live scheduling availability.
                </p>
              </div>

              <div className="p-6 bg-bone rounded-lg border border-mist space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                    Available Booking Dates
                  </h4>
                  <DateSelector
                    dates={mockDates}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                </div>

                <Divider />

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted mb-3">
                    Available Arrival Windows
                  </h4>
                  <TimeSlot
                    slots={mockTimeSlots}
                    selectedSlotId={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-ink font-normal mb-1">Customer Reviews</h3>
                  <p className="text-xs text-charcoal-subtle">
                    {reviews.length} authentic customer reviews from verified completed bookings.
                  </p>
                </div>
                <Rating value={provider.rating} reviewCount={provider.reviewCount} size="lg" />
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* Booking Modal Interaction (Flow Entry Point) */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Schedule Service Booking"
        subtitle={`Booking with ${provider.user.name}`}
        footer={
          <>
            <Button variant="text" onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="cta"
              onClick={() => {
                setIsBookingModalOpen(false);
                setBookingSuccessToast(true);
              }}
            >
              Proceed to Booking Details
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs font-sans">
          {selectedService && (
            <div className="p-3 bg-parchment rounded border border-mist flex justify-between items-center">
              <div>
                <span className="font-semibold text-ink text-sm block">{selectedService.title}</span>
                <span className="text-charcoal-subtle">Est. duration: {selectedService.estimatedDurationMinutes} mins</span>
              </div>
              <PriceDisplay amount={selectedService.basePrice} size="sm" />
            </div>
          )}

          <div>
            <label className="font-semibold text-charcoal block mb-2">Select Date</label>
            <DateSelector dates={mockDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>

          <div>
            <label className="font-semibold text-charcoal block mb-2">Select Time Window</label>
            <TimeSlot slots={mockTimeSlots} selectedSlotId={selectedSlot} onSelectSlot={setSelectedSlot} />
          </div>
        </div>
      </Modal>

      {bookingSuccessToast && (
        <Toast
          message="Arrival Window Selected!"
          description="Proceeding to secure booking verification."
          variant="success"
          onClose={() => setBookingSuccessToast(false)}
        />
      )}

      <Footer />
    </div>
  );
};
