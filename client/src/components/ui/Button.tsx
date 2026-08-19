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
  // Variant styles mapped strictly to TERRACOTTA & FOREST system
  const baseStyles = "inline-flex items-center justify-center font-sans font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-sm gap-1.5 h-8",
    md: "px-4 py-2.5 text-sm rounded-md gap-2 h-10",
    lg: "px-6 py-3.5 text-base rounded-md gap-2.5 h-12",
  };

  const variantStyles = {
    primary: "bg-brand text-bone hover:bg-burnt active:bg-burnt border border-transparent shadow-subtle",
    secondary: "bg-burgundy text-bone hover:bg-burnt border border-transparent active:bg-burnt shadow-subtle",
    outline: "bg-transparent text-ink hover:bg-bone border border-mist hover:border-slate active:bg-parchment",
    cta: "bg-brand text-bone hover:bg-burnt active:bg-burnt border border-transparent shadow-subtle",
    text: "bg-transparent text-ink hover:text-brand hover:bg-parchment border border-transparent px-2",
    danger: "bg-burnt text-bone hover:bg-brand active:bg-brand border border-transparent shadow-subtle",
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
