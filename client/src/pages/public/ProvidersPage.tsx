import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { SearchInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { ProviderCard } from '../../components/marketplace/ProviderCard';
import { FilterSidebar, FilterState } from '../../components/marketplace/FilterSidebar';
import { Category, Provider } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { SlidersHorizontal, UserX } from 'lucide-react';

export const ProvidersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<FilterState>({
    categorySlug: searchParams.get('category') || '',
    location: searchParams.get('location') || 'all',
    minRating: Number(searchParams.get('rating')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 2000,
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'recommended',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    marketplaceService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    marketplaceService
      .getProviders({
        searchQuery,
        categorySlug: filters.categorySlug,
        location: filters.location,
        minRating: filters.minRating,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
      })
      .then(setProviders);
  }, [searchQuery, filters]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({
      categorySlug: '',
      location: 'all',
      minRating: 0,
      maxPrice: 2000,
      sortBy: 'recommended',
    });
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col font-sans selection:bg-mineral selection:text-white">
      <Header />

      {/* Header Banner */}
      <section className="bg-bone border-b border-mist py-12 md:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Verified Professionals Directory', isCurrent: true },
            ]}
            className="mb-4"
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-mineral block mb-2">
            Vetted Partner Directory
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-ink font-normal leading-tight mb-4">
            People you can trust with the work.
          </h1>
          <p className="text-sm md:text-base text-charcoal-muted leading-relaxed max-w-2xl font-sans mb-8">
            Filter licensed electricians, master carpenters, deep cleaning specialists, and local craftsmen by location, ratings, and starting rates.
          </p>

          {/* Inline Search Bar */}
          <div className="max-w-2xl">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by professional name, trade, or headline..."
            />
          </div>
        </Container>
      </section>

      {/* Main Directory Layout */}
      <main className="flex-1 py-12">
        <Container>
          
          {/* Top Bar for Results & Mobile Filter Trigger */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-mist">
            <div>
              <span className="font-serif text-xl sm:text-2xl text-ink font-normal">
                {providers.length} Verified Professional{providers.length === 1 ? '' : 's'} Found
              </span>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              leftIcon={<SlidersHorizontal className="w-4 h-4 text-mineral" />}
              className="lg:hidden"
            >
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Desktop Persistent Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>

            {/* Provider Grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>

              {providers.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-bone rounded-lg border border-mist my-6">
                  <UserX className="w-10 h-10 text-mist-dark mb-3" />
                  <h3 className="text-xl font-serif text-ink mb-1.5">No Professionals Match Your Search</h3>
                  <p className="text-xs text-charcoal-subtle max-w-sm mb-6">
                    Try broadening your rate filter, clearing category selection, or searching a different city location.
                  </p>
                  <Button variant="secondary" size="sm" onClick={handleReset}>
                    Reset Search Filters
                  </Button>
                </div>
              )}
            </div>

          </div>
        </Container>
      </main>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Professionals"
      >
        <FilterSidebar
          categories={categories}
          filters={filters}
          onChange={(updated) => {
            handleFilterChange(updated);
          }}
          onReset={handleReset}
          className="border-0 p-0 shadow-none bg-transparent"
        />
        <div className="pt-6 mt-6 border-t border-mist">
          <Button variant="cta" fullWidth onClick={() => setIsMobileFilterOpen(false)}>
            Apply Filters & View ({providers.length})
          </Button>
        </div>
      </Drawer>

      <Footer />
    </div>
  );
};
