export interface NavLink {
  label_en: string;
  label_ar: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label_en: 'Home', label_ar: 'الرئيسية', href: '/' },
  { label_en: 'About', label_ar: 'من نحن', href: '/about' },
  { label_en: 'Services', label_ar: 'الخدمات', href: '/services' },
  { label_en: 'Gallery', label_ar: 'المعرض', href: '/gallery' },
  // { label_en: 'Business', label_ar: 'الأعمال', href: '/business' }, // Commented out - work in progress
  { label_en: 'Contact', label_ar: 'تواصل', href: '/contact' },
];
