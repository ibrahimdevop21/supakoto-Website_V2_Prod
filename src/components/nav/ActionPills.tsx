import React, { useState, useEffect } from 'react';
import { Phone, Globe } from 'lucide-react';
import { COUNTRY_DEFAULTS, type CountryCode } from "../../data/countryContacts";
import { countryFromTimezone } from "../../utils/tzToCountry";

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
  <svg width={size} height={size} viewBox="0 0 16 16" className="text-[#25D366]" fill="currentColor" aria-hidden="true">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.49-.084-.182-.133-.38-.232" />
  </svg>
);

export default function ActionPills({ locale = "en", currentPath, onToggleLang }: Props) {
  const [cc, setCc] = useState<CountryCode>("AE");
  useEffect(() => setCc(countryFromTimezone()), []);

  const { tel, wa } = COUNTRY_DEFAULTS[cc];
  
  // Build the next href using the current path
  const [path, setPath] = useState<string>("/");
  useEffect(() => {
    if (typeof window !== "undefined") setPath(window.location.pathname || "/");
  }, []);
  
  const nextHref = swapLocalePath(path, locale === "ar" ? "en" : "ar");
  // Show the target language (what it will switch TO), not current language
  const langTag = locale === "ar" ? "EN" : "ع";

  // Glass icon style - clean circular icons
  const glassIcon = "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white transition";

  return (
    <div className="flex items-center gap-2">
      {/* Call */}
      <a 
        href={`tel:${tel}`} 
        aria-label="Call" 
        className={glassIcon}
        onClick={() => {
          // TikTok Pixel tracking - ClickButton event
          if (typeof (window as any).ttq !== 'undefined') {
            (window as any).ttq('track', 'ClickButton', { button: 'Call', region: 'UAE' });
          }
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.77.66 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.18a2 2 0 0 1 2.11-.45c.83.32 1.7.54 2.6.66A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>

      {/* WhatsApp */}
      <a 
        href={`https://wa.me/${wa}`} 
        target="_blank" 
        rel="noopener" 
        aria-label="WhatsApp" 
        className={glassIcon}
        onClick={() => {
          // TikTok Pixel tracking - ClickButton event
          if (typeof (window as any).ttq !== 'undefined') {
            (window as any).ttq('track', 'ClickButton', { button: 'WhatsApp', region: 'UAE' });
          }
        }}
      >
        <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.49-.084-.182-.133-.38-.232" />
        </svg>
      </a>

      {/* Language */}
      {onToggleLang ? (
        <button onClick={onToggleLang} aria-label="Switch language" className={glassIcon}>
          <Globe className="h-5 w-5" />
        </button>
      ) : (
        <a href={nextHref} aria-label="Switch language" className={glassIcon}>
          <Globe className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
