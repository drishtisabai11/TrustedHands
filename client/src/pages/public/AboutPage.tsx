import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-bone border-b border-mist py-12 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'About Trusted Hands', isCurrent: true },
              ]}
              className="mb-4"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Our Story & Marketplace Philosophy
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-ink font-normal leading-tight mb-6">
              Good service is personal.
            </h1>
            <p className="text-base md:text-lg text-charcoal-muted leading-relaxed font-sans">
              Trusted Hands was created to fix a fundamental problem in local services: the difficulty of finding reliable, skilled professionals without depending on random recommendations or anonymous directory apps.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Story Content */}
      <main className="flex-1 py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Why We Exist
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-ink font-normal">
                Connecting homes with local craft & genuine human trust.
              </h2>
              <p className="text-sm sm:text-base text-charcoal leading-relaxed">
                Whether you need a licensed electrician to audit your home power panel safely, a master carpenter to fit custom bedroom wardrobes, or a deep cleaning specialist before moving into a new home, quality work depends entirely on the person doing the job.
              </p>
              <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
                We believe independent professionals deserve a platform that respects their trade, highlights their verified credentials, and presents their work with editorial dignity.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-lg overflow-hidden border border-mist shadow-elevated aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                  alt="Home professional carefully inspecting work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 3 Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-b border-mist my-12">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-sage-subtle text-mineral flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink font-normal">Rigorously Vetted</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Government photo ID confirmation, trade certificate auditing, and active background checks for every partner.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-sage-subtle text-mineral flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink font-normal">Transparent Respect</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Upfront pricing, unedited reviews, and zero hidden platform charges for clients and independent professionals.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-sage-subtle text-mineral flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-ink font-normal">Escrow Protection</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Your payment is held safely in escrow architecture and released only after the service job is completed cleanly.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 bg-bone rounded-lg border border-mist text-center max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-3xl font-serif text-ink font-normal">
              Experience local services done properly.
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-lg mx-auto">
              Explore our directory of verified local service professionals or join as an independent tradesperson today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <RouterLink to="/providers">
                <Button variant="cta" size="lg">
                  Find a Professional
                </Button>
              </RouterLink>
              <RouterLink to="/how-it-works#provider">
                <Button variant="outline" size="lg">
                  Become a Provider
                </Button>
              </RouterLink>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
