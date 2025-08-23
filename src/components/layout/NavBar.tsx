import React, { useState, useEffect, useRef } from 'react';
import { Globe } from '../ui/Icon';
import ColoredPhoneIcon from '../icons/ColoredPhoneIcon';
import ColoredWhatsappIcon from '../icons/ColoredWhatsappIcon';
import MobileNavigation from './MobileNavigation';
import { useSwitchLocalePath } from '../../i18n/react';
import { useGeoRegion } from '../../hooks/useGeoRegion';
import { toWhatsAppHref } from '../../utils/phone';
import type { NavItem } from '../../data/navigation';

interface NavBarProps {
  locale: 'en' | 'ar';
  navItems: NavItem[];
  currentPath: string;
}

const NavBar: React.FC<NavBarProps> = ({
  locale,
  navItems,
  currentPath,
}) => {


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const switchLocalePath = useSwitchLocalePath();
  
  // Get geo-based contact numbers
  const { numbers, region } = useGeoRegion({ locale });
  
  const isRTL = locale === 'ar';
  
  // Get the correct language switch URL
  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const otherLocaleHref = switchLocalePath(currentPath, otherLocale);

  // Handle scroll shadow effect
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    
    const onScroll = () => {
      if (window.scrollY > 8) {
        el.setAttribute('data-scrolled', 'true');
      } else {
        el.removeAttribute('data-scrolled');
      }
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);



  // Check if link is active
  const isActiveLink = (href: string): boolean => {
    if (href === '/') {
      return currentPath === '/' || currentPath === '/ar' || currentPath === '/ar/';
    }
    
    const normalizedPath = currentPath.replace(/^\/ar/, '').replace(/\/$/, '') || '/';
    const normalizedHref = href.replace(/\/$/, '') || '/';
    
    return normalizedPath === normalizedHref;
  };

  // Get localized href
  const getLocalizedHref = (href: string): string => {
    if (locale === 'ar') {
      return href === '/' ? '/ar' : `/ar${href}`;
    }
    return href;
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/10 border-b border-white/20 h-16 shadow-lg shadow-black/25 transition-all duration-500"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href={locale === 'ar' ? '/ar/' : '/'} className="flex items-center">
              <img
                src="/logo.svg"
                alt="SupaKoto - Automotive Excellence"
                className="h-8 md:h-10 w-auto"
                width="120"
                height="40"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            <div className={`flex items-center ${isRTL ? 'gap-6' : 'gap-6'}`}>
              {navItems.map((item, index) => {
              const isActive = currentPath === item.href[locale];
              return (
                <a
                  key={`desktop-nav-${locale}-${index}-${item.href[locale]}`}
                  href={item.href[locale]}
                  className="px-3 py-1.5 text-sm font-brand font-medium text-white/90 hover:text-white transition-colors data-[active=true]:border-b-2 data-[active=true]:border-supakoto-red"
                    data-active={isActive}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label[locale]}
                  </a>
              );
              })}
            </div>
          </div>

          {/* Action Buttons - Always Visible */}
          <div className="flex items-center gap-2">
            {/* Call Button */}
            <a
              href={`tel:${numbers.call.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-brand border border-white/20 text-white hover:bg-supakoto-red hover:text-white hover:border-supakoto-red transition-all duration-300"
              aria-label={`Call SupaKoto (${region})`}
            >
              <ColoredPhoneIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Call</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href={toWhatsAppHref(numbers.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-brand border border-white/20 text-white hover:bg-supakoto-red hover:text-white hover:border-supakoto-red transition-all duration-300"
              aria-label={`WhatsApp SupaKoto (${region})`}
            >
              <ColoredWhatsappIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Language Switcher */}
            <a
              href={otherLocaleHref}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-brand border border-white/20 text-white hover:bg-supakoto-red hover:text-white hover:border-supakoto-red transition-all duration-300"
              aria-label={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {locale === 'en' ? 'AR' : 'EN'}
            </a>

            {/* Mobile Navigation */}
            <MobileNavigation
              isOpen={isDrawerOpen}
              onToggle={toggleDrawer}
              navItems={navItems}
              locale={locale}
              currentPath={currentPath}
            />
          </div>
        </div>


    </nav>
  );
};

export default NavBar;
