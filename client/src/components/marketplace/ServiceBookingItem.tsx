import React from 'react';
import { Service } from '../../types';
import { Button } from '../ui/Button';
import { PriceDisplay } from '../ui/DomainPrimitives';
import { Clock, Check } from 'lucide-react';

export interface ServiceBookingItemProps {
  service: Service;
  onBook: (service: Service) => void;
  className?: string;
}

export const ServiceBookingItem: React.FC<ServiceBookingItemProps> = ({
  service,
  onBook,
  className = '',
}) => {
  return (
    <div className={`p-5 bg-bone rounded-lg border border-mist flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans ${className}`}>
      <div className="space-y-2 max-w-xl">
        <div className="flex items-center gap-2">
          <h4 className="font-serif text-lg text-ink font-normal">{service.title}</h4>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal-subtle bg-parchment px-2 py-0.5 rounded border border-mist shrink-0">
            <Clock className="w-3 h-3 text-mist-dark" />
            {service.estimatedDurationMinutes} mins
          </span>
        </div>
        <p className="text-xs text-charcoal-muted leading-relaxed">{service.description}</p>
        
        {service.includedTasks && service.includedTasks.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {service.includedTasks.map((task, idx) => (
              <span key={idx} className="text-[11px] text-charcoal-subtle flex items-center gap-1">
                <Check className="w-3 h-3 text-mineral shrink-0" />
                {task}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-mist">
        <PriceDisplay amount={service.basePrice} unit={service.priceType === 'HOURLY' ? 'hour' : 'fixed'} size="md" />
        <Button variant="cta" size="sm" onClick={() => onBook(service)}>
          BOOK THIS SERVICE
        </Button>
      </div>
    </div>
  );
};
