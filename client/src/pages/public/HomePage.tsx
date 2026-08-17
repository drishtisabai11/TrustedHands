import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { SearchBar } from '../../components/marketplace/SearchBar';
import { CategoryRow } from '../../components/marketplace/CategoryRow';
import { ProviderCard } from '../../components/marketplace/ProviderCard';
import { Button } from '../../components/ui/Button';
import { Category, Provider } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, Award 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<Provider[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    marketplaceService.getCategories().then(setCategories);
    marketplaceService.getProviders({ sortBy: 'rating' }).then((list) => setFeaturedProviders(list.slice(0, 4)));
  }, []);

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* 1. ASYMMETRIC EDITORIAL HERO */}
      <section className="relative bg-parchment border-b border-mist pt-8 pb-16 md:py-24 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Eyebrow + Headline + Copy + Search Component */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-subtle rounded-sm border border-sage/40">
                <span className="w-2 h-2 rounded-full bg-mineral animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate">
                  TRUSTED LOCAL PROFESSIONALS
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-ink font-normal leading-[1.1] tracking-tight">
                Good work starts with the right hands.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted max-w-xl leading-relaxed font-sans">
                Find skilled, verified professionals for the jobs that matter — from everyday home services to personal and professional help.
              </p>

              {/* Prominent Hero Search Component */}
              <div className="pt-2 max-w-2xl">
                <SearchBar />
              </div>

              {/* Trust Badging Subtext */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-charcoal-subtle border-t border-mist/50">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <ShieldCheck className="w-4 h-4 text-mineral" /> Government ID Verified
                </span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <CheckCircle2 className="w-4 h-4 text-mineral" /> Transparent Pricing
                </span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Award className="w-4 h-4 text-mineral" /> Escrow Protected
                </span>
              </div>
            </div>

            {/* Right Column: Editorial Photography Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Photography Container */}
                <div className="relative rounded-lg overflow-hidden border border-slate/20 shadow-elevated bg-bone aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80"
                    alt="Licensed electrician inspecting residential power panel"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60" />
                  
                  {/* Photo Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-parchment font-sans text-xs">
                    <span className="font-serif text-lg text-white block">Rajesh Kumar</span>
                    <span className="text-sage-light">Licensed Master Electrician &bull; 10+ Yrs Exp</span>
                  </div>
                </div>

                {/* Secondary Offset Detail Crop */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-4 bg-bone rounded-md border border-mist shadow-card max-w-xs z-20">
                  <div className="w-12 h-12 rounded-sm bg-mineral text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink block">100% Background Checked</span>
                    <span className="text-[11px] text-charcoal-subtle leading-tight block">
                      Trade certification & photo ID manually audited before listing.
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 2. SERVICE CATEGORY DISCOVERY (Horizontal Editorial List) */}
      <section className="py-16 md:py-24 bg-parchment">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
                Service Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
                Services for the way you live.
              </h2>
            </div>
            <p className="text-sm text-charcoal-muted max-w-md leading-relaxed">
              From quick fixes to bigger projects, find professionals who know their craft.
            </p>
          </div>

          {/* Editorial Category Strips 01-08 */}
          <div className="border-t border-mist bg-parchment">
            {categories.map((category, idx) => (
              <CategoryRow key={category.id} category={category} index={idx} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/services">
              <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore All Services
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. TRUST SECTION — "People behind the work." */}
      <section className="py-16 md:py-24 bg-bone border-y border-mist">
        <Container>
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Our Standard of Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ink font-normal mb-4">
              People behind the work.
            </h2>
            <p className="text-base text-charcoal-muted leading-relaxed">
              We built Trusted Hands because finding a reliable professional should not depend on luck. We verify real people, audit trade skills, and maintain transparent customer feedback.
            </p>
          </div>

          {/* 4 Trust Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-parchment rounded-lg border border-mist flex flex-col justify-between space-y-4">
              <span className="font-serif text-3xl text-mist-dark">01</span>
              <div>
                <h4 className="font-serif text-xl text-ink font-normal mb-2">IDENTITY VERIFIED</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Government photo ID and active residential address checked for every listed partner.
                </p>
              </div>
            </div>

            <div className="p-6 bg-parchment rounded-lg border border-mist flex flex-col justify-between space-y-4">
              <span className="font-serif text-3xl text-mist-dark">02</span>
              <div>
                <h4 className="font-serif text-xl text-ink font-normal mb-2">SKILLS REVIEWED</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Trade certificates, electrical licenses, and prior craftsmanship portfolio items inspected.
                </p>
              </div>
            </div>

            <div className="p-6 bg-parchment rounded-lg border border-mist flex flex-col justify-between space-y-4">
              <span className="font-serif text-3xl text-mist-dark">03</span>
              <div>
                <h4 className="font-serif text-xl text-ink font-normal mb-2">CUSTOMER RATED</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Unedited reviews from real completed bookings ensure authentic ongoing accountability.
                </p>
              </div>
            </div>

            <div className="p-6 bg-parchment rounded-lg border border-mist flex flex-col justify-between space-y-4">
              <span className="font-serif text-3xl text-mist-dark">04</span>
              <div>
                <h4 className="font-serif text-xl text-ink font-normal mb-2">WORK HISTORY</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Transparent job count history so you can see proven local experience before booking.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. FEATURED PROVIDERS */}
      <section className="py-16 md:py-24 bg-parchment">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
                Top Vetted Partners
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
                Meet the people behind Trusted Hands.
              </h2>
            </div>
            <p className="text-sm text-charcoal-muted max-w-md leading-relaxed">
              Professionals with experience, great reviews, and a reputation for doing things properly.
            </p>
          </div>

          {/* Provider Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/providers">
              <Button variant="cta" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Verified Professionals
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 5. HOW IT WORKS — Visual Process */}
      <section className="py-16 md:py-24 bg-bone border-y border-mist">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Simple Booking Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
              Getting help should be simple.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-serif text-4xl text-mineral font-normal block">01</span>
              <h3 className="font-serif text-xl text-ink font-normal">CHOOSE A SERVICE</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Tell us what job needs doing — from minor fixture fixes to major house renovations.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-4xl text-mineral font-normal block">02</span>
              <h3 className="font-serif text-xl text-ink font-normal">MEET YOUR PROFESSIONAL</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Compare local vetted providers by experience, authentic reviews, and starting rates.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-4xl text-mineral font-normal block">03</span>
              <h3 className="font-serif text-xl text-ink font-normal">CHOOSE A TIME</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Select an arrival date and time slot that fits seamlessly into your schedule.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-serif text-4xl text-mineral font-normal block">04</span>
              <h3 className="font-serif text-xl text-ink font-normal">GET IT DONE</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Your professional arrives on time, completes the work cleanly, and payment is released.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. EDITORIAL BRAND STORY SECTION */}
      <section className="py-20 md:py-28 bg-ink text-parchment">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-sage-light block">
                Brand Philosophy
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif text-white font-normal leading-tight">
                Good service is personal.
              </h2>
              <p className="text-base text-sage-subtle leading-relaxed">
                Behind every booking on Trusted Hands is a real person who takes genuine pride in their craft. We are building a marketplace that respects independent tradespeople while giving clients total confidence.
              </p>
              <div className="pt-4 border-t border-slate/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate flex items-center justify-center text-sage-light font-serif">
                  TH
                </div>
                <div>
                  <span className="text-sm font-serif text-white block">Built for Real Craftsmanship</span>
                  <span className="text-xs text-sage-light">Connecting homes with local expertise</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-lg overflow-hidden border border-slate shadow-modal aspect-[16/10]">
                <img
                  src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80"
                  alt="Carpenter working on custom wood joinery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. DUAL CTA SECTIONS */}
      <section className="py-16 md:py-24 bg-parchment border-t border-mist">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Provider CTA */}
            <div className="p-8 md:p-10 bg-bone rounded-lg border border-mist flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
                  For Professionals
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-ink font-normal mb-3">
                  Your skills deserve to be found.
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  Join Trusted Hands and connect your work with local customers who value quality craftsmanship and transparent service.
                </p>
              </div>
              <div>
                <Link to="/how-it-works#provider">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Become a Provider
                  </Button>
                </Link>
              </div>
            </div>

            {/* Customer CTA */}
            <div className="p-8 md:p-10 bg-sage-subtle/50 rounded-lg border border-sage/40 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate block mb-2">
                  For Clients
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-ink font-normal mb-3">
                  Ready to find the right hands?
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  Browse vetted electricians, plumbers, carpenters, cleaners, and tutors in your area today.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/providers">
                  <Button variant="cta" size="md">
                    Find a Professional
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="md">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};
