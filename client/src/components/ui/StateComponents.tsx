import React from 'react';
import { Loader2 } from 'lucide-react';
import Button from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-bone rounded-lg border border-mist my-6 font-sans ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-full bg-parchment flex items-center justify-center text-slate mb-4 border border-mist">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-serif font-normal text-ink mb-1.5">{title}</h3>
      <p className="text-xs text-charcoal-subtle max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading verified details...",
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className="w-6 h-6 text-mineral animate-spin mb-3" />
      <span className="text-xs font-medium text-charcoal-subtle uppercase tracking-wider font-sans">
        {label}
      </span>
    </div>
  );
};

export interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
}) => {
  return (
    <div
      className={`bg-mist/40 animate-pulse rounded-xs ${height} ${width} ${className}`}
      aria-hidden="true"
    />
  );
};
