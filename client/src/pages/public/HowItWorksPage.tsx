import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Search, Calendar, CheckCircle2, UserPlus, FileText, Award } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeRole, setActiveRole] = React.useState<'customer' | 'provider'>('customer');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash === '#provider') {
      setActiveRole('provider');
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Hero Header */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'How It Works', isCurrent: true },
              ]}
              className="mb-4"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Transparent Marketplace Process
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
              Getting help should be simple.
            </h1>
            <p className="text-sm md:text-base text-charcoal-muted leading-relaxed font-sans mb-6">
              Learn how Trusted Hands connects discerning clients with vetted local professionals for seamless, escrow-protected bookings.
            </p>

            <div className="flex gap-4 border-b border-mist max-w-sm">
              <button
                onClick={() => setActiveRole('customer')}
                className={`py-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                  activeRole === 'customer'
                    ? 'border-mineral text-ink font-bold'
                    : 'border-transparent text-charcoal-subtle hover:text-ink'
                }`}
              >
                For Customers
              </button>
              <button
                onClick={() => setActiveRole('provider')}
                className={`py-3 px-2 font-semibold text-sm border-b-2 transition-colors ${
                  activeRole === 'provider'
                    ? 'border-mineral text-ink font-bold'
                    : 'border-transparent text-charcoal-subtle hover:text-ink'
                }`}
              >
                For Service Providers
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Journeys */}
      <main className="flex-1 py-16 md:py-24">
        <Container>
          
          {/* CUSTOMER JOURNEY */}
          {activeRole === 'customer' && (
            <div className="space-y-16 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">01. DISCOVER SERVICES</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Search or browse by trade</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Search for electricians, master carpenters, plumbers, deep cleaners, or tutors in your exact city location. Filter by verified credentials, hourly rates, and minimum rating.
                  </p>
                </div>
                <div className="p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <Search className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Smart Service Search</span>
                    <span className="text-xs text-charcoal-subtle">Filter by location, trade license, and ratings.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Verified Partner Profiles</span>
                    <span className="text-xs text-charcoal-subtle">Check trade licenses, background reviews, and work photos.</span>
                  </div>
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">02. COMPARE PROFESSIONALS</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Review verified credentials</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Every provider profile showcases government ID status, trade certifications, completed job counts, starting prices, and unedited customer feedback.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">03. CHOOSE TIME & BOOK</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Lock in an arrival window</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Pick a date and arrival time slot that works for you. Your payment is held safely in escrow and is only released after work is finished.
                  </p>
                </div>
                <div className="p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Flexible Time Slots</span>
                    <span className="text-xs text-charcoal-subtle">Morning, afternoon, or evening arrival slots.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Quality Job Completion</span>
                    <span className="text-xs text-charcoal-subtle">Leave a review and build trusted community history.</span>
                  </div>
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">04. GET IT DONE & REVIEW</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Enjoy craftsmanship done right</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Your professional arrives on time equipped with proper tools. Once satisfied, mark the booking complete and leave an authentic review.
                  </p>
                </div>
              </div>

              <div className="pt-8 text-center">
                <RouterLink to="/providers">
                  <Button variant="cta" size="lg">
                    Find a Professional Now
                  </Button>
                </RouterLink>
              </div>
            </div>
          )}

          {/* PROVIDER JOURNEY */}
          {activeRole === 'provider' && (
            <div className="space-y-16 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">01. JOIN THE PLATFORM</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Submit your trade credentials</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Create your account, upload government photo ID, active trade certificate or license, and service area details for verification review.
                  </p>
                </div>
                <div className="p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <UserPlus className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Fast Application</span>
                    <span className="text-xs text-charcoal-subtle">Review completed within 24-48 hours.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <FileText className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Editorial Profile Showcase</span>
                    <span className="text-xs text-charcoal-subtle">Highlight your craft, experience, and custom rates.</span>
                  </div>
                </div>
                <div className="order-1 md:order-2 space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">02. BUILD YOUR PROFILE</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Set your services & rates</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Set your custom hourly rates, list specific service tasks, define working availability, and upload real work portfolio photography.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="font-serif text-3xl text-mineral font-normal">03. RECEIVE BOOKINGS</span>
                  <h3 className="font-serif text-2xl text-ink font-normal">Direct customer requests</h3>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    Receive job requests from local clients who value quality craftsmanship. View job details, location, and scheduled arrival slots before accepting.
                  </p>
                </div>
                <div className="p-6 bg-bone rounded-lg border border-mist shadow-card flex items-center gap-4">
                  <Award className="w-8 h-8 text-mineral shrink-0" />
                  <div>
                    <span className="font-semibold text-ink text-sm block">Guaranteed Payout Escrow</span>
                    <span className="text-xs text-charcoal-subtle">Payment locked upon booking confirmation.</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <RouterLink to="/contact">
                  <Button variant="primary" size="lg">
                    Apply to Become a Provider
                  </Button>
                </RouterLink>
              </div>
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </div>
  );
};
