import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Category } from '../../types';
import { ArrowUpRight } from 'lucide-react';

export interface CategoryRowProps {
  category: Category;
  index: number;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ category, index }) => {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <RouterLink
      to={`/services/${category.slug}`}
      className="group flex flex-col md:flex-row md:items-center justify-between py-6 px-4 sm:px-6 border-b border-mist hover:bg-bone transition-all duration-300 font-sans"
    >
      <div className="flex items-start md:items-center gap-6">
        {/* Numbering */}
        <span className="font-serif text-2xl md:text-3xl text-mist-dark group-hover:text-mineral transition-colors shrink-0">
          {formattedIndex}
        </span>

        {/* Text & Description */}
        <div className="max-w-xl">
          <h3 className="font-serif text-xl sm:text-2xl text-ink group-hover:text-mineral transition-colors mb-1 font-normal">
            {category.name}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Action Right */}
      <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 shrink-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-subtle">
          {category.popularServicesCount} Verified Services
        </span>
        <div className="w-10 h-10 rounded-full bg-parchment border border-mist group-hover:bg-ink group-hover:text-parchment group-hover:border-ink flex items-center justify-center transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </RouterLink>
  );
};
