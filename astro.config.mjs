// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import compress from 'astro-compress';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless'; // ADD

const USE_COMPRESS = process.env.ASTRO_COMPRESS !== 'false';

export default defineConfig({
  site: 'https://supakoto.com',
  output: 'server',                 // CHANGE: was 'static'
  trailingSlash: 'ignore',
  adapter: vercel(),                // ADD

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ar: 'ar' }
      }
    }),
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
    format: 'directory'
  },

  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
        mangle: { safari10: true },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            const n = name ?? '';
            if (/\.css$/i.test(n)) return 'assets/css/[name]-[hash][extname]';
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(n))
              return 'assets/images/[name]-[hash][extname]';
            return 'assets/[ext]/[name]-[hash][extname]';
          },
        },
      },
    },
  },
});
