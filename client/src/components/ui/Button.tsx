import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'cta' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // Variant styles mapped strictly to brand system
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mineral focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5 h-8",
    md: "px-4 py-2.5 text-sm rounded-md gap-2 h-10",
    lg: "px-6 py-3.5 text-base rounded-md gap-2.5 h-12",
  };

  const variantStyles = {
    primary: "bg-ink text-parchment hover:bg-slate active:bg-ink-dark border border-transparent shadow-subtle",
    secondary: "bg-bone text-ink hover:bg-mist-light border border-mist active:bg-mist shadow-subtle",
    outline: "bg-transparent text-ink hover:bg-bone border border-mist hover:border-slate active:bg-mist-light",
    cta: "bg-mineral text-white hover:bg-mineral-hover active:bg-mineral-dark border border-transparent shadow-subtle",
    text: "bg-transparent text-charcoal hover:text-ink hover:bg-mist-light/50 border border-transparent px-2",
    danger: "bg-clay text-white hover:bg-clay-dark active:bg-clay-dark border border-transparent shadow-subtle",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
