export interface OfficialCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export const OFFICIAL_CATEGORIES: OfficialCategory[] = [
  {
    id: 'cat-cleaning',
    name: 'Home Cleaning',
    slug: 'cleaning',
    description: 'Thoughtful cleaning services for homes that need a little more care.',
    iconName: 'Sparkles',
  },
  {
    id: 'cat-electrical',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Reliable help with installations, repairs and everyday electrical work.',
    iconName: 'Zap',
  },
  {
    id: 'cat-carpentry',
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Skilled hands for furniture, fixtures, repairs and custom work.',
    iconName: 'Hammer',
  },
  {
    id: 'cat-painting',
    name: 'Painting',
    slug: 'painting',
    description: 'Fresh walls, careful finishes and professionals who take pride in the details.',
    iconName: 'Paintbrush',
  },
  {
    id: 'cat-plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Fast, practical help for leaks, fittings, fixtures and repairs.',
    iconName: 'Droplets',
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Wellness',
    slug: 'beauty',
    description: 'Personal care from experienced professionals who come to you.',
    iconName: 'Smile',
  },
  {
    id: 'cat-tutoring',
    name: 'Tutoring',
    slug: 'tutoring',
    description: 'Find patient, experienced tutors for focused one-to-one learning.',
    iconName: 'BookOpen',
  },
  {
    id: 'cat-appliance',
    name: 'Appliance Repair',
    slug: 'appliance',
    description: 'Practical repair help for the appliances your home depends on.',
    iconName: 'Wrench',
  },
];

export const VALID_CATEGORY_NAMES = OFFICIAL_CATEGORIES.map((c) => c.name);
export const VALID_CATEGORY_SLUGS = OFFICIAL_CATEGORIES.map((c) => c.slug);
