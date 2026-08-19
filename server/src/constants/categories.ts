export const CANONICAL_CATEGORIES = [
  {
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Deep house cleaning, kitchen scrubbing, bathroom sanitization, and sofa shampooing',
    iconName: 'Sparkles',
    isActive: true,
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    description: 'Wiring, circuit breaker repair, fan installation, lighting, and electrical troubleshooting',
    iconName: 'Zap',
    isActive: true,
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Custom furniture repair, door fitting, cabinet assembly, and woodwork restoration',
    iconName: 'Hammer',
    isActive: true,
  },
  {
    name: 'Painting',
    slug: 'painting',
    description: 'Interior & exterior wall painting, waterproof coating, and decorative texture finish',
    iconName: 'Paintbrush',
    isActive: true,
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Tap leak repair, pipe fitting, water tank cleaning, drainage unclogging, and bath fixtures',
    iconName: 'Droplet',
    isActive: true,
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'At-home salon, massage therapy, grooming, and personal care services',
    iconName: 'Heart',
    isActive: true,
  },
  {
    name: 'Tutoring',
    slug: 'tutoring',
    description: 'Academic home tuition, language coaching, music lessons, and skill mentoring',
    iconName: 'BookOpen',
    isActive: true,
  },
  {
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'AC servicing, refrigerator repair, washing machine fixing, and microwave service',
    iconName: 'Wrench',
    isActive: true,
  },
];

export const OFFICIAL_CATEGORIES = CANONICAL_CATEGORIES;
export const VALID_CATEGORY_NAMES = CANONICAL_CATEGORIES.map((c) => c.name);
export const VALID_CATEGORY_SLUGS = CANONICAL_CATEGORIES.map((c) => c.slug);
