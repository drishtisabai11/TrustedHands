import React from 'react';
import { BookingStatus } from '../../types';
import { Check, ShieldCheck, MapPin, Wrench, CheckCircle2 } from 'lucide-react';

export interface BookingTimelineProps {
  status: BookingStatus;
  className?: string;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ status, className = '' }) => {
  const steps = [
    { key: 'CONFIRMED', label: 'Booking Confirmed', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'PROVIDER_ACCEPTED', label: 'Provider Accepted', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'ON_THE_WAY', label: 'On The Way', icon: <MapPin className="w-4 h-4" /> },
    { key: 'SERVICE_STARTED', label: 'Service Started', icon: <Wrench className="w-4 h-4" /> },
    { key: 'COMPLETED', label: 'Completed', icon: <Check className="w-4 h-4" /> },
  ];

  const statusOrder: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 1,
    PROVIDER_ACCEPTED: 2,
    ON_THE_WAY: 3,
    SERVICE_STARTED: 4,
    COMPLETED: 5,
    CANCELLED: -1,
  };

  const currentStepIndex = statusOrder[status] || 1;

  if (status === 'CANCELLED') {
    return (
      <div className={`p-4 bg-clay/10 border border-clay/30 rounded-md font-sans text-xs text-clay-dark ${className}`}>
        <strong className="block mb-0.5">Booking Status: Cancelled</strong>
        <span>This booking was cancelled and is no longer active.</span>
      </div>
    );
  }

  return (
    <div className={`font-sans py-4 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-mist z-0" />
        <div 
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-mineral transition-all duration-500 z-0" 
          style={{ width: `${Math.min(100, (currentStepIndex - 1) * 25)}%` }}
        />

        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isPassed = stepNumber <= currentStepIndex;
          const isCurrent = stepNumber === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 text-xs font-bold
                  ${isCurrent 
                    ? 'bg-mineral text-white border-mineral ring-4 ring-mineral/20 shadow-subtle' 
                    : isPassed 
                    ? 'bg-ink text-parchment border-ink' 
                    : 'bg-bone text-charcoal-subtle border-mist'}
                `}
              >
                {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span className={`text-[11px] mt-2 font-medium text-center max-w-[80px] leading-tight ${isCurrent ? 'text-ink font-bold' : isPassed ? 'text-charcoal' : 'text-charcoal-subtle'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
