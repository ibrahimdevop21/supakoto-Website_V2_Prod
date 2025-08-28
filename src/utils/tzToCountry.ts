import type { CountryCode } from '../data/countryContacts';

const TZ_TO_COUNTRY: Record<string, CountryCode> = {
  'Africa/Cairo': 'EG',
  'Asia/Dubai':  'AE',
  'Asia/Muscat': 'AE', // GCC travelers sometimes use this
};

export function countryFromTimezone(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_TO_COUNTRY[tz]) return TZ_TO_COUNTRY[tz];
  } catch {}
  return 'AE'; // fallback: UAE
}
