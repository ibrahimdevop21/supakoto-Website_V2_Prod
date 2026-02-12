/**
 * SupaKoto Deterministic Phone Routing Middleware
 * Server-Authoritative Architecture - Single Source of Truth
 * 
 * Priority Order:
 * 1. Query param override (?c=EG or ?c=AE)
 * 2. Existing cookie (sk_country)
 * 3. Vercel Edge geo detection (request.geo.country)
 * 4. Fallback to AE (UAE)
 * 
 * Cookie: sk_country
 * Values: 'EG' | 'AE'
 * Expiry: 7 days
 * Flags: Secure, SameSite=Lax
 */

import type { MiddlewareHandler } from 'astro';

type CountryCode = 'EG' | 'AE';

const COOKIE_NAME = 'sk_country';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const VALID_COUNTRIES: CountryCode[] = ['EG', 'AE'];

/**
 * Parse country from cookie string
 */
function getCountryFromCookie(cookieHeader: string | null): CountryCode | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      const country = value as CountryCode;
      return VALID_COUNTRIES.includes(country) ? country : null;
    }
  }
  return null;
}

/**
 * Detect country from Vercel Edge geo data
 */
function detectCountryFromGeo(request: Request): CountryCode | null {
  try {
    // @ts-ignore - Vercel Edge Runtime injects geo data
    const geoCountry = request.geo?.country?.toUpperCase?.();
    
    if (geoCountry === 'EG') return 'EG';
    if (geoCountry === 'AE') return 'AE';
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Create secure cookie string
 */
function createCookie(country: CountryCode): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure = isProduction ? 'Secure; ' : '';
  
  return `${COOKIE_NAME}=${country}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; ${secure}HttpOnly`;
}

/**
 * Route matcher - exclude static assets from middleware
 */
export const config = {
  matcher: [
    '/',
    '/ar',
    '/ar/',
    '/(en|ar)/:path*',
    // Exclude static assets
    '/((?!_astro|assets|images|favicon|robots|sitemap).*)'
  ]
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  const queryCountry = url.searchParams.get('c')?.toUpperCase() as CountryCode | null;
  
  // 1. Query param override - highest priority
  if (queryCountry && VALID_COUNTRIES.includes(queryCountry)) {
    // Remove query param and redirect to clean URL
    url.searchParams.delete('c');
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': url.toString(),
        'Set-Cookie': createCookie(queryCountry),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
  
  // 2. Check existing cookie
  const cookieHeader = context.request.headers.get('cookie');
  const existingCountry = getCountryFromCookie(cookieHeader);
  
  if (existingCountry) {
    // Cookie exists, proceed without modification
    const response = await next();
    // Prevent caching of country-specific HTML
    response.headers.set('Cache-Control', 'private, no-store, must-revalidate');
    return response;
  }
  
  // 3. Detect from Vercel Edge geo
  const geoCountry = detectCountryFromGeo(context.request);
  
  // 4. Fallback to AE
  const resolvedCountry: CountryCode = geoCountry || 'AE';
  
  // Set cookie and proceed
  const response = await next();
  response.headers.append('Set-Cookie', createCookie(resolvedCountry));
  // Prevent caching of country-specific HTML
  response.headers.set('Cache-Control', 'private, no-store, must-revalidate');
  
  return response;
};
