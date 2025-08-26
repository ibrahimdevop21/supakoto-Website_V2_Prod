import React, { useRef, useEffect, useState } from 'react';
import { Menu, Close } from '../ui/Icon';
import type { NavItem } from '../../data/navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  locale: 'en' | 'ar';
  currentPath: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onToggle,
  navItems,
  locale,
  currentPath,
}) => {
  const [isClient, setIsClient] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Ensure we're on client side before enabling interactions
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle drawer close on escape
  useEffect(() => {
    if (!isClient) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
        burgerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onToggle, isClient]);

  // Focus trap for drawer
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
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

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        !burgerRef.current?.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        ref={burgerRef}
        type="button"
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <Close className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Glass Drawer */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div className="fixed inset-0 top-16 bg-black/60 lg:hidden" onClick={onToggle} />
          
          {/* Drawer Content */}
          <div
            role="dialog"
            aria-label="Main Menu"
            className="fixed inset-x-0 top-16 text-white bg-gray-900/95 backdrop-blur-md border-t border-gray-600/50 shadow-2xl lg:hidden z-10"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
          <div ref={drawerRef} className="p-4 space-y-2">
            {navItems.map((item, index) => {
              const isActive = currentPath === item.href[locale];
              return (
                <a
                  key={`mobile-nav-${locale}-${index}-${item.href[locale]}`}
                  href={item.href[locale]}
                  className="block py-4 px-4 text-base font-medium text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={onToggle}
                >
                  {item.label[locale]}
                </a>
              );
            })}
          </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavigation;
