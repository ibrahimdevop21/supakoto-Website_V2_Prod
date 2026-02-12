/**
 * Centralized Phone Number Routing - Tiered Priority System
 * Single source of truth for all WhatsApp and call buttons
 * 
 * Priority Order:
 * 1. User Override (localStorage) - highest priority
 * 2. Edge Geo (Vercel request.geo.country via cookie)
 * 3. Browser Locale (navigator.language)
 * 4. Timezone (Intl.DateTimeFormat)
 * 5. Default (UAE)
 */

import { track } from '@vercel/analytics';
import { COUNTRY_DEFAULTS } from '../data/countryContacts';
import type { CountryCode } from '../data/countryContacts';

export type RoutingSource = 'override' | 'edge' | 'locale' | 'timezone' | 'default';

const STORAGE_KEY = 'sk-user-country';
const GEO_COOKIE_NAME = 'x-user-country';

// Track if we've already fired the routing event this session
let routingEventFired = false;

/**
 * Get user's country override from localStorage
 */
function getUserOverride(): CountryCode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'EG' || stored === 'AE') return stored;
  } catch {}
  return null;
}

/**
 * Get country from Edge geo cookie (set by middleware)
 */
function getEdgeGeo(): CountryCode | null {
  if (typeof document === 'undefined') return null;
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === GEO_COOKIE_NAME) {
        if (value === 'EG' || value === 'AE') return value;
      }
    }
  } catch {}
  return null;
}

/**
 * Resolve country from browser locale
 */
function resolveFromLocale(): CountryCode | null {
  if (typeof navigator === 'undefined') return null;
  try {
    const lang = navigator.language || (navigator as any).userLanguage;
    // Only Egypt locale (ar-EG) routes to Egypt
    if (lang && lang.toLowerCase().startsWith('ar-eg')) {
      return 'EG';
    }
  } catch {}
  return null;
}

/**
 * Resolve country from timezone (last resort)
 */
function resolveFromTimezone(): CountryCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('[Phone Routing] Detected timezone:', tz);
    if (tz === 'Africa/Cairo' || tz === 'Egypt') {
      console.log('[Phone Routing] Timezone matches Egypt!');
      return 'EG';
    }
  } catch (error) {
    console.error('[Phone Routing] Timezone detection error:', error);
  }
  return null;
}

/**
 * Get resolved country with source tracking
 * Follows tiered priority: override > timezone > edge > locale > default
 * 
 * NOTE: Timezone is checked before Edge geo because:
 * - Edge geo doesn't work in local development
 * - Timezone is more reliable for Egypt detection
 * - In production, both should agree (Egypt users have Africa/Cairo timezone)
 */
export function getResolvedCountry(): { country: CountryCode; source: RoutingSource } {
  // Debug logging
  console.log('[Phone Routing] Starting country detection...');
  
  // 1. User override (highest priority)
  const override = getUserOverride();
  console.log('[Phone Routing] User override:', override);
  if (override) {
    console.log('[Phone Routing] ✅ Using override:', override);
    return { country: override, source: 'override' };
  }

  // 2. Timezone (primary signal - works in dev and production)
  const timezone = resolveFromTimezone();
  console.log('[Phone Routing] Timezone detection:', timezone);
  if (timezone) {
    console.log('[Phone Routing] ✅ Using timezone:', timezone);
    return { country: timezone, source: 'timezone' };
  }

  // 3. Edge geo (fallback - only works in production)
  const edgeGeo = getEdgeGeo();
  console.log('[Phone Routing] Edge geo:', edgeGeo);
  if (edgeGeo) {
    console.log('[Phone Routing] ✅ Using edge geo:', edgeGeo);
    return { country: edgeGeo, source: 'edge' };
  }

  // 4. Browser locale (fallback)
  const locale = resolveFromLocale();
  console.log('[Phone Routing] Browser locale:', locale);
  if (locale) {
    console.log('[Phone Routing] ✅ Using locale:', locale);
    return { country: locale, source: 'locale' };
  }

  // 5. Default (UAE)
  console.log('[Phone Routing] ⚠️ Using default: AE');
  return { country: 'AE', source: 'default' };
}

/**
 * Fire routing analytics event (once per session)
 */
function fireRoutingAnalytics(country: CountryCode, source: RoutingSource): void {
  if (routingEventFired) return;
  
  try {
    track('phone_routing_resolved', {
      country,
      source
    });
    routingEventFired = true;
  } catch (error) {
    console.error('Routing analytics error:', error);
  }
}

/**
 * Get the appropriate phone numbers based on tiered routing
 * @returns Object with tel, wa, and country
 */
export function getPhoneNumbers(): { tel: string; wa: string; country: CountryCode } {
  const { country, source } = getResolvedCountry();
  const numbers = COUNTRY_DEFAULTS[country];
  
  // Fire analytics event on first call
  fireRoutingAnalytics(country, source);
  
  return {
    tel: numbers.tel,
    wa: numbers.wa,
    country
  };
}

/**
 * Initialize phone routing for a button element
 * Updates href dynamically based on tiered routing
 * 
 * @param element - The anchor element to update
 * @param type - 'whatsapp' or 'call'
 * @returns The resolved country code
 */
export function initPhoneRouting(element: HTMLAnchorElement, type: 'whatsapp' | 'call'): CountryCode {
  console.log('[Phone Routing] initPhoneRouting called for:', type);
  const { tel, wa, country } = getPhoneNumbers();
  
  console.log('[Phone Routing] Got numbers - tel:', tel, 'wa:', wa, 'country:', country);
  
  if (type === 'whatsapp') {
    const newHref = `https://wa.me/${wa}`;
    console.log('[Phone Routing] Setting WhatsApp href from', element.href, 'to', newHref);
    element.href = newHref;
  } else if (type === 'call') {
    const newHref = `tel:${tel}`;
    console.log('[Phone Routing] Setting call href from', element.href, 'to', newHref);
    element.href = newHref;
  }
  
  console.log('[Phone Routing] Final href:', element.href);
  return country;
}

/**
 * Set user country override (persists in localStorage)
 * This will take precedence over all other routing signals
 * 
 * @param country - The country code to set
 */
export function setUserCountryOverride(country: CountryCode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, country);
    // Reset analytics flag so new routing is tracked
    routingEventFired = false;
  } catch (error) {
    console.error('Failed to set country override:', error);
  }
}

/**
 * Clear user country override
 * Routing will fall back to edge/locale/timezone detection
 */
export function clearUserCountryOverride(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Reset analytics flag so new routing is tracked
    routingEventFired = false;
  } catch (error) {
    console.error('Failed to clear country override:', error);
  }
}
