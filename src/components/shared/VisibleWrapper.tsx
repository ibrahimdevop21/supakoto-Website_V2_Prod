import React from 'react';
import type { ReactNode } from 'react';

interface VisibleWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * A simple wrapper component that ensures its children are always visible
 * This helps with Astro island hydration issues where components might disappear
 */
const VisibleWrapper: React.FC<VisibleWrapperProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`opacity-100 ${className}`} style={{ opacity: 1 }}>
      {children}
    </div>
  );
};

export default VisibleWrapper;
