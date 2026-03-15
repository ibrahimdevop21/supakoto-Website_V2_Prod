/**
 * Server-Side Phone Routing Utilities
 * Deterministic, server-authoritative phone number resolution
 *
 * The middleware resolves the country and writes it to context.locals.country
 * before the page renders. Pages read from locals — no race condition.
 */

import type { AstroGlobal } from 'astro';
import { COUNTRY_DEFAULTS } from '../data/countryContacts';
import type { CountryCode } from '../data/countryContacts';

/**
 * Get the resolved country for this request.
 * Reads from Astro.locals (set by middleware before page renders).
 * Falls back to 'AE' only if middleware somehow didn't run.
 */
export function getCountryFromCookie(astro: AstroGlobal): CountryCode {
  return (astro.locals as App.Locals).country ?? 'AE';
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
