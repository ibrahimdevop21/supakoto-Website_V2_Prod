/**
 * Centralized Phone Number Routing
 * Single source of truth for all WhatsApp and call buttons
 * 
 * Logic: Egypt timezone → Egypt numbers, Rest of world → UAE numbers
 */

import { countryFromTimezone } from './tzToCountry';
import { COUNTRY_DEFAULTS } from '../data/countryContacts';
import type { CountryCode } from '../data/countryContacts';

/**
 * Get the appropriate phone numbers based on user's timezone
 * @returns Object with tel (for tel: links) and wa (for WhatsApp links)
 */
export function getPhoneNumbers(): { tel: string; wa: string; country: CountryCode } {
  const country = countryFromTimezone();
  const numbers = COUNTRY_DEFAULTS[country];
  
  return {
    tel: numbers.tel,
    wa: numbers.wa,
    country
  };
}

/**
 * Initialize phone routing for a button element
 * Updates href dynamically based on user's timezone
 * 
 * @param element - The anchor element to update
 * @param type - 'whatsapp' or 'call'
 */
export function initPhoneRouting(element: HTMLAnchorElement, type: 'whatsapp' | 'call'): CountryCode {
  const { tel, wa, country } = getPhoneNumbers();
  
  if (type === 'whatsapp') {
    element.href = `https://wa.me/${wa}`;
  } else if (type === 'call') {
    element.href = `tel:${tel}`;
  }
  
  return country;
}
