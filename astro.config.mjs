// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import compress from 'astro-compress';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const USE_COMPRESS = process.env.ASTRO_COMPRESS !== 'false';

export default defineConfig({
  site: 'https://supakoto.com',
  output: 'server',          // needed so /api/* runs on Vercel
  adapter: vercel(),
  trailingSlash: 'ignore',

  // Make ALL pages static by default (no SSR page cost).
  prerender: { default: true },

  integrations: [
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ar: 'ar' } } }),
    icon({ include: { mdi: ['*'] } }),
    tailwind({ applyBaseStyles: false }),
    react(),
    ...(USE_COMPRESS
      ? [compress({
          CSS: { csso: { restructure: true, forceMediaMerge: true, comments: false } },
          HTML: {
            'html-minifier-terser': {
              removeAttributeQuotes: true,
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              minifyCSS: true,
              minifyJS: false,
              useShortDoctype: true
            }
          },
          Image: false,
          JavaScript: false,
          SVG: false
        })]
      : [])
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: { prefixDefaultLocale: false, strategy: 'pathname' },
    fallback: { ar: 'en' }
  },

  build: {
    inlineStylesheets: 'auto',
    minify: true,
    format: 'directory' // keep Astro defaults → CSS/JS under /_astro/*
  },

  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  },

  // IMPORTANT: do NOT add custom vite.build.rollupOptions.output.
});
