import React, { useState } from 'react';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';
import BranchMapOnly from './BranchMapOnly';
import BranchLocator from './BranchLocator';

interface BranchMapAndLocatorProps {
  currentLocale: string;
  isRTL: boolean;
  onBranchSelect?: (branch: Branch) => void;
  selectedBranch?: Branch;
}

const BranchMapAndLocator: React.FC<BranchMapAndLocatorProps> = ({ 
  currentLocale, 
  isRTL, 
  onBranchSelect,
  selectedBranch = branches[0]
}) => {
  return (
    <BranchMapOnly 
      currentLocale={currentLocale}
      isRTL={isRTL}
      selectedBranch={selectedBranch}
      onBranchSelect={onBranchSelect}
    />
  );
};

export default BranchMapAndLocator;
