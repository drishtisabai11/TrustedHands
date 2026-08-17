import React from 'react';
import { VerificationStatus, BookingStatus } from '../../types';
import { Badge } from './Badge';
import { MapPin, ShieldCheck, Star } from 'lucide-react';

export interface StatusIndicatorProps {
  status: BookingStatus | VerificationStatus;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, className = '' }) => {
  const configs: Record<string, { label: string; variant: 'slate' | 'mineral' | 'sage' | 'clay' | 'parchment' | 'outline' }> = {
    PENDING: { label: 'Pending Confirmation', variant: 'parchment' },
    CONFIRMED: { label: 'Confirmed', variant: 'slate' },
    IN_PROGRESS: { label: 'In Progress', variant: 'mineral' },
    COMPLETED: { label: 'Completed', variant: 'sage' },
    CANCELLED: { label: 'Cancelled', variant: 'clay' },
    DISPUTED: { label: 'Under Review', variant: 'clay' },
    VERIFIED: { label: 'Verified Partner', variant: 'mineral' },
    UNVERIFIED: { label: 'Verification Pending', variant: 'outline' },
    SUBMITTED: { label: 'Documents Submitted', variant: 'parchment' },
    REJECTED: { label: 'Verification Required', variant: 'clay' },
  };

  const config = configs[status] || { label: status, variant: 'outline' };

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
};

export interface ServiceLabelProps {
  category: string;
  className?: string;
}

export const ServiceLabel: React.FC<ServiceLabelProps> = ({ category, className = '' }) => {
  return (
    <span className={`text-xs font-semibold tracking-wider uppercase text-mineral font-sans ${className}`}>
      {category}
    </span>
  );
};

export interface ProviderMetaProps {
  name: string;
  headline?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  className?: string;
}

export const ProviderMeta: React.FC<ProviderMetaProps> = ({
  name,
  headline,
  location,
  rating,
  reviewCount,
  isVerified = true,
  className = '',
}) => {
  return (
    <div className={`font-sans ${className}`}>
      <div className="flex items-center gap-1.5">
        <h4 className="font-serif font-normal text-lg text-ink">{name}</h4>
        {isVerified && (
          <span title="Verified Professional">
            <ShieldCheck className="w-4 h-4 text-mineral shrink-0" />
          </span>
        )}
      </div>
      {headline && <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">{headline}</p>}
      <div className="flex items-center gap-3 mt-1.5 text-xs text-charcoal-subtle">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-mist-dark" />
            {location}
          </span>
        )}
        {rating !== undefined && (
          <span className="flex items-center gap-1 font-semibold text-charcoal">
            <Star className="w-3.5 h-3.5 text-clay fill-clay" />
            {rating.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
          </span>
        )}
      </div>
    </div>
  );
};

export interface PriceDisplayProps {
  amount: number;
  unit?: 'hour' | 'fixed' | 'quote';
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  unit = 'fixed',
  currency = '₹',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-serif font-normal',
  };

  return (
    <div className={`inline-flex items-baseline gap-1 font-sans ${className}`}>
      <span className={`${sizeClasses[size]} text-ink`}>
        {currency}{amount.toLocaleString()}
      </span>
      {unit === 'hour' && (
        <span className="text-xs text-charcoal-subtle font-normal">/ hr</span>
      )}
      {unit === 'quote' && (
        <span className="text-xs text-charcoal-subtle font-normal">est.</span>
      )}
    </div>
  );
};
