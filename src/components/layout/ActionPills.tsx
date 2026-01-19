import React, { useState, useEffect } from 'react';
import { Phone, Globe } from 'lucide-react';
import { track } from '@vercel/analytics';
import { getPhoneNumbers } from "../../utils/phoneRouting";
import type { CountryCode } from "../../data/countryContacts";

// No-op function for TikTok tracking while disabled
function trackTikTok(_event: string, _props: Record<string, unknown> = {}) {
  // Intentionally a no-op while TikTok is disabled.
  // TODO: Re-enable later with guarded calls (if (window.ttq?.track) window.ttq.track(...))
}

function swapLocalePath(path: string, target: "en" | "ar") {
  const isAr = path === "/ar" || path.startsWith("/ar/");
  if (target === "ar") {
    if (isAr) return path;                // already ar
    return path === "/" ? "/ar" : `/ar${path}`;
  } else {
    if (!isAr) return path;               // already en
    return path === "/ar" ? "/" : path.replace(/^\/ar(?=\/)/, "");
  }
}

type Props = {
  locale?: "en" | "ar";
  currentPath?: string;          // NEW
  onToggleLang?: () => void;
};

// WhatsApp icon component with green color
const WhatsApp = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className="text-whatsapp" fill="currentColor" aria-hidden="true">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.49-.084-.182-.133-.38-.232" />
  </svg>
);

export default function ActionPills({ locale = "en", currentPath, onToggleLang }: Props) {
  const [phoneNumbers, setPhoneNumbers] = useState<{ tel: string; wa: string; country: CountryCode }>({ 
    tel: '+971506265404', 
    wa: '971506265404', 
    country: 'AE' 
  });
  
  useEffect(() => {
    // Get phone numbers from centralized routing
    setPhoneNumbers(getPhoneNumbers());
  }, []);

  const { tel, wa, country: cc } = phoneNumbers;
  
  // Build the next href using the current path
  const [path, setPath] = useState<string>("/");
  useEffect(() => {
    if (typeof window !== "undefined") setPath(window.location.pathname || "/");
  }, []);
  
  const nextHref = swapLocalePath(path, locale === "ar" ? "en" : "ar");
  // Show the target language (what it will switch TO), not current language
  const langTag = locale === "ar" ? "🇬🇧" : "🇦🇪";

  // Luxury glowing call button with amber/orange theme - matching WhatsApp size
  const luxuryCallButton = "relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-call to-[#d97706] border border-call/30 hover:from-[#fbbf24] hover:to-call text-white transition-all duration-200 shadow-lg shadow-call/25 hover:shadow-xl hover:shadow-call/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-call/50 focus:ring-offset-2 focus:ring-offset-transparent";
  
  // Premium utility button style - clearly interactive with subtle borders and hover states
  const utilityButton = "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none " +
    "data-[theme=light]:bg-white data-[theme=light]:border-[#E2DFD8] data-[theme=light]:text-[#0E1626] data-[theme=light]:hover:bg-[#F6F4F1] data-[theme=light]:hover:border-[#D6D4CF] " +
    "data-[theme=dark]:bg-slate-800/60 data-[theme=dark]:border-slate-700/60 data-[theme=dark]:text-slate-200 data-[theme=dark]:hover:bg-slate-700/60 data-[theme=dark]:hover:border-slate-600/60";

  // Theme toggle state - initialize to 'dark' to match SSR default
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  
  React.useEffect(() => {
    // Get initial theme after mount
    const stored = localStorage.getItem('supakoto-theme');
    const current = document.documentElement.getAttribute('data-theme');
    setTheme((current === 'light' || stored === 'light') ? 'light' : 'dark');
  }, []);
  
  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('supakoto-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2" suppressHydrationWarning>
      {/* Luxury Call Button */}
      <a 
        href={`tel:${tel}`} 
        aria-label="Call Now" 
        className={luxuryCallButton}
        onClick={() => {
          // Fire tracking as NO-OP for now (kept for future parity)
          trackTikTok('ClickButton', { button: 'Call', region: 'UAE' });
          
          // Track with Vercel Analytics
          try {
            track('call_navbar_click', {
              phone: tel,
              location: 'navbar',
              country: cc,
              lang: locale
            });
          } catch (error) {
            console.error('Tracking error:', error);
          }
        }}
      >
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 rounded-full border-2 border-call/40 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border border-call/20 animate-pulse"></div>
        
        {/* Phone icon */}
        <svg className="relative z-10 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.77.66 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.18a2 2 0 0 1 2.11-.45c.83.32 1.7.54 2.6.66A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>

      {/* Theme Toggle - Sun in dark mode, Moon in light mode */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className={utilityButton}
        data-theme={theme}
      >
        <div className="relative h-5 w-5">
          {/* Moon icon - shown in LIGHT mode (action: switch to dark) */}
          <svg 
            className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden={theme !== 'light'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {/* Sun icon - shown in DARK mode (action: switch to light) */}
          <svg 
            className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden={theme !== 'dark'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </button>

      {/* Language: text-based toggle shows target language */}
      {onToggleLang ? (
        <button
          onClick={onToggleLang}
          aria-label={locale === 'ar' ? 'Switch to English' : 'Switch to Arabic'}
          className={utilityButton}
          data-theme={theme}
        >
          <span className="text-base leading-none">{locale === 'ar' ? '🇬🇧' : '🇦🇪'}</span>
        </button>
      ) : (
        <a
          href={nextHref}
          aria-label={locale === 'ar' ? 'Switch to English' : 'Switch to Arabic'}
          className={utilityButton}
          data-theme={theme}
        >
          <span className="text-base leading-none">{locale === 'ar' ? '🇬🇧' : '🇦🇪'}</span>
        </a>
      )}
    </div>
  );
}
