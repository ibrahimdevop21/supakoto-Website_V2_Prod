import type { APIContext, MiddlewareNext } from 'astro';

export const onRequest = async (ctx: APIContext, next: MiddlewareNext) => {
  const res = await next();
  const url = new URL(ctx.request.url);
  if (url.pathname.startsWith('/gallery/')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  return res;
};
