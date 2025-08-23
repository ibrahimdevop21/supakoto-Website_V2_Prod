import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';

interface BranchStateContextType {
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
}

const BranchStateContext = createContext<BranchStateContextType | undefined>(undefined);

export const useBranchState = () => {
  const context = useContext(BranchStateContext);
  if (!context) {
    throw new Error('useBranchState must be used within a BranchStateProvider');
  }
  return context;
};

interface BranchStateProviderProps {
  children: ReactNode;
}

export const BranchStateProvider: React.FC<BranchStateProviderProps> = ({ children }) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);

  return (
    <BranchStateContext.Provider value={{ selectedBranch, setSelectedBranch }}>
      {children}
    </BranchStateContext.Provider>
  );
};

export default BranchStateProvider;
