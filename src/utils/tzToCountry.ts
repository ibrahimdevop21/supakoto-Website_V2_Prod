import type { CountryCode } from '../data/countryContacts';

const TZ_TO_COUNTRY: Record<string, CountryCode> = {
  'Africa/Cairo': 'EG',
};

export function countryFromTimezone(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Check if timezone is in Africa (Egypt and other African countries)
    if (tz && tz.startsWith('Africa/')) {
      return 'EG';
    }
    // Specific timezone mapping
    if (tz && TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
  } catch {}
  return 'AE'; // fallback: Dubai/UAE for rest of world
}
