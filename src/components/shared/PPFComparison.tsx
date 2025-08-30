import React, { useState, useId, useEffect, useRef } from 'react';
import { ppfComparisonData, type PPFComparisonData, type Locale } from '../../data/ppfComparisonData';
import clsx from 'clsx';

interface PPFComparisonProps {
  locale?: Locale;
  data?: PPFComparisonData;
  className?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

// Icon components for enhanced content
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

// Column widths so mobile shows Feature + 1 compare column
const mobileFirstColW = 'w-[44vw] min-w-[44vw]';
const mobileDataColW  = 'w-[56vw] min-w-[56vw]';

// Solid background for sticky cells to avoid iOS translucent banding
const cardBgSolid = 'bg-[#0b1220]'; // very dark blue/black

// Spacing rhythm
const cellX = 'px-4 md:px-6';
const cellY = 'py-3 md:py-4 lg:py-5';

// Concise copy generator (English + Arabic)
type ShortenOptions = { locale: 'en' | 'ar'; maxLen?: number };

const replacementsEn: Array<[RegExp, string]> = [
  [/approximately|approx\.?|about/gi, '≈'],
  [/up to/gi, 'to'],
  [/years?/gi, 'yrs'],
  [/manufacturer|manufacturing/gi, 'mfg'],
  [/quality control/gi, 'QC'],
  [/resistance/gi, 'resist.'],
  [/installation/gi, 'install'],
  [/crystal[-\s]?clear/gi, 'crystal-clear'],
  [/desert[-\s]?proof/gi, 'desert-proof'],
  [/real[-\s]?world/gi, 'real-world'],
];

const replacementsAr: Array<[RegExp, string]> = [
  // Arabic: concise, clear, not literal
  [/تقريبًا|حوالي/gi, '≈'],
  [/حتى/gi, 'حتى'], // keep
  [/سنوات?/gi, 'سنة'],
  [/الصناعة|التصنيع/gi, 'تصنيع'],
  [/جودة|رقابة الجودة/gi, 'جودة صارمة'],
  [/المقاومة/gi, 'مقاومة'],
  [/التركيب/gi, 'تركيب'],
  [/شفاف(?:ة)? تمامًا/gi, 'شفافية عالية'],
  [/مقاوم(?:ة)? للصحراء/gi, 'مقاومة للحرارة والغبار'],
  [/واقعي(?:ة)?/gi, 'فعلي'],
];

function compactWhitespace(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

function shortenCopy(input: string, { locale, maxLen = 56 }: ShortenOptions): string {
  if (typeof input !== 'string') return input as any;
  let s = input;

  const reps = locale === 'ar' ? replacementsAr : replacementsEn;
  for (const [re, to] of reps) s = s.replace(re, to);

  // Remove trailing punctuation clutter
  s = s.replace(/[.;,:，،]+$/g, '');

  // If still long, prefer keeping numbers/units/keywords
  if (s.length > maxLen) {
    // keep first sentence-ish chunk
    const first = s.split(/[—–\-•|]/)[0].trim();
    if (first.length >= maxLen * 0.6) s = first;
  }

  // Final clamp
  if (s.length > maxLen) s = s.slice(0, maxLen - 1).trimEnd() + '…';

  return compactWhitespace(s);
}

const Badge = React.memo<{ children: React.ReactNode; variant?: 'warning' | 'success' | 'info'; tooltip?: string }>(({ 
  children, 
  variant = 'info',
  tooltip 
}) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 backdrop-blur-sm border shadow-lg";
  const variantClasses = {
    warning: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 border-amber-400/30",
    success: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-400/30",
    info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-200 border-blue-400/30"
  };

  const badge = (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );

  return tooltip ? <Tooltip content={tooltip}>{badge}</Tooltip> : badge;
});
Badge.displayName = 'Badge';

const Tooltip = React.memo<TooltipProps>(({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        className="cursor-help transition-all duration-200"
        role="button"
        aria-describedby={isVisible ? tooltipId : undefined}
      >
        {children}
      </div>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 px-4 py-3 text-sm font-medium text-white bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-200"
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900/95"></div>
        </div>
      )}
    </div>
  );
});
Tooltip.displayName = 'Tooltip';

// Card component for mobile view
const CardBox: React.FC<{ 
  title: string; 
  content: React.ReactNode; 
  variant: 'supa' | 'xpel3m' | 'china';
  isRTL: boolean;
}> = ({ title, content, variant, isRTL }) => {
  const variantClasses = {
    supa: 'bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 text-red-200',
    xpel3m: 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-200',
    china: 'bg-gradient-to-br from-gray-600/20 to-gray-800/20 border-gray-500/30 text-gray-300'
  };

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm ${variantClasses[variant]}`}>
      <h4 className={`font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{title}</h4>
      <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>{content}</div>
    </div>
  );
};

