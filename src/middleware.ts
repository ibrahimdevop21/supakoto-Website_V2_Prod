import type { APIContext, MiddlewareNext } from 'astro';

export const onRequest = async (ctx: APIContext, next: MiddlewareNext) => {
  // Detect country from Vercel Edge geo data
  // @ts-ignore - Vercel Edge Runtime provides geo data
  const geoCountry = ctx.request.geo?.country || null;
  
  // Resolve country: EG if Egypt, otherwise AE (UAE)
  const resolvedCountry = geoCountry === 'EG' ? 'EG' : 'AE';
  
  const res = await next();
  
  // Inject geo-detected country into cookie for client-side access
  // This is a signal only - client can override via localStorage
  res.headers.append(
    'Set-Cookie',
    `x-user-country=${resolvedCountry}; Path=/; Max-Age=86400; SameSite=Lax`
  );
  
  // Cache control for gallery images
  const url = new URL(ctx.request.url);
  if (url.pathname.startsWith('/gallery/')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return res;
};
