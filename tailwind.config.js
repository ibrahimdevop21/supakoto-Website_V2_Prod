/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		'./public/**/*.html',
		// Include any dynamic class patterns
		'./src/components/**/*.{astro,tsx,jsx}',
		'./src/pages/**/*.{astro,md,mdx}',
		'./src/layouts/**/*.{astro,tsx,jsx}'
	],
	// Safelist for dynamic classes that might be missed by purging
	safelist: [
		// Animation classes
		'animate-pulse',
		'animate-spin',
		'animate-bounce',
		// SupaKoto brand color classes
		{ pattern: /bg-supakoto-(red|dark-gray|blue|yellow-gold|dark-slate|deep-burgundy)/ },
		{ pattern: /text-supakoto-(red|dark-gray|blue|yellow-gold|dark-slate|deep-burgundy)/ },
		{ pattern: /border-supakoto-(red|dark-gray|blue|yellow-gold|dark-slate|deep-burgundy)/ },
		// Primary color variations
		{ pattern: /bg-primary-(50|100|200|300|400|500|600|700|800|900)/ },
		{ pattern: /text-primary-(50|100|200|300|400|500|600|700|800|900)/ },
		// Font family classes
		'font-brand',
		'font-arabic',
		// Grid and flex patterns
		{ pattern: /grid-cols-(1|2|3|4|5|6|12)/ },
		{ pattern: /col-span-(1|2|3|4|5|6|12)/ },
	],
	darkMode: ['class'], // Dark mode forced via class
	// Performance optimizations - disable unused core plugins
	corePlugins: {
		preflight: true,
		container: false, // Using custom container classes
		accessibility: true,
		pointerEvents: true,
		visibility: true,
		position: true,
		inset: true,
		isolation: false, // Rarely used
		zIndex: true,
		order: false, // Rarely used
		float: false, // Modern layout doesn't use float
		clear: false, // Modern layout doesn't use clear
		margin: true,
		boxSizing: true,
		display: true,
		aspectRatio: true,
		height: true,
		maxHeight: true,
		minHeight: true,
		width: true,
		minWidth: true,
		maxWidth: true,
		flex: true,
		flexShrink: true,
		flexGrow: true,
		flexBasis: true,
		tableLayout: false, // Rarely used
		borderCollapse: false, // Rarely used
		borderSpacing: false, // Rarely used
		transformOrigin: true,
		transform: true,
		animation: true,
		cursor: true,
		touchAction: true,
		userSelect: true,
		resize: false, // Rarely used
		scrollSnapType: false, // Rarely used
		scrollSnapAlign: false, // Rarely used
		appearance: true,
		columns: false, // Rarely used
		breakBefore: false, // Rarely used
		breakInside: false, // Rarely used
		breakAfter: false, // Rarely used
		gridTemplateColumns: true,
		gridTemplateRows: true
	},
	
	theme: {
		extend: {
      // SupaKoto 2025 Visual Identity Brand Palette
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#bf1e2e',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#bf1e2e',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#6b1d1d'
        },
        
        // SupaKoto brand colors (flattened for proper class generation)
        'supakoto-red': '#bf1e2e',
        'supakoto-dark-gray': '#333333',
        'supakoto-blue': '#1f8abf',
        'supakoto-yellow-gold': '#bfba1f',
        'supakoto-dark-slate': '#2a3940',
        'supakoto-deep-burgundy': '#6a343a',
        
        // Semantic colors mapped to brand palette
        foreground: 'hsl(var(--foreground))',
        background: 'hsl(var(--background))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        
        // Card colors
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        
        // Accent colors
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        
        // NEW: Semantic Design System Colors (reference CSS variables)
        brand: {
          primary: 'var(--brand-primary)',
          'primary-hover': 'var(--brand-primary-hover)',
          'primary-active': 'var(--brand-primary-active)',
          accent: 'var(--brand-accent)',
        },
        whatsapp: 'var(--color-whatsapp)',
        call: 'var(--color-call)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      
      // SupaKoto brand border radius system
      borderRadius: {
        'none': '0px',
        'sm': '0.125rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px'
      },
      
      // Brand spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      
      // SupaKoto brand animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'brand-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        // Continuous horizontal marquee used by the Testimonials track
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'brand-shimmer': 'brand-shimmer 2s ease-in-out infinite',
        // Utility consumed by src/components/carousels/Testimonials.tsx
        // Duration controls speed; duplicate content enables seamless loop
        'scroll': 'scroll 75s linear infinite'
      },
      
      // SupaKoto 2025 Typography System
      fontFamily: {
        'sans': ['RH-Zak', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'arabic': ['RH-Zak', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        'brand': ['RH-Zak', 'sans-serif']
      },
      
      // Typography scale for consistency
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      
      // Font weights for brand consistency
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900'
      }
    }
  },
  
  // Safelist critical classes that might be dynamically generated
  safelist: [
    // Animation classes
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-slide-in-left',
    'animate-slide-in-right',
    'animation-delay-200',
    'animation-delay-400',
    'animation-delay-600',
    'animation-delay-800',
    
    // Dynamic classes for Arabic/RTL
    'font-arabic',
    'text-right',
    'text-left',
    'flex-row-reverse',
    'justify-end',
    'justify-start',
    'ml-auto',
    'mr-auto',
    
    // Hover states
    'hover:scale-105',
    'hover:bg-red-700',
    'hover:border-red-500'
  ],
  
  plugins: [
    require('tailwindcss-rtl'),
    require('tailwindcss-animate'),
    // Custom plugin for performance optimizations
    function({ addUtilities, addComponents }) {
      // Add performance-optimized utilities
      addUtilities({
        '.will-change-transform': {
          'will-change': 'transform'
        },
        '.will-change-opacity': {
          'will-change': 'opacity'
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden'
        },
        '.transform-gpu': {
          'transform': 'translateZ(0)'
        },
        '.animation-delay-200': {
          'animation-delay': '0.2s'
        },
        '.animation-delay-400': {
          'animation-delay': '0.4s'
        },
        '.animation-delay-600': {
          'animation-delay': '0.6s'
        },
        '.animation-delay-800': {
          'animation-delay': '0.8s'
        }
      });
      
      // Add optimized component classes
      addComponents({
        '.btn-primary': {
          '@apply inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow-xl hover:bg-supakoto-deep-burgundy transition-all duration-300 hover:scale-105': {}
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center px-8 py-4 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg hover:border-primary transition-all duration-300 shadow-xl hover:scale-105': {}
        },
        '.container-custom': {
          '@apply mx-auto px-4 w-full max-w-7xl': {}
        }
      });
    }
  ]
};