const PPFComparison: React.FC<PPFComparisonProps> = ({ 
  locale = 'en', 
  data = ppfComparisonData,
  className = ''
}) => {
  const { title, columns, rows } = data;
  const isRTL = locale === 'ar';
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);

  // Find SupaKoto column dynamically (fallback = 1)
  const supaColIndex = React.useMemo(() => {
    const idx = columns.findIndex((c: any) => {
      const key = (c?.key || '').toString().toLowerCase();
      const label = (c?.en || c?.ar || '').toString().toLowerCase();
      return key.includes('supa') || key.includes('takai') || label.includes('supa') || label.includes('takai');
    });
    return idx >= 0 ? idx : 1;
  }, [columns]);

  // Contact constants (localized)
  const contacts = {
    phone: locale === 'en' ? '+971501234567' : '+966123456789',
    whatsapp: locale === 'en' ? '971501234567' : '966123456789'
  };

  // Handle scroll hint fade
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    scroller.addEventListener('scroll', handleScroll, { once: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  // Auto-hide hint pill
  useEffect(() => {
    if (hasScrolled) { setHintVisible(false); return; }
    const t = setTimeout(() => setHintVisible(false), 3000);
    return () => clearTimeout(t);
  }, [hasScrolled]);

  // Enhanced content function - returns ReactNode directly
  const enhanceContent = (content: string): React.ReactNode => {
    const short = shortenCopy(String(content || ''), { locale, maxLen: 58 });

    if (short.includes('✓')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="success" tooltip={locale === 'en' ? 'Available feature' : 'ميزة متوفرة'}>
            <CheckIcon className="w-3 h-3" />
          </Badge>
          <span className="whitespace-normal break-words">{short.replace('✓','').trim()}</span>
        </div>
      );
    }
    if (short.match(/[✗❌]/)) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip={locale === 'en' ? 'Limited or unavailable' : 'محدودة أو غير متوفرة'}>
            <XIcon className="w-3 h-3" />
          </Badge>
          <span className="whitespace-normal break-words">{short.replace(/[✗❌]/g,'').trim()}</span>
        </div>
      );
    }
    if (short.includes('⚠️')) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="warning" tooltip={locale === 'en' ? 'Caution advised' : 'ننصح بالحذر'}>
            <WarningIcon className="w-3 h-3" />
          </Badge>
          <span className="whitespace-normal break-words">{short.replace('⚠️','').trim()}</span>
        </div>
      );
    }
    return <span className="whitespace-normal break-words">{short}</span>;
  };

  // Cell class helpers (emerald highlight + solid sticky bgs + spacing)
  const headCellClass = (index: number) => clsx(
    cellX, cellY, 'font-semibold border-b border-white/10',
    'sticky top-0 z-30',
    cardBgSolid,                                   // SOLID to prevent iOS banding
    index === 0 && clsx(
      'sticky sm:static z-40',                     // sticky first col ONLY on mobile
      isRTL ? 'right-0 sm:right-auto' : 'left-0 sm:left-auto'
    ),
    index === supaColIndex ? 'text-emerald-200' : 'text-gray-200',
    isRTL ? 'text-right' : 'text-left',
    index === 0 ? `${mobileFirstColW} sm:w-auto sm:min-w-0` : `${mobileDataColW} sm:w-auto sm:min-w-0`,
    "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-px after:bg-white/10"
  );

  const rowCellClass = (index: number, isFirstCol = false) => clsx(
    cellX, cellY, 'border-b border-white/5 transition-colors leading-snug md:leading-normal',
    'motion-safe:hover:bg-white/5',
    isFirstCol && clsx(
      'sticky sm:static z-20',
      cardBgSolid,                                 // SOLID sticky bg
      isRTL ? 'right-0 sm:right-auto' : 'left-0 sm:left-auto',
      'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
    ),
    index === supaColIndex && !isFirstCol && 'bg-gradient-to-b from-emerald-600/10 to-emerald-500/5 text-emerald-100 ring-1 ring-emerald-500/15',
    index !== supaColIndex && !isFirstCol && 'text-gray-300',
    isRTL ? 'text-right' : 'text-left',
    isFirstCol ? `${mobileFirstColW} sm:w-auto sm:min-w-0` : `${mobileDataColW} sm:w-auto sm:min-w-0`
  );

  const stickyFirstColClass = clsx(
    'sticky z-30 backdrop-blur-md bg-slate-900/95 shadow-lg',
    isRTL ? 'right-0' : 'left-0'
  );

  // Legend data
  const legendItems = [
    { 
      key: 'supa', 
      label: locale === 'en' ? 'Takai PPF (Premium)' : 'تاكاي PPF (مميز)',
      color: 'bg-red-600',
      textColor: 'text-red-200'
    },
    { 
      key: 'xpel3m', 
      label: locale === 'en' ? 'XPEL / 3M (Western)' : 'XPEL / 3M (غربي)',
      color: 'bg-slate-500',
      textColor: 'text-slate-200'
    },
    { 
      key: 'china', 
      label: locale === 'en' ? 'Chinese PPF (Budget)' : 'PPF صيني (اقتصادي)',
      color: 'bg-gray-600',
      textColor: 'text-gray-300'
    }
  ];

  return (
    <section 
      className={`w-full overflow-hidden py-20 md:py-28 lg:py-32 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header Block */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 border border-emerald-500/30 backdrop-blur-sm mb-4">
            <span className="text-xs font-semibold text-emerald-200 tracking-wider">
              {locale === 'en' ? 'COMPARISON' : 'مقارنة'}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white">
            {locale === 'en' ? 'Takai PPF vs Other Options' : 'تاكاي PPF مقابل الخيارات الأخرى'}
          </h1>
          <p className="text-gray-300 text-xs md:text-sm mb-6 md:mb-8">
            {locale === 'en' ? 'Swipe horizontally on mobile to compare.' : 'اسحب أفقيًا على الجوال للمقارنة.'}
          </p>
          <div className={clsx('flex flex-wrap gap-3 justify-center', isRTL && 'flex-row-reverse')}>
            {legendItems.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <div className={clsx(
                  'w-2.5 h-2.5 rounded-full',
                  item.key === 'supa' ? 'bg-emerald-500' : item.color
                )}/>
                <span className={clsx('text-xs md:text-sm font-medium',
                  item.key === 'supa' ? 'text-emerald-200' : item.textColor
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Table Wrapper */}
        <div className="relative">
          {/* Outer Card with Depth */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_18px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            {/* Inner Gradient Layer */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 relative">
              
              {/* Table Scroller with WebKit Mask Edge Fades */}
              <div
                ref={scrollerRef}
                className={clsx(
                  'relative overflow-x-auto transform-gpu will-change-transform',
                  'scrollbar-thin',
                  '[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800/40 [&::-webkit-scrollbar-thumb]:bg-slate-600/50 [&::-webkit-scrollbar-thumb]:rounded-full'
                )}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehaviorX: 'contain',
                  overscrollBehaviorY: 'auto',
                  WebkitMaskImage: isRTL
                    ? 'linear-gradient(to left, transparent, black 28px, black calc(100% - 28px), transparent)'
                    : 'linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)',
                  maskImage: isRTL
                    ? 'linear-gradient(to left, transparent, black 28px, black calc(100% - 28px), transparent)'
                    : 'linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)',
                }}
              >
                {/* Mobile "Swipe to compare" pill — TOP-end, non-blocking */}
                {hintVisible && (
                  <div
                    className={clsx(
                      'sm:hidden absolute z-20 pointer-events-none',
                      isRTL ? 'top-2 left-2' : 'top-2 right-2' // TOP-end position
                    )}
                    aria-hidden="true"
                  >
                    <div className="pointer-events-auto px-3 py-1.5 rounded-full text-[11px] font-medium
                                    text-white bg-black/60 backdrop-blur-md border border-white/15
                                    shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
                      {locale === 'en' ? 'Swipe to compare →' : 'اسحب للمقارنة ←'}
                    </div>
                  </div>
                )}


                {/* Premium Table */}
                <table className="w-full min-w-[800px] relative">
                  <colgroup>
                    <col className={`${mobileFirstColW} sm:w-auto sm:min-w-0`} />
                    <col className={`${mobileDataColW}  sm:w-auto sm:min-w-0`} />
                    <col className={`${mobileDataColW}  sm:w-auto sm:min-w-0`} />
                    <col className={`${mobileDataColW}  sm:w-auto sm:min-w-0`} />
                  </colgroup>
                  <caption className="sr-only">
                    {locale === 'en' 
                      ? 'Comparison table of Takai PPF vs other options'
                      : 'جدول مقارنة تاكاي PPF مع الخيارات الأخرى'
                    }
                  </caption>
                  
                  {/* Sticky Header */}
                  <thead>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={headCellClass(index)}
                        >
                          {column[locale]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr 
                        key={rowIndex} 
                        className="group/row transition-all duration-300 motion-safe:hover:bg-slate-800/20"
                      >
                        {/* Sticky First Column */}
                        <th 
                          scope="row"
                          className={rowCellClass(0, true)}
                        >
                          {row.feature[locale]}
                        </th>
                        
                        {/* Data Columns */}
                        <td className={rowCellClass(1)}>
                          <div className="relative z-10">
                            {enhanceContent(row.supa[locale])}
                          </div>
                        </td>
                        <td className={rowCellClass(2)}>
                          {enhanceContent(row.xpel3m[locale])}
                        </td>
                        <td className={rowCellClass(3)}>
                          {enhanceContent(row.china[locale])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>




      </div>
    </section>
  );
};

export default PPFComparison;
