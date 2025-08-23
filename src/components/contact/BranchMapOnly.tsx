import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { branches } from '../../data/branches';
import type { Branch } from '../../data/branches';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Phone, Clock } from '../icons/LightweightIcons';

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

interface BranchMapOnlyProps {
  currentLocale: string;
  isRTL: boolean;
  selectedBranch?: Branch;
  onBranchSelect?: (branch: Branch) => void;
}

const BranchMapOnly: React.FC<BranchMapOnlyProps> = ({ 
  currentLocale, 
  isRTL, 
  selectedBranch = branches[0],
  onBranchSelect 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isArabic = currentLocale === 'ar';

  if (!isClient) {
    return (
      <div className="h-[500px] lg:h-[600px] w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-slate-700 rounded w-48 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[500px] lg:h-[600px] relative ${isArabic ? 'rtl' : 'ltr'}`}>
      <MapContainer 
        center={[selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="z-0 rounded-b-2xl"
      >
        <ChangeView center={[selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]} zoom={12} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {branches.map((branch) => (
          <Marker 
            key={branch.id}
            position={[branch.coordinates.lat, branch.coordinates.lng]}
            eventHandlers={{
              click: () => onBranchSelect?.(branch),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h4 className="font-bold text-lg mb-2">{branch.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Phone className="w-3 h-3 mr-2" />
                  <a href={`tel:${branch.phone}`} className="hover:text-blue-600">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-3 h-3 mr-2" />
                  {branch.workingHours[isArabic ? 'ar' : 'en']}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BranchMapOnly;
