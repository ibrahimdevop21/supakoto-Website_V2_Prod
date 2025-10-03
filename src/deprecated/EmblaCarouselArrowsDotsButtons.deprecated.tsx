import React from 'react';
import { ChevronLeft, ChevronRight } from '../icons/LightweightIcons';

interface PropType {
  enabled: boolean;
  onClick: () => void;
  isRTL?: boolean;
}

export const PrevButton: React.FC<PropType> = (props) => {
  const { enabled, onClick, isRTL = false } = props;
  
  // In RTL, "previous" should point right, in LTR it should point left
  const ArrowIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <button
      className="embla__button embla__button--prev disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-800/80 hover:via-slate-700/70 hover:to-slate-800/80 transition-all duration-200 border border-red-500/20 hover:border-red-500/40 shadow-lg"
      onClick={onClick}
      disabled={!enabled}
      aria-label="Previous slide"
    >
      <ArrowIcon className="w-6 h-6 text-white" />
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { enabled, onClick, isRTL = false } = props;
  
  // In RTL, "next" should point left, in LTR it should point right
  const ArrowIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <button
      className="embla__button embla__button--next disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-800/80 hover:via-slate-700/70 hover:to-slate-800/80 transition-all duration-200 border border-red-500/20 hover:border-red-500/40 shadow-lg"
      onClick={onClick}
      disabled={!enabled}
      aria-label="Next slide"
    >
      <ArrowIcon className="w-6 h-6 text-white" />
    </button>
  );
};

interface DotButtonPropType {
  selected: boolean;
  onClick: () => void;
}

export const DotButton: React.FC<DotButtonPropType> = (props) => {
  const { selected, onClick } = props;

  return (
    <button
      className={`embla__dot w-3 h-3 rounded-full mx-1 transition-all duration-300 ${selected ? 'bg-[#e32636] w-6' : 'bg-white/40 hover:bg-white/60'}`}
      type="button"
      onClick={onClick}
      aria-label="Go to slide"
    />
  );
};
