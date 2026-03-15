/**
 * SupaKoto Deterministic Phone Routing Middleware
 * Server-Authoritative Architecture - Single Source of Truth
 *
 * Priority Order:
 * 1. Query param override (?c=EG or ?c=AE)
 * 2. Existing cookie (sk_country)
 * 3. Vercel geo header (x-vercel-ip-country)
 * 4. Fallback to AE (UAE)
 *
 * The resolved country is written to context.locals.country BEFORE next()
 * so pages can read it directly — no race condition.
 *
 * Cookie: sk_country
 * Values: 'EG' | 'AE'
 * Expiry: 7 days
 * Flags: Secure, SameSite=Lax, HttpOnly
 */

import type { MiddlewareHandler } from 'astro';

type CountryCode = 'EG' | 'AE';

const COOKIE_NAME = 'sk_country';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const VALID_COUNTRIES: CountryCode[] = ['EG', 'AE'];

function getCountryFromCookie(cookieHeader: string | null): CountryCode | null {
  if (!cookieHeader) return null;
  for (const cookie of cookieHeader.split(';')) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      const country = value as CountryCode;
      return VALID_COUNTRIES.includes(country) ? country : null;
    }
  }
  return null;
}

/**
 * Vercel serverless functions expose geo data via request headers,
 * NOT via request.geo (which is Edge Runtime only).
 */
function detectCountryFromGeo(request: Request): CountryCode | null {
  const geoCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase();
  if (geoCountry === 'EG') return 'EG';
  if (geoCountry === 'AE') return 'AE';
  return null;
}

function createCookie(country: CountryCode): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? 'Secure; ' : '';
  return `${COOKIE_NAME}=${country}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; ${secure}HttpOnly`;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const queryCountry = url.searchParams.get('c')?.toUpperCase() as CountryCode | null;

  // 1. Query param override — redirect to clean URL and bake cookie
  if (queryCountry && VALID_COUNTRIES.includes(queryCountry)) {
    url.searchParams.delete('c');
    return new Response(null, {
      status: 302,
      headers: {
        'Location': url.toString(),
        'Set-Cookie': createCookie(queryCountry),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // 2. Existing cookie
  const cookieHeader = context.request.headers.get('cookie');
  const cookieCountry = getCountryFromCookie(cookieHeader);

  // 3. Vercel geo header (serverless-compatible)
  const geoCountry = detectCountryFromGeo(context.request);

  // 4. Fallback to AE
  const resolvedCountry: CountryCode = cookieCountry ?? geoCountry ?? 'AE';

  // Write to locals BEFORE next() so pages always have the correct value
  context.locals.country = resolvedCountry;

  const response = await next();

  // Set cookie if it wasn't already set (first visit or geo-detected)
  if (!cookieCountry) {
    response.headers.append('Set-Cookie', createCookie(resolvedCountry));
  }

  response.headers.set('Cache-Control', 'private, no-store, must-revalidate');
  return response;
};
