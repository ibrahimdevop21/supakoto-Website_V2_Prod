import React, { useState, Suspense, lazy } from 'react';
import type { Branch } from '../../data/branches';

// Lazy load the actual BranchLocator component
const BranchLocator = lazy(() => import('./BranchLocator'));

interface LazyBranchLocatorProps {
  currentLocale: string;
  isRTL: boolean;
  selectedBranch?: Branch;
  onBranchSelect?: (branch: Branch) => void;
}

const MapPlaceholder: React.FC = () => (
  <div className="w-full h-96 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center backdrop-blur-sm">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center border border-red-500/30">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <p className="text-white font-medium">Loading Interactive Map...</p>
        <p className="text-gray-400 text-sm">Click to view branch locations</p>
      </div>
    </div>
  </div>
);

const LazyBranchLocator: React.FC<LazyBranchLocatorProps> = (props) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  if (!shouldLoad) {
    return (
      <div onClick={() => setShouldLoad(true)} className="cursor-pointer">
        <MapPlaceholder />
      </div>
    );
  }

  return (
    <Suspense fallback={<MapPlaceholder />}>
      <BranchLocator {...props} />
    </Suspense>
  );
};

export default LazyBranchLocator;
