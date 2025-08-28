import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../../data/navLinks';

interface NavbarMobileProps {
  locale: 'en' | 'ar';
}

export default function NavbarMobile({ locale }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRTL = locale === 'ar';

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <div className="md:hidden relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-xl p-2 bg-white/10 border border-white/20 hover:bg-white/20 transition duration-200"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Panel */}
      <div
        className={`
          absolute right-0 mt-2 w-[88vw] max-w-sm overflow-hidden transition-[max-height,opacity] duration-300
          ${
            isOpen
              ? 'max-h-[60vh] opacity-100'
              : 'max-h-0 opacity-0'
          }
        `}
      >
        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur p-4 shadow-[0_12px_40px_rgba(0,0,0,.45)]">
          {/* Navigation Links */}
          <nav className="space-y-2">
            {NAV_LINKS.map((link) => {
              const href = getLocalizedHref(link.href);
              const label = locale === 'ar' ? link.label_ar : link.label_en;

              return (
                <a
                  key={link.href}
                  href={href}
                  onClick={closeMenu}
                  className="block px-2 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
