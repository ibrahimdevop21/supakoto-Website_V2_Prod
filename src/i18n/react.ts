// React hooks for Astro's native i18n
import { createTranslator, type Locale } from './index';

// Translation hook for React components
export function useTranslations(locale: Locale = 'en') {
  return createTranslator(locale);
}

// RTL detection hook for React components
export function useIsRTL(locale: Locale = 'en') {
  return locale === 'ar';
}

// URL generation hook for React components
export function useLocalizedUrl(locale: Locale = 'en') {
  return (path: string) => {
    // Remove leading slash for consistency
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // For English (default locale), use root paths without prefix
    if (locale === 'en') {
      return cleanPath === '' ? '/' : `/${cleanPath}`;
    }
    
    // For Arabic, add /ar prefix
    if (locale === 'ar') {
      return cleanPath === '' ? '/ar/' : `/ar/${cleanPath}`;
    }
    
    // Fallback to root
    return '/';
  };
}

// Switch path hook for React components (used in language switcher)
export function useSwitchLocalePath() {
  return (currentPath: string, targetLocale: Locale) => {
    // Extract the path without locale prefix (remove /ar/ if present)
    let pathWithoutLocale = currentPath.replace(/^\/ar(\/|$)/, '/');
    
    // Clean up the path
    pathWithoutLocale = pathWithoutLocale === '/' ? '' : pathWithoutLocale.replace(/^\//, '');
    
    // For English (default locale), use root paths without prefix
    if (targetLocale === 'en') {
      return pathWithoutLocale === '' ? '/' : `/${pathWithoutLocale}`;
    }
    
    // For Arabic, add /ar prefix
    if (targetLocale === 'ar') {
      return pathWithoutLocale === '' ? '/ar/' : `/ar/${pathWithoutLocale}`;
    }
    
    // Fallback to root
    return '/';
  };
}
