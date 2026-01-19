import type { CountryCode } from '../data/countryContacts';

/**
 * Detect user's country based on timezone
 * Simple logic: Egypt timezone → EG, everything else → UAE
 */
export function countryFromTimezone(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Check if Egypt timezone
    if (tz === 'Africa/Cairo' || tz === 'Egypt') {
      return 'EG';
    }
    
  } catch (error) {
    console.error('Timezone detection error:', error);
  }
  
  // Default: UAE for rest of world
  return 'AE';
}
