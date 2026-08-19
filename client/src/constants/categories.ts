export interface CanonicalCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  popularServicesCount: number;
  isActive: boolean;
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  { id: 'cat-1', name: 'Home Cleaning', slug: 'home-cleaning', description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitization', iconName: 'Sparkles', popularServicesCount: 12, isActive: true },
  { id: 'cat-2', name: 'Electrical', slug: 'electrical', description: 'Wiring, circuit breaker repair, fan installation, lighting', iconName: 'Zap', popularServicesCount: 18, isActive: true },
  { id: 'cat-3', name: 'Carpentry', slug: 'carpentry', description: 'Custom furniture repair, door fitting, cabinet assembly', iconName: 'Hammer', popularServicesCount: 10, isActive: true },
  { id: 'cat-4', name: 'Painting', slug: 'painting', description: 'Interior & exterior wall painting, waterproof coating', iconName: 'Paintbrush', popularServicesCount: 15, isActive: true },
  { id: 'cat-5', name: 'Plumbing', slug: 'plumbing', description: 'Tap leak repair, pipe fitting, water tank cleaning', iconName: 'Droplet', popularServicesCount: 22, isActive: true },
  { id: 'cat-6', name: 'Beauty & Wellness', slug: 'beauty-wellness', description: 'At-home salon, massage therapy, grooming', iconName: 'Heart', popularServicesCount: 14, isActive: true },
  { id: 'cat-7', name: 'Tutoring', slug: 'tutoring', description: 'Academic home tuition, language coaching, skill mentoring', iconName: 'BookOpen', popularServicesCount: 9, isActive: true },
  { id: 'cat-8', name: 'Appliance Repair', slug: 'appliance-repair', description: 'AC servicing, refrigerator repair, washing machine fixing', iconName: 'Wrench', popularServicesCount: 25, isActive: true },
];

export const OFFICIAL_CATEGORIES = CANONICAL_CATEGORIES;
