# Phone Routing Architecture

## Overview

Tiered, deterministic phone number routing system for WhatsApp and call buttons.

## Priority Order (AUTHORITATIVE)

```
1️⃣ User Override (localStorage)     ← Highest priority, never auto-overridden
2️⃣ Edge Geo (Vercel request.geo)    ← Primary signal from IP geolocation
3️⃣ Browser Locale (navigator.language) ← Fallback for ar-EG locale
4️⃣ Timezone (Intl.DateTimeFormat)   ← Last resort
5️⃣ Default (UAE)                     ← Safe fallback
```

## Architecture

### Single Source of Truth

**All routing logic lives in:** `src/utils/phoneRouting.ts`

No component implements routing logic directly.

### Edge Middleware

**File:** `src/middleware.ts`

- Runs on Vercel Edge Runtime
- Reads `request.geo.country` from Vercel Edge
- Sets `x-user-country` cookie (24h TTL)
- Cookie is readable client-side
- No UI logic - signal only

### Routing Module API

```typescript
// Get resolved country with source tracking
getResolvedCountry(): {
  country: 'EG' | 'AE',
  source: 'override' | 'edge' | 'locale' | 'timezone' | 'default'
}

// Get phone numbers for current user
getPhoneNumbers(): {
  tel: string,
  wa: string,
  country: 'EG' | 'AE'
}

// Initialize button routing (auto-updates href)
initPhoneRouting(
  element: HTMLAnchorElement,
  type: 'whatsapp' | 'call'
): 'EG' | 'AE'

// User override management
setUserCountryOverride(country: 'EG' | 'AE'): void
clearUserCountryOverride(): void
```

## Routing Logic

### Egypt (EG) Routes

User gets Egypt numbers if ANY of these match (in priority order):

1. **User Override**: `localStorage['sk-user-country'] === 'EG'`
2. **Edge Geo**: `request.geo.country === 'EG'` (via cookie)
3. **Locale**: `navigator.language.startsWith('ar-EG')`
4. **Timezone**: `timezone === 'Africa/Cairo' || timezone === 'Egypt'`

**Egypt Numbers:**
- Call: `+201103402446`
- WhatsApp: `201103402446`

### UAE (AE) Routes

All other users get UAE numbers (default):

**UAE Numbers:**
- Call: `+971506265404`
- WhatsApp: `971506265404`

## Analytics

### Routing Resolution Event

Fires **once per session** before any CTA click:

```javascript
track('phone_routing_resolved', {
  country: 'EG' | 'AE',
  source: 'override' | 'edge' | 'locale' | 'timezone' | 'default'
})
```

This enables:
- Distribution analysis of routing sources
- Debugging routing issues
- Validation of Edge geo accuracy

## Component Integration

### No Breaking Changes

Existing components continue to work without modification:

```typescript
// WhatsAppFloat.astro
import { initPhoneRouting, getPhoneNumbers } from '../utils/phoneRouting';

const country = initPhoneRouting(btn, 'whatsapp');
const { wa } = getPhoneNumbers();
```

### Supported Components

- ✅ `WhatsAppFloat.astro` - Floating button
- ✅ `ModernHeroCarousel.astro` - Hero WhatsApp CTA
- ✅ `ActionPills.tsx` - Navbar call button

## User Override Flow

### Setting Override

```typescript
import { setUserCountryOverride } from '../utils/phoneRouting';

// User selects Egypt
setUserCountryOverride('EG');
// Persists in localStorage, takes precedence over all signals
```

### Clearing Override

```typescript
import { clearUserCountryOverride } from '../utils/phoneRouting';

clearUserCountryOverride();
// Falls back to edge/locale/timezone detection
```

### Persistence

- Stored in `localStorage['sk-user-country']`
- Survives page reloads
- Never auto-overridden by system
- User must explicitly clear

## Testing

### Test Priority Order

```javascript
// 1. Set user override
setUserCountryOverride('EG');
getResolvedCountry(); // → { country: 'EG', source: 'override' }

// 2. Clear override, test edge geo
clearUserCountryOverride();
// If in Egypt: { country: 'EG', source: 'edge' }
// If elsewhere: { country: 'AE', source: 'edge' }

// 3. Test locale (requires ar-EG browser locale)
// { country: 'EG', source: 'locale' }

// 4. Test timezone (requires Africa/Cairo timezone)
// { country: 'EG', source: 'timezone' }

// 5. Default fallback
// { country: 'AE', source: 'default' }
```

## Future Extensions

### Adding New Countries

1. Add country code to `src/data/countryContacts.ts`:
   ```typescript
   export type CountryCode = 'EG' | 'AE' | 'SA'; // Add SA
   
   export const COUNTRY_DEFAULTS = {
     SA: { tel: '+966...', wa: '966...' }
   };
   ```

2. Update routing logic in `src/utils/phoneRouting.ts`:
   ```typescript
   function getEdgeGeo(): CountryCode | null {
     if (value === 'EG' || value === 'AE' || value === 'SA') return value;
   }
   ```

3. Update middleware if needed:
   ```typescript
   const resolvedCountry = 
     geoCountry === 'EG' ? 'EG' :
     geoCountry === 'SA' ? 'SA' : 'AE';
   ```

### Adding Locale Detection

```typescript
function resolveFromLocale(): CountryCode | null {
  const lang = navigator.language;
  if (lang.startsWith('ar-EG')) return 'EG';
  if (lang.startsWith('ar-SA')) return 'SA'; // New
  return null;
}
```

## Debugging

### Check Current Routing

```javascript
import { getResolvedCountry } from '../utils/phoneRouting';

const { country, source } = getResolvedCountry();
console.log(`Routing to ${country} via ${source}`);
```

### Check Cookie

```javascript
document.cookie.split(';').find(c => c.includes('x-user-country'));
```

### Check Override

```javascript
localStorage.getItem('sk-user-country');
```

## Security

- ✅ No PII stored
- ✅ Cookie is read-only signal (can't be manipulated to bypass routing)
- ✅ User override is explicit opt-in
- ✅ All routing logic server-validated via Edge middleware

## Performance

- ✅ Zero network requests for routing
- ✅ Cookie set once per day (24h TTL)
- ✅ localStorage read is synchronous
- ✅ Analytics fires once per session
- ✅ No blocking operations

## Maintenance

### Single Point of Change

To modify routing logic, edit **only**:
- `src/utils/phoneRouting.ts` - Client-side routing
- `src/middleware.ts` - Edge geo detection

All components update automatically.

### Audit Trail

Every routing decision is tracked via analytics:
```
phone_routing_resolved → { country, source }
```

Query Vercel Analytics to see distribution and debug issues.
