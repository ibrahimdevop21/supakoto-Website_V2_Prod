import React, { useState } from 'react';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';
import BranchMapAndLocator from './BranchMapAndLocator';
import BranchLocator from './BranchLocator';

interface ContactMapSectionProps {
  currentLocale: string;
  isRTL: boolean;
}

const ContactMapSection: React.FC<ContactMapSectionProps> = ({ currentLocale, isRTL }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return (
    <>
      {/* Map Component */}
      <BranchMapAndLocator 
        currentLocale={currentLocale}
        isRTL={isRTL}
        selectedBranch={selectedBranch}
        onBranchSelect={handleBranchSelect}
      />
      
      {/* Branch List Component - will be positioned full-width in the page layout */}
      <BranchLocator 
        currentLocale={currentLocale}
        isRTL={isRTL}
        selectedBranch={selectedBranch}
        onBranchSelect={handleBranchSelect}
      />
    </>
  );
};

export default ContactMapSection;
