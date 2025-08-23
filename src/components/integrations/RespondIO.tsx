import { useEffect } from 'react';

export default function RespondIO({
  cId = 'c4efdb49fca2257b1a2cfcff1f9741f',
  enabled = true,
  loadStrategy = 'immediate' // 'idle' | 'delay' | 'immediate'
}: { cId?: string; enabled?: boolean; loadStrategy?: 'idle' | 'delay' | 'immediate' }) {

  useEffect(() => {
    if (!enabled) return;
    if (document.getElementById('respondio__widget')) return; // prevent duplicates

    console.log('🔧 RespondIO: Initializing widget with cId:', cId);

    // Cleanup function for hot reloads
    const cleanup = () => {
      const existingScript = document.getElementById('respondio__widget');
      if (existingScript) {
        existingScript.remove();
      }
      // Also remove any widget containers that might be left behind
      const widgets = document.querySelectorAll('[id*="respond-io"], [class*="respond-io"], [data-respond-io], .respond-io-widget, #respond-io-widget');
      widgets.forEach(widget => widget.remove());
      
      // Clear any global respond.io variables
      if (typeof window !== 'undefined') {
        (window as any).RespondIO = undefined;
        (window as any).respondIO = undefined;
      }
    };

    const load = () => {
      if (document.getElementById('respondio__widget')) return;
      
      console.log('🔧 RespondIO: Loading widget with cId:', cId);
      
      const s = document.createElement('script');
      s.id = 'respondio__widget';
      s.src = `https://cdn.respond.io/webchat/widget/widget.js?cId=${encodeURIComponent(cId)}`;
      s.async = true; // non-blocking
      
      // Add error handling
      s.onload = () => {
        console.log('✅ RespondIO: Script loaded successfully');
        
        // Check if widget initialized after a short delay
        setTimeout(() => {
          const widget = document.querySelector('[id*="respond-io"], [class*="respond-io"], [data-respond-io], .respond-io-widget, #respond-io-widget, iframe[src*="respond.io"]');
          if (widget) {
            console.log('✅ RespondIO: Widget found in DOM');
            // Ensure widget is visible and properly styled
            const widgetElement = widget as HTMLElement;
            widgetElement.style.zIndex = '9999';
            widgetElement.style.position = 'fixed';
            widgetElement.style.visibility = 'visible';
            widgetElement.style.opacity = '1';
            console.log('✅ RespondIO: Widget made visible');
          } else {
            console.warn('⚠️ RespondIO: Widget script loaded but no widget found in DOM. Check cId validity.');
          }
        }, 2000);
      };
      
      s.onerror = (error) => {
        console.error('❌ RespondIO: Script failed to load', error);
      };
      
      document.body.appendChild(s);
    };

    // Respect reduced motion for users who prefer less "busy" UIs
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (loadStrategy === 'immediate' || prefersReduced) {
      load();
    } else if ('requestIdleCallback' in window && loadStrategy === 'idle') {
      (window as any).requestIdleCallback(load, { timeout: 2000 });
    } else if (loadStrategy === 'delay') {
      setTimeout(load, 1200);
    } else {
      // fallback: idle via rAF chain
      const id = requestAnimationFrame(() => requestAnimationFrame(load));
      return () => {
        cancelAnimationFrame(id);
        cleanup();
      };
    }

    // Return cleanup function for component unmount and hot reloads
    return cleanup;
  }, [cId, enabled, loadStrategy]);

  // Render a fallback chat button if the widget doesn't load
  return (
    <div 
      id="fallback-chat-widget"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: '60px',
        height: '60px',
        backgroundColor: '#FF4444',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={() => {
        console.log('Fallback chat button clicked');
        // You can add your chat functionality here
        alert('Chat widget clicked! Replace this with your actual chat functionality.');
      }}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: 'white' }}
      >
        <path 
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" 
          fill="currentColor"
        />
        <circle cx="7" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="17" cy="10" r="1" fill="currentColor"/>
      </svg>
    </div>
  );
}
