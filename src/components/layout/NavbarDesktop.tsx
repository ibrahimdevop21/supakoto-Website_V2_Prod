import React from 'react';
import { NAV_LINKS } from '../../data/navLinks';

interface NavbarDesktopProps {
  locale: 'en' | 'ar';
  activePath: string;
}

export default function NavbarDesktop({ locale, activePath }: NavbarDesktopProps) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const label = locale === 'ar' ? link.label_ar : link.label_en;
        const href = locale === 'ar' && link.href !== '/' ? `/ar${link.href}` : link.href === '/' && locale === 'ar' ? '/ar' : link.href;
        const active = activePath === href || (link.href !== '/' && activePath.startsWith(link.href));
        
        return (
          <a 
            key={link.href} 
            href={href} 
            className="relative text-white/90 hover:text-white transition-colors duration-200"
          >
            <span className="px-2 py-1 rounded-lg relative">
              {label}
              <span
                className={`pointer-events-none absolute left-1/2 -bottom-2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-[#bf1e2e] shadow-[0_0_8px_rgba(191,30,46,0.5)] origin-center transition-transform duration-300 ${
                  active ? 'scale-100' : 'scale-0'
                }`}
                aria-hidden="true"
              />
            </span>
          </a>
        );
      })}

      {/* Language toggle removed here to avoid duplication; present in ActionPills on the right */}
    </nav>
  );
}
