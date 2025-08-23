import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Optimized Vite Configuration for SupaKoto
 * Targets 90+ Lighthouse Performance Score
 * - Aggressive code splitting
 * - Bundle size optimization
 * - Tree shaking
 * - Asset optimization
 */

export default defineConfig({
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Aggressive minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs and debugger statements
        drop_console: true,
        drop_debugger: true,
        
        // Advanced compression options
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        
        // Code optimization
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
        top_retain: undefined,
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
    },
    
    // Rollup options for optimal chunking
    rollupOptions: {
      output: {
        // Manual chunking strategy for optimal loading
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            
            // Removed framer-motion - using lightweight animations instead
            
            // Map libraries
            if (id.includes('leaflet') || id.includes('react-leaflet')) {
              return 'vendor-maps';
            }
            
            // Carousel library
            if (id.includes('embla-carousel')) {
              return 'vendor-carousel';
            }
            
            // Removed lucide-react - using lightweight icons instead
            
            // Other vendor libraries
            return 'vendor-misc';
          }
          
          // Component chunks
          if (id.includes('/components/')) {
            // Heavy components in separate chunks
            if (id.includes('CarGallery') || id.includes('Testimonials')) {
              return 'components-heavy';
            }
            
            // Contact page components
            if (id.includes('contact/')) {
              return 'components-contact';
            }
            
            // About page components
            if (id.includes('about/')) {
              return 'components-about';
            }
            
            // Shared components
            return 'components-shared';
          }
          
          // Utils and helpers
          if (id.includes('/utils/') || id.includes('/lib/')) {
            return 'utils';
          }
        },
        
        // Optimized file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return 'assets/[name]-[hash][extname]';
          }
          
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          
          if (/\.css$/i.test(assetInfo.name)) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          
          return `assets/[name]-[hash].${ext}`;
        }
      },
      
      // External dependencies (if using CDN)
      external: []
    },
    
    // CSS optimization
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    
    // Build optimizations
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500, // Warn for chunks > 500KB
    assetsInlineLimit: 4096, // Inline assets < 4KB
    
    // Output directory
    outDir: 'dist',
    emptyOutDir: true
  },
  
  // ESBuild optimizations
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime'
    ],
    exclude: [
      '@astro/check',
      'framer-motion', // Excluded - using lightweight animations
      'lucide-react'   // Excluded - using lightweight icons
    ]
  },
  
  // Server configuration for development
  server: {
    hmr: {
      overlay: false
    }
  },
  
  // Preview configuration
  preview: {
    port: 4321,
    strictPort: true
  },
  
  // Asset processing
  assetsInclude: ['**/*.webp', '**/*.avif'],
  
  // Plugin configuration
  plugins: [],
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets')
    }
  },
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
});
