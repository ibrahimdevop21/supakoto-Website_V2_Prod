// Production-optimized Vite configuration for SupaKoto
// This extends the main astro.config.mjs with production optimizations

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-leaflet';
            }
            if (id.includes('embla-carousel')) {
              return 'vendor-embla';
            }
            if (id.includes('@tabler/icons')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: ['@astro/check']
  }
});
