export type Locale = 'en' | 'ar';

export type ServicedBrand = {
  name: string;
  slug: string;
  logoSrc: string;
  darkLogoSrc?: string;
  url?: string;
  alt?: { en: string; ar: string };
};

export const SERVICED_BRANDS: ServicedBrand[] = [
  {
    name: 'Bentley',
    slug: 'bentley',
    logoSrc: '/partners/bentley-2.svg',
    alt: { en: 'Bentley — vehicle serviced by SupaKoto', ar: 'بنتلي — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'BMW',
    slug: 'bmw',
    logoSrc: '/partners/bmw-7.svg',
    alt: { en: 'BMW — vehicle serviced by SupaKoto', ar: 'بي إم دبليو — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Citroën',
    slug: 'citroen',
    logoSrc: '/partners/citroen.svg',
    darkLogoSrc: '/partners/citroen-dark-logo.svg',
    alt: { en: 'Citroën — vehicle serviced by SupaKoto', ar: 'سيتروين — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Ferrari',
    slug: 'ferrari',
    logoSrc: '/partners/ferrari-4.svg',
    alt: { en: 'Ferrari — vehicle serviced by SupaKoto', ar: 'فيراري — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Hyundai',
    slug: 'hyundai',
    logoSrc: '/partners/hyundai-motor-company-2.svg',
    alt: { en: 'Hyundai — vehicle serviced by SupaKoto', ar: 'هيونداي — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Jetour',
    slug: 'jetour',
    logoSrc: '/partners/jetour.svg',
    darkLogoSrc: '/partners/jetour-dark-logo.svg',
    alt: { en: 'Jetour — vehicle serviced by SupaKoto', ar: 'جيتور — تم خدمتها لدى سوباكوتو' }
  },
  {
    slug: 'byd',
    name: 'BYD Auto',
    logoSrc: '/partners/byd-auto-1.svg',
    alt: { en: 'BYD Auto — vehicle serviced by SupaKoto', ar: 'بي واي دي أوتو — تم خدمتها لدى سوباكوتو' }
  },
  {
    slug: 'changan',
    name: 'Changan',
    logoSrc: '/partners/changan-icon-seeklogo.svg',
    alt: { en: 'Changan — vehicle serviced by SupaKto', ar: 'شانجان — تم خدمتها لدى سوباكوتو' }
  },
  {
    slug: 'chery',
    name: 'Chery',
    logoSrc: '/partners/chery-3.svg',
    alt: { en: 'Chery — vehicle serviced by SupaKoto', ar: 'شيري — تم خدمتها لدى سوباكوتو' }
  },
  {
    slug: 'geely',
    name: 'Geely',
    logoSrc: '/partners/geely-logo-2.svg',
    alt: { en: 'Geely — vehicle serviced by SupaKoto', ar: 'جيلي — تم خدمتها لدى سوباكوتو' }
  },
  {
    slug: 'haval',
    name: 'Haval',
    logoSrc: '/partners/haval-logo.svg',
    alt: { en: 'Haval — vehicle serviced by SupaKoto', ar: 'هافال — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Kia',
    slug: 'kia',
    logoSrc: '/partners/kia-4.svg',
    alt: { en: 'Kia — vehicle serviced by SupaKoto', ar: 'كيا — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Lamborghini',
    slug: 'lamborghini',
    logoSrc: '/partners/lamborghini.svg',
    alt: { en: 'Lamborghini — vehicle serviced by SupaKoto', ar: 'لامبورغيني — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Lexus',
    slug: 'lexus',
    logoSrc: '/partners/lexus.svg',
    alt: { en: 'Lexus — vehicle serviced by SupaKoto', ar: 'لكزس — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Mercedes-Benz',
    slug: 'mercedes-benz',
    logoSrc: '/partners/mercedes-benz-9.svg',
    alt: { en: 'Mercedes-Benz — vehicle serviced by SupaKoto', ar: 'مرسيدس-بنز — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Nissan',
    slug: 'nissan',
    logoSrc: '/partners/nissan-6.svg',
    alt: { en: 'Nissan — vehicle serviced by SupaKoto', ar: 'نيسان — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Peugeot',
    slug: 'peugeot',
    logoSrc: '/partners/peugeot-8.svg',
    alt: { en: 'Peugeot — vehicle serviced by SupaKoto', ar: 'بيجو — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Porsche',
    slug: 'porsche',
    logoSrc: '/partners/porsche-6.svg',
    alt: { en: 'Porsche — vehicle serviced by SupaKoto', ar: 'بورشه — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Renault',
    slug: 'renault',
    logoSrc: '/partners/renault.svg',
    alt: { en: 'Renault — vehicle serviced by SupaKoto', ar: 'رينو — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Rolls-Royce',
    slug: 'rolls-royce',
    logoSrc: '/partners/rolls-royce.svg',
    alt: { en: 'Rolls-Royce — vehicle serviced by SupaKoto', ar: 'رولز-رويس — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Škoda',
    slug: 'skoda',
    logoSrc: '/partners/skoda.svg',
    alt: { en: 'Škoda — vehicle serviced by SupaKoto', ar: 'سكودا — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Tesla',
    slug: 'tesla',
    logoSrc: '/partners/tesla-motors.svg',
    alt: { en: 'Tesla — vehicle serviced by SupaKoto', ar: 'تسلا — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Toyota',
    slug: 'toyota',
    logoSrc: '/partners/toyota-tile.svg',
    alt: { en: 'Toyota — vehicle serviced by SupaKoto', ar: 'تويوتا — تم خدمتها لدى سوباكوتو' }
  },
  {
    name: 'Volkswagen',
    slug: 'volkswagen',
    logoSrc: '/partners/volkswagen-10.svg',
    alt: { en: 'Volkswagen — vehicle serviced by SupaKoto', ar: 'فولكس فاغن — تم خدمتها لدى سوباكوتو' }
  }
];
