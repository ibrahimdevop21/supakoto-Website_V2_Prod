// Astro i18n native utilities wrapper
import { getLocaleByPath, getPathByLocale } from 'astro:i18n';
import type { AstroGlobal } from 'astro';

// Import the translations
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

// Type definitions
export type Locale = 'en' | 'ar';
type TranslationDictionary = typeof enTranslations;

// Translations objects
const translations = {
  en: enTranslations,
  ar: arTranslations,
} as const;

// Get current locale using Astro's native function
export function getCurrentLocale(Astro: AstroGlobal): Locale {
  return (Astro.currentLocale || 'en') as Locale;
}

// Check if current locale is RTL
export function isRTL(Astro: AstroGlobal): boolean {
  return getCurrentLocale(Astro) === 'ar';
}

// Type-safe nested property access
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return typeof value === 'string' ? value : undefined;
}

// Template string replacement (for parameters)
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

// Translation function using Astro's i18n with fallback
export function t(key: string, params?: Record<string, string | number>, Astro?: any): string {
  // If Astro context is available, use its locale
  let locale = 'en';
  
  if (Astro && Astro.currentLocale) {
    locale = Astro.currentLocale as Locale;
  }
  
  const dictionary = translations[locale as Locale];
  
  // Try to get translation from the current locale
  const translation = getNestedValue(dictionary, key);
  
  // If not found and not English, fall back to English
  const fallbackTranslation = locale !== 'en' && !translation
    ? getNestedValue(translations.en, key)
    : undefined;
  
  // Use the translation, fallback, or key itself
  const result = translation || fallbackTranslation || key;
  
  // Handle parameter interpolation
  return interpolate(result, params);
}

// React hook compatible translation function
export function createTranslator(locale: Locale) {
  return (key: string, params?: Record<string, string | number>) => {
    const dictionary = translations[locale];
    const translation = getNestedValue(dictionary, key);
    const fallbackTranslation = locale !== 'en' && !translation
      ? getNestedValue(translations.en, key)
      : undefined;
    
    const result = translation || fallbackTranslation || key;
    return interpolate(result, params);
  };
}

// Get URL for a different locale using Astro's native function
export function getLocalizedUrl(path: string, targetLocale: Locale, Astro: AstroGlobal): string {
  // Remove leading slash for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For English (default locale), use root paths without prefix
  if (targetLocale === 'en') {
    return cleanPath === '' ? '/' : `/${cleanPath}`;
  }
  
  // For Arabic, add /ar prefix
  if (targetLocale === 'ar') {
    return cleanPath === '' ? '/ar/' : `/ar/${cleanPath}`;
  }
  
  // Fallback to root
  return '/';
}

// Switch URL to another locale
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
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
}
