import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import compress from 'astro-compress';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { visualizer } from 'rollup-plugin-visualizer';

// Guard compression for CI builds
const USE_COMPRESS = process.env.ASTRO_COMPRESS !== 'false';

// https://astro.build/config
export default defineConfig({
  site: 'https://supakoto.com', // TODO: update to final domain
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({ 
      i18n: { 
        defaultLocale: 'en', 
        locales: {
          en: 'en',
          ar: 'ar'
        }
      } 
    }),
    icon({
      include: {
        mdi: ["*"],
      }
    }),
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    ...(USE_COMPRESS ? [compress({
      CSS: {
        csso: {
          restructure: true,
          forceMediaMerge: true,
          comments: false
        }
      },
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
    })] : [])
  ],
  // Built-in i18n configuration
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false,     // serve default locale from the root (e.g., / instead of /en/)
      strategy: 'pathname'            // use pathname strategy for locale detection
    },
    fallback: {
      ar: 'en'                       // fallback to English for missing Arabic translations
    }
  },
  // Performance optimizations
  build: {
    inlineStylesheets: 'auto',  // Inline small CSS files
    minify: true,
    format: 'directory',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor libraries - separate large dependencies
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('leaflet')) {
              return 'vendor-leaflet';
            }
            if (id.includes('embla-carousel')) {
              return 'vendor-carousel';
            }
            if (id.includes('motion') || id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            
            // Utility libraries
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }
            
            // Icon libraries
            if (id.includes('lucide') || id.includes('@iconify') || id.includes('astro-icon')) {
              return 'vendor-icons';
            }
            
            // Component chunks - prevent Layout from becoming massive
            if (id.includes('/components/') && !id.includes('node_modules')) {
              // Group components by type
              if (id.includes('/navbar/') || id.includes('NavBar')) {
                return 'components-nav';
              }
              if (id.includes('/contact/') || id.includes('Contact') || id.includes('Form')) {
                return 'components-contact';
              }
              if (id.includes('Carousel') || id.includes('Gallery')) {
                return 'components-gallery';
              }
              if (id.includes('/about/') || id.includes('Timeline') || id.includes('Philosophy')) {
                return 'components-about';
              }
              // Other components
              return 'components-shared';
            }
            
            // Layout and core files should be small
            if (id.includes('/layouts/') || id.includes('Layout')) {
              return 'layout-core';
            }
            
            // i18n and utilities
            if (id.includes('/i18n/') || id.includes('translations')) {
              return 'i18n';
            }
            
            // Default chunk for everything else
            if (id.includes('node_modules')) {
              return 'vendor-misc';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[ext]/[name]-[hash][extname]`;
          },
        },
        treeshake: {
          moduleSideEffects: ['leaflet', 'react', 'react-dom', 'react-leaflet'],
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
        plugins: [
          // Bundle analyzer - only in production builds
          process.env.ANALYZE === 'true' && visualizer({
            filename: 'dist/bundle-analysis.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap', // 'treemap', 'sunburst', 'network'
          }),
        ].filter(Boolean),
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-runtime', 'leaflet', 'react-leaflet'],
        exclude: ['@astrojs/react'],
      },
      ssr: {
        noExternal: ['react-icons', 'lucide-react', 'react/jsx-runtime'],
        external: ['leaflet', 'react-leaflet'],
      },
      sourcemap: false,
    },
  }
});