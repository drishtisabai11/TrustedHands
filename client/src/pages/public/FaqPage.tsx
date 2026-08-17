import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { SearchInput } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { FAQ } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [query, setQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    marketplaceService.getFaqs().then(setFaqs);
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Header Banner */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Frequently Asked Questions', isCurrent: true },
              ]}
              className="mb-4"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Help Center & Directory
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
              Frequently Asked Questions.
            </h1>
            <p className="text-sm md:text-base text-charcoal-muted leading-relaxed font-sans mb-8">
              Find clear answers on provider verification, escrow payment protection, booking reschedules, and safety standards.
            </p>

            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search questions (e.g. verification, refund, booking cancel)..."
            />
          </div>
        </Container>
      </section>

      {/* Accordions */}
      <main className="flex-1 py-12 md:py-16">
        <Container>
          <Tabs
            tabs={[
              { id: 'ALL', label: 'All Questions' },
              { id: 'VERIFICATION', label: 'Verification & Safety' },
              { id: 'BOOKINGS', label: 'Bookings & Arrival' },
              { id: 'PAYMENTS', label: 'Payments & Escrow' },
              { id: 'PROVIDERS', label: 'For Providers' },
            ]}
            activeTab={activeCategory}
            onChange={setActiveCategory}
            className="mb-8"
          />

          <div className="space-y-4 max-w-3xl">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id}
                  className="bg-bone rounded-lg border border-mist overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-sans focus:outline-none"
                  >
                    <span className="font-serif text-lg text-ink font-normal">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-mineral shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-muted leading-relaxed border-t border-mist/40 font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 bg-bone rounded-lg border border-mist">
                <HelpCircle className="w-8 h-8 text-mist-dark mx-auto mb-2" />
                <h3 className="font-serif text-xl text-ink mb-1">No Matching Questions</h3>
                <p className="text-xs text-charcoal-subtle">
                  Try adjusting your search query or view all FAQ categories.
                </p>
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
};
