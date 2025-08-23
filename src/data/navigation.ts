export type NavItem = {
  label: { en: string; ar: string };
  href: { en: string; ar: string };
};

export const NAV_ITEMS: NavItem[] = [
  { label: { en: 'Home', ar: 'الرئيسية' }, href: { en: '/', ar: '/ar/' } },
  { label: { en: 'About', ar: 'من نحن' }, href: { en: '/about', ar: '/ar/about' } },
  { label: { en: 'Services', ar: 'الخدمات' }, href: { en: '/services', ar: '/ar/services' } },
  { label: { en: 'Gallery', ar: 'المعرض' }, href: { en: '/gallery', ar: '/ar/gallery' } },
  { label: { en: 'Contact', ar: 'تواصل' }, href: { en: '/contact', ar: '/ar/contact' } },
];
