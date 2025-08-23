import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Phone, Clock, MapPin, Search, Navigation, Star, Users, Car } from '../icons/LightweightIcons';

// Fix for default marker icon issue with bundlers like Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

interface BranchLocatorProps {
  currentLocale: string;
  isRTL: boolean;
  selectedBranch?: Branch;
  onBranchSelect?: (branch: Branch) => void;
}

const BranchLocator: React.FC<BranchLocatorProps> = ({ 
  currentLocale, 
  isRTL, 
  selectedBranch = branches[0],
  onBranchSelect 
}) => {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isArabic = currentLocale === 'ar';

  const sectionTitle = {
    en: 'Find Our Locations',
    ar: 'اعثر على فروعنا',
  };

  const sectionSubtitle = {
    en: 'Visit any of our branches for premium automotive services',
    ar: 'قم بزيارة أي من فروعنا للحصول على خدمات السيارات المتميزة',
  };

  const searchPlaceholder = {
    en: 'Search by city or area...',
    ar: 'البحث بالمدينة أو المنطقة...',
  };

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isClient) {
    return (
      <div className="h-[800px] w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-slate-700 rounded w-48 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-white relative ${isArabic ? 'rtl font-arabic' : 'ltr'}`}>
      {/* Branch List - Horizontal on desktop, vertical on mobile */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {isArabic ? 'الفروع المتاحة' : 'Available Branches'}
          </h3>
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
            {filteredBranches.length} {isArabic ? 'فرع' : 'branches'}
          </span>
        </div>
        
        {/* Horizontal scrollable container on desktop, vertical stack on mobile */}
        <div className="flex flex-col md:flex-row md:gap-6 md:overflow-x-auto md:pb-4 space-y-4 md:space-y-0 max-h-[600px] md:max-h-none overflow-y-auto md:overflow-y-visible pr-2 custom-scrollbar">
          {filteredBranches.map((branch, index) => (
            <div
              key={branch.id}
              onClick={() => onBranchSelect?.(branch)}
              onMouseEnter={() => setHoveredBranch(branch.id)}
              onMouseLeave={() => setHoveredBranch(null)}
              className={`group p-5 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-sm transform hover:scale-[1.02] w-full md:w-80 md:flex-shrink-0 ${
                selectedBranch.id === branch.id 
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/50 shadow-lg shadow-red-500/20' 
                  : 'bg-slate-800/30 hover:bg-slate-700/50 border-slate-600/30 hover:border-red-500/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Branch Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors duration-300">
                    {branch.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-300">{branch.rating} • Google Review</span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedBranch.id === branch.id ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-gray-600'
                }`} />
              </div>

              {/* Branch Details */}
              <div className="space-y-2">
                <div className="flex items-start text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  <MapPin className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0 text-red-400" />
                  <span className="text-sm leading-relaxed">{branch.address}</span>
                </div>
                <div className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  <Phone className="w-4 h-4 mr-3 flex-shrink-0 text-green-400" />
                  <span className="text-sm">{branch.phone}</span>
                </div>
                <div className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  <Clock className="w-4 h-4 mr-3 flex-shrink-0 text-blue-400" />
                  <span className="text-sm">{branch.workingHours[isArabic ? 'ar' : 'en']}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredBranches.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {isArabic ? 'لم يتم العثور على فروع' : 'No branches found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchLocator;
