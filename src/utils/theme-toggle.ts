/* ============================================
   SUPAKOTO THEME TOGGLE
   ============================================
   
   Minimal theme switching logic.
   Toggles [data-theme] attribute on <html>.
   Persists preference in localStorage.
   
   SAFE IMPLEMENTATION:
   - No component coupling
   - No page reload required
   - Defaults to light theme
   - Respects user preference
   ============================================ */

const STORAGE_KEY = 'supakoto-theme';
const THEME_ATTR = 'data-theme';
const DARK = 'dark';
const LIGHT = 'light';

export type Theme = typeof DARK | typeof LIGHT;

/**
 * Get current theme from localStorage or system preference
 * Defaults to light if no preference exists
 */
export function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === LIGHT || stored === DARK) {
    return stored;
  }
  
  // Check system preference (optional)
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (prefersLight) {
      return LIGHT;
    }
    if (prefersDark) {
      return DARK;
    }
  }
  
  // Default to light
  return LIGHT;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  document.documentElement.setAttribute(THEME_ATTR, theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next = current === DARK ? LIGHT : DARK;
  applyTheme(next);
  return next;
}

/**
 * Get currently active theme
 */
export function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return LIGHT;
  
  const current = document.documentElement.getAttribute(THEME_ATTR);
  return current === DARK ? DARK : LIGHT;
}

/**
 * Initialize theme on page load
 * Call this once in your layout/app initialization
 */
export function initTheme(): void {
  const theme = getInitialTheme();
  applyTheme(theme);
}

/**
 * Listen for system theme changes (optional)
 * Only updates if user hasn't set a preference
 */
export function watchSystemTheme(): void {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    // Only auto-switch if user hasn't manually set a preference
    const hasManualPreference = localStorage.getItem(STORAGE_KEY) !== null;
    if (!hasManualPreference) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  };
  
  mediaQuery.addEventListener('change', handler);
}
