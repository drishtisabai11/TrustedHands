import { Category, Provider, Service, Review, FAQ } from '../types';
import { MOCK_CATEGORIES, MOCK_PROVIDERS, MOCK_SERVICES, MOCK_REVIEWS, MOCK_FAQS } from '../data/mockData';

export interface ProviderFilterOptions {
  categorySlug?: string;
  searchQuery?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'recommended' | 'rating' | 'experience' | 'price_asc';
  isVerifiedOnly?: boolean;
}

export const marketplaceService = {
  // Get all active service categories
  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES.filter((c) => c.isActive);
  },

  // Get single category by slug
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return MOCK_CATEGORIES.find((c) => c.slug === slug);
  },

  // Get services filtered by category
  async getServices(categorySlug?: string): Promise<Service[]> {
    if (!categorySlug) return MOCK_SERVICES;
    const cat = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
    if (!cat) return [];
    return MOCK_SERVICES.filter((s) => s.categoryId === cat.id);
  },

  // Query providers with filters & sorting
  async getProviders(options: ProviderFilterOptions = {}): Promise<Provider[]> {
    let list = [...MOCK_PROVIDERS];

    // Filter by Category
    if (options.categorySlug) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === options.categorySlug);
      if (cat) {
        list = list.filter((p) => p.categories.includes(cat.id));
      }
    }

    // Filter by Search Query
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.user.name.toLowerCase().includes(q) ||
          p.headline.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q) ||
          (p.businessName && p.businessName.toLowerCase().includes(q))
      );
    }

    // Filter by Location
    if (options.location && options.location !== 'all') {
      const loc = options.location.toLowerCase();
      list = list.filter((p) => p.location.city.toLowerCase().includes(loc));
    }

    // Filter by Minimum Rating
    if (options.minRating) {
      list = list.filter((p) => p.rating >= options.minRating!);
    }

    // Filter by Maximum Hourly Rate
    if (options.maxPrice) {
      list = list.filter((p) => p.hourlyRate <= options.maxPrice!);
    }

    // Sort Options
    if (options.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (options.sortBy === 'experience') {
      list.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    } else if (options.sortBy === 'price_asc') {
      list.sort((a, b) => a.hourlyRate - b.hourlyRate);
    }

    return list;
  },

  // Get single provider by ID
  async getProviderById(id: string): Promise<Provider | undefined> {
    return MOCK_PROVIDERS.find((p) => p.id === id || p.userId === id);
  },

  // Get reviews for a provider or all reviews
  async getReviews(providerId?: string): Promise<Review[]> {
    if (!providerId) return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter((r) => r.providerId === providerId);
  },

  // Get FAQs grouped or filtered by category
  async getFaqs(category?: string): Promise<FAQ[]> {
    if (!category || category === 'ALL') return MOCK_FAQS;
    return MOCK_FAQS.filter((f) => f.category === category);
  },
};
