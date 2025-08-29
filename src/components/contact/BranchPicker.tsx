import React, { useState, useEffect } from 'react';
import type { Branch } from '../../data/branches';

interface BranchPickerProps {
  branches: Branch[];
  selectedId: Branch['id'];
}

export default function BranchPicker({ branches, selectedId }: BranchPickerProps) {
  const [selected, setSelected] = useState<Branch['id']>(selectedId);

  const handleChange = (branchId: Branch['id']) => {
    setSelected(branchId);
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      window.dispatchEvent(new CustomEvent('branch:changed', { detail: branch }));
    }
  };

  // Handle deep link updates
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const branchParam = urlParams.get('branch');
    if (branchParam && branches.find(b => b.id === branchParam)) {
      setSelected(branchParam as Branch['id']);
      const branch = branches.find(b => b.id === branchParam);
      if (branch) {
        window.dispatchEvent(new CustomEvent('branch:changed', { detail: branch }));
      }
    }
  }, [branches]);

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-white mb-4">
        اختر الفرع
      </label>
      
      {/* Mobile: Select dropdown */}
      <div className="block md:hidden">
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value as Branch['id'])}
          className="w-full bg-neutral-800 rounded-xl p-3 text-white border border-neutral-700 focus:border-[#bf1e2e] focus:outline-none min-w-0"
          dir="rtl"
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Grid of cards */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <label
            key={branch.id}
            className={`
              relative cursor-pointer rounded-2xl border p-4 transition-all duration-200
              ${selected === branch.id 
                ? 'border-[#bf1e2e] bg-[#bf1e2e]/10' 
                : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
              }
            `}
          >
            <input
              type="radio"
              name="branch"
              value={branch.id}
              checked={selected === branch.id}
              onChange={() => handleChange(branch.id)}
              className="sr-only"
            />
            <div className="text-right" dir="rtl">
              <h3 className="font-semibold text-white text-lg mb-2">
                {branch.name}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {branch.address}
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <span className="text-xs text-neutral-500" dir="ltr">
                  {branch.phones[0]}
                </span>
                <div className={`
                  w-3 h-3 rounded-full border-2 transition-colors
                  ${selected === branch.id 
                    ? 'border-[#bf1e2e] bg-[#bf1e2e]' 
                    : 'border-neutral-600'
                  }
                `} />
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
