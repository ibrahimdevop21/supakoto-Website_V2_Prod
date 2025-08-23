// Performance monitoring utilities for SupaKoto

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure Core Web Vitals
  measureCLS(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.metrics.set('CLS', (entry as any).value);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  measureLCP(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  measureFID(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.set('FID', (entry as any).processingStart - entry.startTime);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  // Resource loading optimization
  preloadCriticalResources(): void {
    if (typeof document !== 'undefined') {
      const criticalResources = [
        { href: '/logo.svg', as: 'image' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
      ];

      criticalResources.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (as === 'style') {
          link.onload = () => {
            link.rel = 'stylesheet';
          };
        }
        document.head.appendChild(link);
      });
    }
  }

  // Get performance metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Log performance data (only in development)
  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.getMetrics());
    }
  }
}

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();
    monitor.measureCLS();
    monitor.measureLCP();
    monitor.measureFID();
    monitor.preloadCriticalResources();
    
    // Log metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => monitor.logMetrics(), 5000);
    });
  }
};
