import React, { useEffect, useMemo } from "react";
import { useSwitchLocalePath } from "../../i18n/react";
import { type Locale } from "../../i18n";

interface LanguageSwitcherProps {
  currentLocale: string;
  currentPath?: string;
  className?: string;
}

const SUPPORTED_LANGUAGES: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  currentPath = "",
  className = "",
}) => {
  const switchLocalePath = useSwitchLocalePath();

  // Redirect based on saved preference on initial client-side load
  useEffect(() => {
    const preferredLocale = localStorage.getItem("preferred_locale") as Locale | null;
    const hasBeenRedirected = sessionStorage.getItem("locale_redirected");

    if (preferredLocale && preferredLocale !== currentLocale && !hasBeenRedirected) {
      sessionStorage.setItem("locale_redirected", "true"); // Prevent redirect loops
      const newPath = switchLocalePath(currentPath, preferredLocale);
      window.location.href = newPath;
    }
  }, [currentLocale, currentPath, switchLocalePath]);

  const handleSelectLanguage = (langCode: Locale, href: string) => {
    try { localStorage.setItem("preferred_locale", langCode); } catch {}
    window.location.href = href;
  };

  const currentLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) || SUPPORTED_LANGUAGES[0];
  }, [currentLocale]);

  const switchingTo: Locale = (currentLocale === "ar" ? "en" : "ar") as Locale;
  const href = switchLocalePath(currentPath, switchingTo);
  const btnLabel = switchingTo === "en" ? "🇬🇧" : "🇦🇪";
  const aria = switchingTo === "en" ? "Switch to English" : "Switch to Arabic";

  return (
    <div className={className}>
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); handleSelectLanguage(switchingTo, href); }}
        aria-label={aria}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-white/20 bg-white/10 text-white font-bold uppercase text-xs tracking-wide hover:border-[#bf1e2e] hover:bg-[#bf1e2e]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bf1e2e] transition-all duration-200"
      >
        {btnLabel}
      </a>
    </div>
  );
};

export default LanguageSwitcher;

