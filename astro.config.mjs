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
    icon({ include: { mdi: ['*'], 'simple-icons': ['*'] } }),
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
          JavaScript: true,
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
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
          }
        }
      },
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layout': '/src/components/layout',
        '@hero': '/src/components/hero',
        '@gallery': '/src/components/gallery',
        '@services': '/src/components/services',
        '@shared': '/src/components/shared',
        '@ui': '/src/components/ui',
        '@data': '/src/data',
        '@lib': '/src/lib'
      }
    }
  },

  // IMPORTANT: do NOT add custom vite.build.rollupOptions.output.
});
