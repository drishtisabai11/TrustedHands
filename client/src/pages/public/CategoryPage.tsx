import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { ProviderCard } from '../../components/marketplace/ProviderCard';
import { Category, Provider, Service } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { ShieldCheck, Check } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (categorySlug) {
      marketplaceService.getCategoryBySlug(categorySlug).then((cat) => {
        if (cat) {
          setCategory(cat);
          marketplaceService.getServices(cat.slug).then(setServices);
          marketplaceService.getProviders({ categorySlug: cat.slug }).then(setProviders);
        }
      });
    }
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col font-sans">
        <Header />
        <Container className="py-20 text-center flex-1">
          <h2 className="font-serif text-2xl text-ink">Category Loading or Not Found</h2>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Header Banner */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services', href: '/services' },
              { label: category.name, isCurrent: true },
            ]}
            className="mb-4"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-mineral block">
                Verified Trade Category
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight">
                Trusted {category.name.toLowerCase()} professionals for every kind of job.
              </h1>
              <p className="text-sm md:text-base text-charcoal-muted leading-relaxed max-w-2xl">
                {category.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-ink pt-2">
                <span className="flex items-center gap-1.5 bg-parchment px-3 py-1 rounded border border-mist">
                  <ShieldCheck className="w-4 h-4 text-mineral" /> 100% Background Checked
                </span>
                <span className="flex items-center gap-1.5 bg-parchment px-3 py-1 rounded border border-mist">
                  <Check className="w-4 h-4 text-mineral" /> Transparent Hourly & Fixed Rates
                </span>
              </div>
            </div>

            {category.imageUrl && (
              <div className="lg:col-span-4 hidden lg:block">
                <div className="rounded-lg overflow-hidden border border-mist aspect-[4/3] shadow-card">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Available Services Strip */}
      {services.length > 0 && (
        <section className="py-8 bg-parchment border-b border-mist">
          <Container>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-4">
              Popular Service Tasks Included in this Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {services.map((srv) => (
                <div key={srv.id} className="p-3 bg-bone rounded border border-mist flex items-start gap-2">
                  <Check className="w-4 h-4 text-mineral shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-ink block">{srv.title}</span>
                    <span className="text-[11px] text-charcoal-subtle">Starting from ₹{srv.basePrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Provider Results */}
      <main className="flex-1 py-12 md:py-16">
        <Container>
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-mist">
            <div>
              <h2 className="font-serif text-2xl text-ink font-normal">
                Available {category.name} Professionals
              </h2>
              <span className="text-xs text-charcoal-subtle">
                Showing {providers.length} verified professional{providers.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {providers.length === 0 && (
            <div className="text-center py-16 bg-bone rounded-lg border border-mist">
              <h3 className="font-serif text-xl text-ink mb-2">No Professionals Found in this Category</h3>
              <p className="text-xs text-charcoal-subtle">
                We are actively onboarding new verified professionals for {category.name}. Check back soon or browse all providers.
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};
