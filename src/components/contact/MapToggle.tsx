import React, { useState, useEffect, useRef } from 'react';
import type { Branch } from '../../data/branches';

interface MapToggleProps {
  initial: { lat: number; lng: number; id: string };
  staticMapUrl: string;
  zoom?: number;
}

export default function MapToggle({ initial, zoom = 14 }: MapToggleProps) {
  const [currentBranch, setCurrentBranch] = useState(initial);
  const [isClient, setIsClient] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen to branch changes
  useEffect(() => {
    const handleBranchChange = (event: CustomEvent<Branch>) => {
      const branch = event.detail;
      const newBranch = { lat: branch.lat, lng: branch.lng, id: branch.id };
      setCurrentBranch(newBranch);

      // Update map view if map is loaded
      if (leafletMapRef.current && markerRef.current) {
        leafletMapRef.current.setView([branch.lat, branch.lng], zoom);
        markerRef.current.setLatLng([branch.lat, branch.lng]);
      }
    };

    window.addEventListener('branch:changed', handleBranchChange as EventListener);
    return () => {
      window.removeEventListener('branch:changed', handleBranchChange as EventListener);
    };
  }, [zoom]);

  // Add CSS for map marker and controls
  useEffect(() => {
    if (!document.getElementById('sk-map-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'sk-map-styles';
      styleEl.textContent = `
        /* Map container styles */
        .leaflet-container {
          width: 100% !important;
          height: 100% !important;
          border-radius: 1rem;
          min-height: 300px;
        }
        
        /* Ensure map tiles load properly on mobile */
        .leaflet-tile-container {
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Small top-right control */
        .leaflet-top.leaflet-right .sk-map-ctrl {
          display:flex; gap:.5rem; padding:.5rem;
          background:rgba(0,0,0,.45); backdrop-filter: blur(6px);
          border-radius: .75rem; border:1px solid rgba(255,255,255,.06);
        }
        .sk-map-ctrl button {
          font-size:.75rem; padding:.35rem .6rem; border-radius:.5rem;
          color:#fff; background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.08); cursor:pointer;
        }
        .sk-map-ctrl button:hover { background:rgba(255,255,255,.16); }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Load interactive map on component mount
  useEffect(() => {
    if (!mapRef.current || !isClient) return;
    
    const loadInteractiveMap = async () => {
      try {
        setMapError(null);
        // Dynamic import of Leaflet with better error handling
        const L = await import('leaflet');
        
        // Ensure Leaflet is properly loaded
        if (!L.map || !L.tileLayer) {
          throw new Error('Leaflet failed to load properly');
        }
        
        // Leaflet CSS is now loaded in Layout.astro head section
  
        // Initialize map with subtle inertia & smooth wheel zoom
        const map = L.map(mapRef.current, {
          zoomControl: false,
          scrollWheelZoom: 'center',
          inertia: true,
          worldCopyJump: true,
        }).setView([currentBranch.lat, currentBranch.lng], zoom);
        
        // Add tile layer (keeping light basemap as requested)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 20,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
  
        // Standard marker with default Leaflet pin and proper icon
        const marker = L.marker([currentBranch.lat, currentBranch.lng], {
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            shadowSize: [41, 41]
          })
        });
        markerRef.current = marker.addTo(map);
  
        // Minimal controls: zoom in/out top-left
        L.control.zoom({ position: 'topleft' }).addTo(map);

        // Custom small control (top-right): reset to branch + open directions
        const Ctrl = L.Control.extend({
          onAdd: function () {
            const div = L.DomUtil.create('div', 'sk-map-ctrl');
            div.innerHTML = `
              <button data-act="reset">Center</button>
              <button data-act="dir">Directions</button>
            `;
            div.addEventListener('click', (e:any) => {
              const t = e.target.closest('button');
              if (!t) return;
              if (t.dataset.act === 'reset') {
                map.setView([currentBranch.lat, currentBranch.lng], zoom);
              } else if (t.dataset.act === 'dir') {
                // Let the page-level inline script keep the href updated on the directions button
                document.querySelector<HTMLAnchorElement>('a[data-action="directions"]')?.click();
              }
            });
            return div;
          },
          onRemove: function () {}
        });
        // @ts-ignore
        new Ctrl({ position: 'topright' }).addTo(map);
  
        // Store references
        leafletMapRef.current = map;
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Failed to load interactive map:', error);
        setMapError('Failed to load interactive map. Please refresh the page.');
      }
    };
    
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(loadInteractiveMap, 100);
    return () => clearTimeout(timer);
  }, [currentBranch, zoom, isClient]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [currentBranch.lat, currentBranch.lng, zoom]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl bg-neutral-900">
      {!isClient && (
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      )}
      {isClient && mapError && (
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          <div className="text-center p-4">
            <p className="text-red-400 mb-2">⚠️ {mapError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-supakoto-red text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className={`w-full h-full ${!isClient || mapError ? 'hidden' : ''}`}
        style={{ minHeight: '300px' }}
      />
      {isClient && !isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80">
          <div className="text-center text-neutral-400">
            <div className="animate-spin w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full mx-auto mb-2"></div>
            <p>Initializing map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
