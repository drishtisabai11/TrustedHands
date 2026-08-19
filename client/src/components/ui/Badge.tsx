import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ink' | 'slate' | 'mineral' | 'sage' | 'clay' | 'parchment' | 'outline' | 'verified' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sage',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1 rounded-sm font-sans font-medium",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-sm font-sans font-semibold",
  };

  const variantStyles = {
    ink: "bg-ink text-bone border border-transparent",
    slate: "bg-slate text-bone border border-transparent",
    mineral: "bg-brand text-bone border border-transparent",
    sage: "bg-seafoam/15 text-seafoam border border-seafoam/40",
    clay: "bg-brand/15 text-brand border border-brand/40",
    parchment: "bg-bone text-ink border border-mist",
    outline: "bg-transparent text-charcoal-muted border border-mist",
    verified: "bg-seafoam/15 text-seafoam border border-seafoam/40",
    primary: "bg-brand text-bone border border-transparent",
    secondary: "bg-slate text-bone border border-transparent",
  };

  return (
    <span className={`inline-flex items-center justify-center tracking-wide uppercase ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export interface VerificationBadgeProps {
  type?: 'identity' | 'background' | 'insured' | 'master';
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type = 'identity',
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const configs = {
    identity: {
      label: "Verified Professional",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-seafoam" />,
      variant: 'sage' as const,
    },
    background: {
      label: "Background Checked",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-seafoam" />,
      variant: 'sage' as const,
    },
    insured: {
      label: "Fully Insured",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-slate" />,
      variant: 'parchment' as const,
    },
    master: {
      label: "Master Craftsman",
      icon: <Award className="w-3.5 h-3.5 text-brass" />,
      variant: 'clay' as const,
    },
  };

  const config = configs[type];

  if (!showLabel) {
    return (
      <span 
        className={`inline-flex items-center justify-center p-1 rounded-full bg-seafoam/15 text-seafoam border border-seafoam/40 ${className}`}
        title={config.label}
      >
        {config.icon}
      </span>
    );
  }

  return (
    <Badge variant={config.variant} size={size} icon={config.icon} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;
