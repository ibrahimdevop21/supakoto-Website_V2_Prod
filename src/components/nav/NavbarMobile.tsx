import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../../data/navLinks';

interface NavbarMobileProps {
  locale: 'en' | 'ar';
  activePath?: string;
}

export default function NavbarMobile({ locale, activePath }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'ar';

  // Hide trigger when menu is open
  const hideWhenOpen = isOpen ? 'invisible pointer-events-none' : '';

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (!isClient) return;
    const { body } = document;
    if (isOpen) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => { body.style.overflow = prev; };
    }
  }, [isOpen, isClient]);

  // Handle escape key
  useEffect(() => {
    if (!isClient) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isClient]);

  // Focus trap for menu
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isClient) return;
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Get localized href
  const getLocalizedHref = (href: string): string => {
    if (locale === 'ar') {
      return href === '/' ? '/ar' : `/ar${href}`;
    }
    return href;
  };

  const computeSwitchHref = () => {
    const path = activePath || (typeof window !== 'undefined' ? window.location.pathname : '/');
    return locale === 'ar'
      ? (path === '/ar' ? '/' : path.replace(/^\/ar(\/|$)/, '/'))
      : (path === '/' ? '/ar' : `/ar${path}`);
  };

  if (!isClient) {
    return (
      <button
        ref={buttonRef}
        className="md:hidden rounded-xl p-2 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200"
        aria-label="Menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }

  return (
    <div className="md:hidden" ref={menuRef} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Trigger */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`rounded-xl p-2 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200 ${hideWhenOpen}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Inline language toggle removed; language switch is available inside the expanded menu and in ActionPills */}

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10050] flex overscroll-contain"
          onClick={(e) => { if (e.target === e.currentTarget) closeMenu(); }}
        >
          {/* Backdrop: opaque enough to avoid hero bleed, no odd page tint */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="
              relative mx-4 mt-20 w-full
              transition-transform duration-200
              animate-[menuIn_.18s_ease-out]
            "
          >
            <div className="rounded-2xl border border-white/12 bg-neutral-900/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,.45)] overflow-hidden">
              {/* Single close control inside the panel */}
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={closeMenu}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white"
                  aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="pb-3">
                {/* Full-width language toggle inside menu */}
                {(() => {
                  const switchingTo = locale === 'ar' ? 'en' : 'ar';
                  const btnLabel = switchingTo === 'en' ? 'EN' : 'AR';
                  const aria = switchingTo === 'en' ? 'Switch to English' : 'Switch to Arabic';
                  const href = computeSwitchHref();
                  return (
                    <a
                      href={href}
                      onClick={closeMenu}
                      aria-label={aria}
                      className="block mx-3 mb-2 px-5 py-3 text-base text-white/95 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:outline-none font-bold uppercase tracking-wide text-center"
                    >
                      {btnLabel}
                    </a>
                  );
                })()}
                {NAV_LINKS.map((link) => {
                  const href = getLocalizedHref(link.href);
                  const label = locale === 'ar' ? link.label_ar : link.label_en;
                  return (
                    <a
                      key={link.href}
                      href={href}
                      onClick={closeMenu}
                      className="block px-5 py-3 text-base text-white/95 hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                    >
                      {label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
