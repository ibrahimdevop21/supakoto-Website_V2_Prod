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
    if (!mapRef.current) return;
    
    const loadInteractiveMap = async () => {
      try {
        // Dynamic import of Leaflet
        const L = await import('leaflet');
        
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
        markerRef.current = marker;
      } catch (error) {
        console.error('Failed to load interactive map:', error);
      }
    };
    
    loadInteractiveMap();
    
    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [currentBranch.lat, currentBranch.lng, zoom]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-2xl border border-white/5 bg-neutral-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)] overflow-hidden"
      ></div>
    </div>
  );
}
