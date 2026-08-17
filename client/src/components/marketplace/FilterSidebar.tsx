import React from 'react';
import { Category } from '../../types';
import { Select } from '../ui/Select';
import { Radio } from '../ui/FormControls';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export interface FilterState {
  categorySlug: string;
  location: string;
  minRating: number;
  maxPrice: number;
  sortBy: 'recommended' | 'rating' | 'experience' | 'price_asc';
}

export interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onChange: (updatedFilters: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  return (
    <aside className={`p-6 bg-bone rounded-lg border border-mist font-sans space-y-6 ${className}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-mist">
        <span className="font-serif text-lg text-ink flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-mineral" />
          Filter Professionals
        </span>
        <button
          onClick={onReset}
          className="text-xs text-charcoal-subtle hover:text-ink flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. Service Category */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted block mb-2">
          Service Category
        </label>
        <Select
          value={filters.categorySlug}
          onChange={(e) => onChange({ categorySlug: e.target.value })}
          options={[
            { value: '', label: 'All Verified Categories' },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
      </div>

      {/* 2. City Location */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted block mb-2">
          City Location
        </label>
        <Select
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          options={[
            { value: 'all', label: 'All Cities' },
            { value: 'mumbai', label: 'Mumbai' },
            { value: 'delhi', label: 'Delhi NCR' },
            { value: 'bengaluru', label: 'Bengaluru' },
            { value: 'ahmedabad', label: 'Ahmedabad' },
          ]}
        />
      </div>

      {/* 3. Minimum Rating */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted block">
          Minimum Customer Rating
        </label>
        <Radio
          name="min-rating"
          label="Any Rating"
          checked={filters.minRating === 0}
          onChange={() => onChange({ minRating: 0 })}
        />
        <Radio
          name="min-rating"
          label="4.5★ & Above"
          checked={filters.minRating === 4.5}
          onChange={() => onChange({ minRating: 4.5 })}
        />
        <Radio
          name="min-rating"
          label="4.8★ & Above (Top Rated)"
          checked={filters.minRating === 4.8}
          onChange={() => onChange({ minRating: 4.8 })}
        />
      </div>

      {/* 4. Maximum Rate Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Max Hourly Rate
          </label>
          <span className="text-xs font-bold text-ink">₹{filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="300"
          max="2000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-mineral cursor-pointer"
        />
      </div>

      {/* 5. Sort By */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted block mb-2">
          Sort Providers By
        </label>
        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          options={[
            { value: 'recommended', label: 'Recommended' },
            { value: 'rating', label: 'Highest Rated' },
            { value: 'experience', label: 'Most Experienced' },
            { value: 'price_asc', label: 'Price: Low to High' },
          ]}
        />
      </div>
    </aside>
  );
};
