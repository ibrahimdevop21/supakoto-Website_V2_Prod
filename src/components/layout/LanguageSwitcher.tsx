import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Globe, ChevronDown } from "../icons/LightweightIcons";
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
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelectLanguage = (langCode: Locale) => {
    localStorage.setItem("preferred_locale", langCode);
    const newPath = switchLocalePath(currentPath, langCode);
    window.location.href = newPath;
  };

  const currentLanguage = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) || SUPPORTED_LANGUAGES[0];
  }, [currentLocale]);

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors rounded-lg"
            aria-label={`Change language, current language is ${currentLanguage.name}`}
          >
            <Globe className="h-5 w-5" />
            <span className="hidden sm:inline">{currentLanguage.name}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[120px] bg-gray-900/80 backdrop-blur-md border-gray-700 text-gray-200"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className="flex items-center gap-2 cursor-pointer hover:!bg-white/10 focus:!bg-white/20"
              aria-current={currentLocale === lang.code ? "page" : undefined}
            >
              <span
                className={`font-semibold ${
                  currentLocale === lang.code ? "text-primary" : ""
                }`}
              >
                {lang.name}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitcher;

