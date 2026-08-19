import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    sm: 'h-12 md:h-14',
    md: 'h-16 md:h-20',
    lg: 'h-20 md:h-24',
    xl: 'h-24 md:h-28',
  };

  const imgContent = (
    <img
      src="/logo.png"
      alt="Trusted Hands - Local Services, Trusted People"
      className={`${sizeClasses[size]} w-auto object-contain transition-transform hover:scale-105 ${onDark ? 'bg-bone p-2 rounded-xl shadow-card' : ''} ${className}`}
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

export default Logo;
