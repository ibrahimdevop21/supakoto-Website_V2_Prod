// middleware.ts - Astro/Vercel Edge Runtime compatible
import type { MiddlewareHandler } from 'astro';

const MAP: Record<string, 'AE' | 'EG'> = { AE: 'AE', EG: 'EG' };

export const onRequest: MiddlewareHandler = async (context, next) => {
  // @ts-ignore vercel injects geo in edge runtime
  const country = context.request.geo?.country?.toUpperCase?.() || '';
  const skCountry = MAP[country] || 'AE';

  const response = await next();
  
  // Set country cookie for client-side access
  response.headers.set('Set-Cookie', `sk_country=${skCountry}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax;`);
  
  return response;
};
