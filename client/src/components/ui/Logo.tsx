import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLink?: boolean;
  onDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showLink = true,
  onDark = false,
}) => {
  const sizeClasses = {
    sm: 'h-10 md:h-12',
    md: 'h-14 md:h-16',
    lg: 'h-16 md:h-20',
  };

  const imgContent = (
    <img
      src="/logo.png"
      alt="Trusted Hands - Local Services, Trusted People"
      className={`${sizeClasses[size]} w-auto object-contain transition-opacity hover:opacity-95 ${onDark ? 'bg-bone p-1.5 rounded-lg shadow-sm' : ''} ${className}`}
    />
  );

  if (showLink) {
    return (
      <Link to="/" className="inline-flex items-center shrink-0 focus-visible:outline-none" title="Trusted Hands">
        {imgContent}
      </Link>
    );
  }

  return imgContent;
};
