import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';
import B2CForm from './B2CForm';

// Fix for default marker icon issue with bundlers like Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Force map to invalidate size after view change
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map, center, zoom]);
  return null;
};

interface ContactBookingSectionProps {
  currentLocale: string;
  isRTL: boolean;
  locale: "en" | "ar";
  branchesForForm: any[];
  defaultBranchId?: string;
  defaultService?: string;
}

const ContactBookingSection: React.FC<ContactBookingSectionProps> = ({ 
  currentLocale, 
  isRTL,
  locale,
  branchesForForm,
  defaultBranchId,
  defaultService
}) => {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const handleMarkerClick = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return (
    <div className="space-y-12">
      {/* B2C Form and Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* B2C Form */}
        <div className="order-1 lg:order-1">
          <B2CForm 
            locale={locale}
            defaultService={defaultService}
          />
        </div>
        
        {/* Interactive Map */}
        <div className="order-2 lg:order-2">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            {/* Map Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentLocale === 'ar' ? 'مواقع فروعنا' : 'Our Locations'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {currentLocale === 'ar' ? 'اختر الفرع الأقرب إليك' : 'Choose the nearest branch to you'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="h-[500px] lg:h-[600px] relative">
              {isClient ? (
                <MapContainer
                  center={[selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]}
                  zoom={12}
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0 rounded-b-2xl"
                >
                  <ChangeView 
                    center={[selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]} 
                    zoom={12} 
                  />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  {branches.map((branch) => (
                    <Marker
                      key={branch.id}
                      position={[branch.coordinates.lat, branch.coordinates.lng]}
                      eventHandlers={{
                        click: () => handleMarkerClick(branch),
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold text-lg mb-2">
                            {branch.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {branch.address}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            <a 
                              href={`tel:${branch.phone}`}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {branch.phone}
                            </a>
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl animate-pulse flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-48 mx-auto mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-32 mx-auto"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Branch Locator - Full Width Below Both Form and Map */}
      <div>
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {currentLocale === 'ar' ? 'اختر فرعك المفضل' : 'Choose Your Preferred Branch'}
              </h3>
              <p className="text-gray-400">
                {currentLocale === 'ar' ? 'انقر على أي فرع لعرضه على الخريطة' : 'Click on any branch to view it on the map'}
              </p>
            </div>
          </div>
        </div>

        {/* Branch Cards - Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => handleBranchSelect(branch)}
              className={`
                w-full p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105
                ${selectedBranch.id === branch.id
                  ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50 shadow-lg shadow-red-500/25'
                  : 'bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 hover:border-slate-600/50'
                }
                backdrop-blur-sm
              `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {branch.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-yellow-400 font-medium">{branch.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {branch.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a 
                      href={`tel:${branch.phone}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {branch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300 text-sm">
                      {currentLocale === 'ar' ? branch.workingHours.ar : branch.workingHours.en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ContactBookingSection;
