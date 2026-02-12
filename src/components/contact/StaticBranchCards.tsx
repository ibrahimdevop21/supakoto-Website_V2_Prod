import React from 'react';
import type { Branch } from '../../data/branches';

// No-op function for TikTok tracking while disabled
function trackTikTok(_event: string, _props: Record<string, unknown> = {}) {
  // Intentionally a no-op while TikTok is disabled.
  // TODO: Re-enable later with guarded calls (if (window.ttq?.track) window.ttq.track(...))
}

interface StaticBranchCardsProps {
  branches: Branch[];
  locale?: 'en' | 'ar';
}

export default function StaticBranchCards({ branches, locale = 'en' }: StaticBranchCardsProps) {
  const isRTL = locale === 'ar';

  const t = {
    headquarters: locale === 'ar' ? 'المقر الرئيسي' : 'Headquarters',
    phone: locale === 'ar' ? 'الهاتف' : 'Phone',
    whatsapp: locale === 'ar' ? 'واتساب' : 'WhatsApp',
    hours: locale === 'ar' ? 'ساعات العمل' : 'Hours',
    location: locale === 'ar' ? 'الموقع' : 'Location',
    directions: locale === 'ar' ? 'الاتجاهات' : 'Get Directions'
  };

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/10"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10">
            {/* Branch Name & HQ Badge */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white leading-tight">
                {locale === 'ar' ? branch.name : (
                  branch.id === 'cairo_5th' ? 'SupaKoto Cairo - New Cairo' :
                  branch.id === 'maadi' ? 'SupaKoto Cairo - Maadi' :
                  branch.id === 'sheikh_zayed' ? 'SupaKoto Cairo - Sheikh Zayed' :
                  branch.id === 'damietta' ? 'SupaKoto Damietta' :
                  branch.id === 'dubai' ? 'SupaKoto Dubai - Headquarters' : branch.name
                )}
              </h3>
              {branch.isHQ && (
                <span className="px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-full">
                  {t.headquarters}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="mb-4">
              <p className="text-neutral-300 leading-relaxed">
                {locale === 'ar' ? branch.address : (
                  branch.id === 'cairo_5th' ? 'New Cairo, Fifth Settlement, Cairo Governorate' :
                  branch.id === 'maadi' ? 'Inside Skoda Maadi Center, 199 Wadi Degla St, Zahraa El Maadi, Cairo' :
                  branch.id === 'sheikh_zayed' ? 'Sheikh Zayed City, Giza Governorate' :
                  branch.id === 'damietta' ? 'Damietta, Damietta Governorate' :
                  branch.id === 'dubai' ? 'Al Quoz 4, Dubai, United Arab Emirates' : branch.address
                )}
              </p>
            </div>

            {/* Contact Info Grid */}
            <div className="grid gap-3 mb-4">
              {/* Phone Numbers */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 text-green-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">{t.phone}:</span>
                  <div className="flex flex-wrap gap-2">
                    {branch.phones.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone}`}
                        className="text-white hover:text-green-400 transition-colors font-medium"
                        dir="ltr"
                        onClick={() => {
                          // Fire tracking as NO-OP for now (kept for future parity)
                          trackTikTok('ClickButton', { button: 'Call', region: 'UAE' });
                        }}
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              {branch.whatsapp && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 text-green-500">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm text-neutral-400">{t.whatsapp}:</span>
                    <a
                      href={`https://wa.me/${branch.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white hover:text-green-400 transition-colors font-medium"
                      dir="ltr"
                      data-gtm-type="whatsapp"
                      data-button-text={`WhatsApp ${branch.name}`}
                      onClick={() => {
                        // TikTok tracking
                        trackTikTok('ClickButton', { button: 'WhatsApp', region: 'UAE' });
                        
                        // GTM dataLayer tracking - includes parameters for GA4_WhatsApp_click tag
                        try {
                          if (typeof window !== 'undefined') {
                            (window as any).dataLayer = (window as any).dataLayer || [];
                            (window as any).dataLayer.push({
                              event: 'whatsapp_click',
                              phone_number: branch.whatsapp,
                              button_class: 'branch-whatsapp-btn',
                              button_text: 'WhatsApp',
                              location: 'branch_card',
                              branch_name: branch.name,
                              page_location: location.href
                            });
                          }
                        } catch (error) {
                          console.error('GTM tracking error:', error);
                        }
                      }}
                    >
                      +{branch.whatsapp.replace(/(\d{1,3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">{t.hours}:</span>
                  <div className="text-white">
                    {(locale === 'ar' ? branch.hours : 
                      branch.id === 'dubai' ? ['Saturday–Thursday: 9AM–7PM', 'Friday: Closed'] :
                      ['Saturday–Thursday: 10AM–8PM', 'Friday: Closed']
                    ).map((hour, idx) => (
                      <div key={idx} className="text-sm">{hour}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Location Button */}
            <div className="pt-4 border-t border-slate-700/50">
              <a
                href={branch.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {t.directions}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
