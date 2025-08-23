import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import compress from 'astro-compress';
import icon from 'astro-icon';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        mdi: ["*"],
      }
    }),
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    compress({
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
        minifyJS: true,
        useShortDoctype: true
      }
    },
    Image: {
      webp: {
        quality: 80,
        effort: 6
      },
      avif: {
        quality: 75,
        effort: 9
      }
    },
    JavaScript: {
      terser: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 3,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          hoist_funs: true,
          hoist_props: true,
          hoist_vars: true,
          join_vars: true,
          loops: true,
          negate_iife: true,
          properties: true,
          reduce_funcs: true,
          reduce_vars: true,
          sequences: true,
          side_effects: true,
          switches: true,
          top_retain: false,
          typeofs: true,
          unused: true,
          conditionals: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          inline: true,
          collapse_vars: true,
          comparisons: true,
          booleans: true,
          arrows: true
        },
        mangle: {
          safari10: true,
          toplevel: true,
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false,
          beautify: false,
          semicolons: false
        }
      }
    },
    SVG: {
      svgo: {
        plugins: [
          'preset-default',
          'removeDimensions',
          'removeViewBox',
          'cleanupNumericValues'
        ]
      }
    }
  })
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
    format: 'file',
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
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
          preset: 'recommended',
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
        include: ['react', 'react-dom', 'leaflet', 'react-leaflet'],
        exclude: ['@astrojs/react'],
      },
      ssr: {
        noExternal: ['react-icons', 'lucide-react'],
      },
    }
  }
});