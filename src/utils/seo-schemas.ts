// SEO Schema.org structured data generators for SupaKoto

interface BusinessSchema {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: string[];
  priceRange: string;
  serviceArea: string[];
}

interface ServiceSchema {
  name: string;
  description: string;
  provider: string;
  serviceType: string;
  areaServed: string[];
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

interface ReviewSchema {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
}

export function generateOrganizationSchema(locale: 'en' | 'ar' = 'en') {
  const isArabic = locale === 'ar';
  
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "SupaKoto",
    "alternateName": isArabic ? "سوباكوتو" : "SupaKoto PPF Services",
    "description": isArabic 
      ? "خدمات حماية الطلاء الاحترافية للسيارات في مصر والإمارات. نحن متخصصون في تركيب أفلام حماية الطلاء عالية الجودة لحماية استثمارك في السيارة عبر 4 فروع."
      : "Professional Paint Protection Film (PPF) services in Egypt and UAE. We specialize in premium automotive protection solutions to safeguard your vehicle investment across 4 locations.",
    "url": "https://supakoto.com",
    "logo": "https://supakoto.com/assets/logo.png",
    "image": "https://supakoto.com/assets/og-image.png",
    "telephone": "+20123456789",
    "email": "info@supakoto.com",
    "sameAs": [
      "https://www.instagram.com/supakoto",
      "https://www.facebook.com/supakoto",
      "https://wa.me/20123456789"
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Al Sheikh Zayed",
        "addressLocality": "Giza",
        "addressRegion": "Giza Governorate",
        "addressCountry": "EG",
        "name": isArabic ? "فرع الشيخ زايد" : "Al Sheikh Zayed Branch"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "New Cairo, 5th Settlement",
        "addressLocality": "Cairo",
        "addressRegion": "Cairo Governorate", 
        "addressCountry": "EG",
        "name": isArabic ? "فرع القاهرة الجديدة" : "New Cairo Branch"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Maadi, Inside Skoda Center",
        "addressLocality": "Cairo",
        "addressRegion": "Cairo Governorate",
        "addressCountry": "EG", 
        "name": isArabic ? "فرع المعادي" : "Maadi Branch"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Dubai",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE", 
        "name": isArabic ? "فرع دبي" : "Dubai Branch"
      }
    ],
    "areaServed": [
      {
        "@type": "Country", 
        "name": isArabic ? "مصر" : "Egypt"
      },
      {
        "@type": "Country",
        "name": isArabic ? "الإمارات العربية المتحدة" : "United Arab Emirates"
      }
    ],
    "serviceType": [
      isArabic ? "حماية الطلاء" : "Paint Protection Film",
      isArabic ? "تظليل النوافذ" : "Window Tinting",
      isArabic ? "حماية المصابيح" : "Headlight Protection",
      isArabic ? "حماية داخلية" : "Interior Protection"
    ],
    "priceRange": "$$",
    "openingHours": [
      "Mo-Sa 09:00-18:00"
    ],
    "paymentAccepted": [
      "Cash",
      "Credit Card", 
      "Bank Transfer"
    ],
    "currenciesAccepted": ["SAR", "EGP"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isArabic ? "خدمات حماية السيارات" : "Vehicle Protection Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "حماية الطلاء الكاملة" : "Full Paint Protection Film",
            "description": isArabic 
              ? "حماية شاملة لكامل السيارة بأفلام حماية عالية الجودة"
              : "Complete vehicle protection with premium paint protection film"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": isArabic ? "حماية المقدمة" : "Front End Protection",
            "description": isArabic
              ? "حماية مقدمة السيارة من الخدوش والحصى"
              : "Front-end protection from scratches and road debris"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150+",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

export function generateServiceSchema(serviceName: string, locale: 'en' | 'ar' = 'en') {
  const isArabic = locale === 'ar';
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "provider": {
      "@type": "Organization",
      "name": "SupaKoto"
    },
    "serviceType": isArabic ? "خدمات حماية السيارات" : "Automotive Protection Services",
    "description": isArabic
      ? "خدمات احترافية لحماية الطلاء والنوافذ والمصابيح للسيارات"
      : "Professional automotive protection services including paint protection film, window tinting, and headlight protection",
    "areaServed": [
      isArabic ? "المملكة العربية السعودية" : "Saudi Arabia",
      isArabic ? "مصر" : "Egypt"
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://supakoto.com/services",
      "servicePhone": "+966123456789"
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateReviewSchema(reviews: ReviewSchema[]) {
  return reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.reviewRating,
      "bestRating": "5"
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "itemReviewed": {
      "@type": "Organization",
      "name": "SupaKoto"
    }
  }));
}

export function generateLocalBusinessSchema(branchName: string, address: any, locale: 'en' | 'ar' = 'en') {
  const isArabic = locale === 'ar';
  
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": `SupaKoto - ${branchName}`,
    "description": isArabic
      ? `فرع سوباكوتو في ${branchName} - خدمات حماية الطلاء الاحترافية`
      : `SupaKoto ${branchName} Branch - Professional Paint Protection Services`,
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "telephone": "+966123456789",
    "url": "https://supakoto.com/locations",
    "openingHours": ["Mo-Sa 09:00-18:00"],
    "priceRange": "$$",
    "parentOrganization": {
      "@type": "Organization",
      "name": "SupaKoto"
    }
  };
}

export function generateWebsiteSchema(locale: 'en' | 'ar' = 'en') {
  const isArabic = locale === 'ar';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SupaKoto",
    "alternateName": isArabic ? "سوباكوتو" : "SupaKoto PPF Services",
    "url": "https://supakoto.com",
    "description": isArabic
      ? "الموقع الرسمي لسوباكوتو - خدمات حماية الطلاء الاحترافية في السعودية ومصر"
      : "Official website of SupaKoto - Professional Paint Protection Film services in Saudi Arabia and Egypt",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://supakoto.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SupaKoto"
    },
    "inLanguage": [locale],
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization", 
      "name": "SupaKoto"
    }
  };
}
