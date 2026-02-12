/**
 * Server-Side Phone Routing Utilities
 * Deterministic, server-authoritative phone number resolution
 * 
 * NO client-side detection
 * NO timezone/locale fallbacks
 * NO dynamic rewriting
 */

import type { AstroGlobal } from 'astro';
import { COUNTRY_DEFAULTS } from '../data/countryContacts';
import type { CountryCode } from '../data/countryContacts';

const COOKIE_NAME = 'sk_country';
const VALID_COUNTRIES: CountryCode[] = ['EG', 'AE'];

/**
 * Get country from cookie (server-side only)
 * This is the ONLY source of truth for routing
 */
export function getCountryFromCookie(astro: AstroGlobal): CountryCode {
  const cookieHeader = astro.request.headers.get('cookie');
  
  if (!cookieHeader) return 'AE'; // Fallback
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      const country = value as CountryCode;
      // Centralized validation - matches middleware logic
      if (VALID_COUNTRIES.includes(country)) {
        return country;
      }
    }
  }
  
  return 'AE'; // Fallback
}

/**
 * Get phone numbers for the detected country
 * Server-side only - no client-side detection
 */
export function getPhoneNumbers(country: CountryCode): { tel: string; wa: string; country: CountryCode } {
  const numbers = COUNTRY_DEFAULTS[country];
  
  return {
    tel: numbers.tel,
    wa: numbers.wa,
    country
  };
}

/**
 * Format WhatsApp link
 */
export function getWhatsAppLink(wa: string): string {
  return `https://wa.me/${wa}`;
}

/**
 * Format tel link
 */
export function getTelLink(tel: string): string {
  return `tel:${tel}`;
}
