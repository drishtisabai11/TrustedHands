import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Provider } from '../../types';
import { Star, MapPin, ArrowRight, Briefcase } from 'lucide-react';
import { VerificationBadge } from '../ui/Badge';
import { PriceDisplay } from '../ui/DomainPrimitives';

export interface ProviderCardProps {
  provider: Provider;
  className?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, className = '' }) => {
  return (
    <RouterLink
      to={`/providers/${provider.id}`}
      className={`
        group flex flex-col bg-bone rounded-lg border border-mist overflow-hidden 
        transition-all duration-300 hover:border-slate hover:shadow-card font-sans ${className}
      `}
    >
      {/* Image Header Container */}
      <div className="relative h-48 sm:h-52 w-full bg-parchment overflow-hidden shrink-0">
        <img
          src={provider.user.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80'}
          alt={provider.user.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
        
        {/* Verification Tag */}
        <div className="absolute top-3 left-3 z-10">
          <VerificationBadge type="identity" size="sm" />
        </div>

        {/* Location & Experience Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-parchment flex items-center justify-between text-xs z-10">
          <span className="flex items-center gap-1 font-medium drop-shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-sage-light" />
            {provider.location.city}, {provider.location.state}
          </span>
          <span className="flex items-center gap-1 bg-ink/70 backdrop-blur-xs px-2 py-0.5 rounded-xs text-[11px] font-semibold border border-slate/50">
            <Briefcase className="w-3 h-3 text-sage-light" />
            {provider.yearsOfExperience}+ Yrs Exp
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-serif text-xl font-normal text-ink group-hover:text-mineral transition-colors line-clamp-1">
              {provider.user.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-parchment px-2 py-0.5 rounded-sm border border-mist text-xs">
              <Star className="w-3.5 h-3.5 fill-clay text-clay" />
              <span className="font-bold text-charcoal">{provider.rating.toFixed(1)}</span>
              <span className="text-charcoal-subtle text-[11px]">({provider.reviewCount})</span>
            </div>
          </div>

          {/* Business Name / Trade Headline */}
          {provider.businessName && (
            <span className="text-xs font-semibold uppercase tracking-wider text-mineral block mb-1">
              {provider.businessName}
            </span>
          )}

          <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
            {provider.headline}
          </p>
        </div>

        {/* Bottom Pricing & CTA */}
        <div className="pt-3 border-t border-mist flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-charcoal-subtle block">Starting from</span>
            <PriceDisplay amount={provider.hourlyRate} unit="hour" size="sm" />
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-semibold text-ink group-hover:text-mineral transition-colors">
            <span>VIEW PROFILE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </RouterLink>
  );
};
