import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'normal' | 'narrow' | 'wide';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'normal',
  className = '',
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    normal: 'max-w-7xl',
    wide: 'max-w-[1400px]',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
