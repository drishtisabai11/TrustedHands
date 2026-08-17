import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { SearchInput } from '../../components/ui/Input';
import { CategoryRow } from '../../components/marketplace/CategoryRow';
import { Category } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';

export const ServicesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    marketplaceService.getCategories().then(setCategories);
  }, []);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <div className="max-w-3xl">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'All Services Directory', isCurrent: true },
              ]}
              className="mb-4"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
              Service Taxonomy
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
              Find the right service for the job.
            </h1>
            <p className="text-sm md:text-base text-charcoal-muted leading-relaxed font-sans mb-8">
              Explore vetted trade categories. Every service is performed by verified local professionals who take pride in doing things properly.
            </p>

            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search service categories (e.g. Electrical, Cleaning, Plumbing)..."
            />
          </div>
        </Container>
      </section>

      <main className="flex-1 py-12 md:py-20">
        <Container>
          <div className="border-t border-mist bg-parchment">
            {filteredCategories.map((category, idx) => (
              <CategoryRow key={category.id} category={category} index={idx} />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16 bg-bone rounded-lg border border-mist my-6">
              <h3 className="font-serif text-xl text-ink mb-2">No Service Categories Match</h3>
              <p className="text-xs text-charcoal-subtle">
                Try clearing your search query to view all available service trades.
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};
