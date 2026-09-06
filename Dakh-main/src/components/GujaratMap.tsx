import { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin, Phone, Clock, Navigation,
  Key, Compass, Layers, Info, ExternalLink, X, Check,
} from 'lucide-react';
import { DNK } from '../data/mockData';
import L from 'leaflet';

interface GujaratMapProps {
  dnks: DNK[];
  selectedId?: string;
  onSelect?: (dnkId: string) => void;
  className?: string;
  initialDistrict?: string;
  height?: string;
}

const DISTRICT_PRESETS: Record<string, { center: [number, number]; zoom: number; name: string }> = {
  'Gujarat': { center: [22.4500, 71.4000], zoom: 7, name: 'Entire Gujarat' },
  'Ahmedabad': { center: [23.0225, 72.5714], zoom: 12, name: 'Ahmedabad' },
  'Surat': { center: [21.1702, 72.8311], zoom: 12, name: 'Surat' },
  'Bhuj': { center: [23.2420, 69.6669], zoom: 11, name: 'Bhuj / Kutch' },
  'Vadodara': { center: [22.3072, 73.1812], zoom: 12, name: 'Vadodara' },
  'Rajkot': { center: [22.3039, 70.8022], zoom: 12, name: 'Rajkot' },
  'Gandhinagar': { center: [23.2156, 72.6369], zoom: 12, name: 'Gandhinagar' },
  'Jamnagar': { center: [22.4707, 70.0577], zoom: 12, name: 'Jamnagar' },
  'Bhavnagar': { center: [21.7645, 72.1519], zoom: 12, name: 'Bhavnagar' },
  'Anand': { center: [22.5645, 72.9289], zoom: 12, name: 'Anand' },
  'Junagadh': { center: [21.5222, 70.4579], zoom: 12, name: 'Junagadh' },
  'Mehsana': { center: [23.5880, 72.3693], zoom: 12, name: 'Mehsana' },
  'Bharuch': { center: [21.7051, 72.9959], zoom: 12, name: 'Bharuch' },
  'India': { center: [22.5937, 78.9629], zoom: 5, name: 'All India' },
};

export default function GujaratMap({
  dnks,
  selectedId,
  onSelect,
  className = '',
  initialDistrict = 'Gujarat',
  height = '500px',
}: GujaratMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [mapEngine, setMapEngine] = useState<'leaflet' | 'google'>(() => {
    const saved = localStorage.getItem('niryat_map_engine');
    const hasGoogleKey = !!(localStorage.getItem('niryat_google_maps_api_key') || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY);
    return (saved === 'google' && hasGoogleKey) ? 'google' : 'leaflet';
  });
  
  const [googleApiKey, setGoogleApiKey] = useState<string>(() => {
    return localStorage.getItem('niryat_google_maps_api_key') || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
  });

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [activeDnk, setActiveDnk] = useState<DNK | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const googleMapRef = useRef<any>(null);
  const googleMarkersRef = useRef<{ [id: string]: any }>({});

  // Filter visible DNKs based on selected district
  const visibleDnks = useMemo(() => {
    if (selectedDistrict === 'India') {
      return dnks.filter(d => d.lat && d.lng);
    }
    const inGujarat = dnks.filter(d => d.state === 'Gujarat' && d.lat && d.lng);
    if (selectedDistrict === 'Gujarat') {
      return inGujarat;
    }
    return inGujarat.filter(d => d.district.toLowerCase() === selectedDistrict.toLowerCase());
  }, [dnks, selectedDistrict]);

  // Sync activeDnk with selectedId prop or default to first
  useEffect(() => {
    if (selectedId) {
      const found = dnks.find(d => d.id === selectedId);
      if (found) setActiveDnk(found);
    } else if (visibleDnks.length > 0 && !activeDnk) {
      setActiveDnk(visibleDnks[0]);
    }
  }, [selectedId, dnks, visibleDnks, activeDnk]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Setup Leaflet Map
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !mapContainerRef.current) return;

    // Destroy existing map if already created on this container
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const preset = DISTRICT_PRESETS[selectedDistrict] || DISTRICT_PRESETS['Gujarat'];
    
    // Initialize fresh map
    const map = L.map(mapContainerRef.current, {
      center: preset.center,
      zoom: preset.zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // High quality modern tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Layer group for markers
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    leafletMapRef.current = map;

    // Fix container size after DOM paint with multiple staggered passes
    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      map.remove();
      leafletMapRef.current = null;
    };
  }, [mapEngine, selectedDistrict]);

  // Update Markers and View when Visible DNKs or District changes
  useEffect(() => {
    if (mapEngine !== 'leaflet' || !leafletMapRef.current || !markersGroupRef.current) return;

    const map = leafletMapRef.current;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    const createCustomIcon = (isSelected: boolean) => {
      const bgColor = isSelected ? '#C62828' : '#102A43';
      const scale = isSelected ? 'scale-110 ring-4 ring-red-400/40' : 'hover:scale-105';
      return L.divIcon({
        className: 'custom-dnk-pin',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform ${scale}">
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white font-bold" style="background-color: ${bgColor};">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="w-2 h-1 bg-black/20 rounded-full blur-[1px] mt-0.5"></div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 36],
      });
    };

    visibleDnks.forEach(dnk => {
      if (!dnk.lat || !dnk.lng) return;

      const isSelected = activeDnk?.id === dnk.id || selectedId === dnk.id;
      const marker = L.marker([dnk.lat, dnk.lng], {
        icon: createCustomIcon(isSelected),
        title: dnk.name,
      });

      marker.on('click', () => {
        setActiveDnk(dnk);
        onSelect?.(dnk.id);
        map.flyTo([dnk.lat!, dnk.lng!], Math.max(map.getZoom(), 12), { duration: 0.6 });
      });

      markersGroup.addLayer(marker);
    });

    const preset = DISTRICT_PRESETS[selectedDistrict] || DISTRICT_PRESETS['Gujarat'];
    map.flyTo(preset.center, preset.zoom, { duration: 0.6 });
    map.invalidateSize();
  }, [mapEngine, visibleDnks, selectedDistrict, activeDnk?.id, selectedId, onSelect]);

  // Handle Google Maps Engine
  useEffect(() => {
    if (mapEngine !== 'google' || !googleApiKey) return;

    if (!(window as any).google?.maps && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleMap();
      document.head.appendChild(script);
    } else if ((window as any).google?.maps) {
      initGoogleMap();
    }

    function initGoogleMap() {
      if (!mapContainerRef.current || !(window as any).google?.maps) return;

      const preset = DISTRICT_PRESETS[selectedDistrict] || DISTRICT_PRESETS['Gujarat'];
      const map = new (window as any).google.maps.Map(mapContainerRef.current, {
        center: { lat: preset.center[0], lng: preset.center[1] },
        zoom: preset.zoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      });

      googleMapRef.current = map;

      Object.values(googleMarkersRef.current).forEach((m: any) => m.setMap(null));
      googleMarkersRef.current = {};

      visibleDnks.forEach(dnk => {
        if (!dnk.lat || !dnk.lng) return;

        const isSelected = activeDnk?.id === dnk.id || selectedId === dnk.id;
        const marker = new (window as any).google.maps.Marker({
          position: { lat: dnk.lat, lng: dnk.lng },
          map,
          title: dnk.name,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 10 : 7,
            fillColor: isSelected ? '#C62828' : '#102A43',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          setActiveDnk(dnk);
          onSelect?.(dnk.id);
          map.panTo({ lat: dnk.lat, lng: dnk.lng });
        });

        googleMarkersRef.current[dnk.id] = marker;
      });
    }
  }, [mapEngine, googleApiKey, visibleDnks, selectedDistrict, activeDnk?.id, selectedId, onSelect]);

  // GPS Nearest DNK Locator
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (leafletMapRef.current && mapEngine === 'leaflet') {
          leafletMapRef.current.flyTo([latitude, longitude], 13, { duration: 0.8 });
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#2563EB',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 0.9,
          }).addTo(leafletMapRef.current).bindPopup('<b>Your Current Location</b>').openPopup();
        }

        let closest: DNK | null = null;
        let minD = Infinity;
        visibleDnks.forEach(d => {
          if (d.lat && d.lng) {
            const dist = Math.hypot(d.lat - latitude, d.lng - longitude);
            if (dist < minD) {
              minD = dist;
              closest = d;
            }
          }
        });

        if (closest) {
          setActiveDnk(closest);
          onSelect?.((closest as DNK).id);
          showToast(`Nearest DNK: ${(closest as DNK).name}`);
        }
      },
      () => {
        showToast('Please enable browser location permission to find nearest center.');
      }
    );
  };

  const saveGoogleApiKey = () => {
    const cleanKey = tempKeyInput.trim();
    setGoogleApiKey(cleanKey);
    localStorage.setItem('niryat_google_maps_api_key', cleanKey);
    if (cleanKey) {
      setMapEngine('google');
      localStorage.setItem('niryat_map_engine', 'google');
      showToast('Google Maps Engine activated!');
    }
    setShowKeyModal(false);
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col w-full min-w-0 ${className}`}>
      {/* Top Controls Toolbar */}
      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-[var(--color-brand-red)] shadow-sm flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                Gujarat Post Office Export Centers (DNK)
              </h3>
              <span className="text-xs bg-red-100 dark:bg-red-900/60 text-[var(--color-brand-red)] dark:text-red-300 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                {visibleDnks.length} Hubs
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
              India Post authorized Dak Ghar Niryat Kendras for customs & international EMS
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0">
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl border border-blue-200 dark:border-blue-800 transition shadow-sm whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Nearest DNK</span>
          </button>

          <button
            onClick={() => {
              setTempKeyInput(googleApiKey);
              setShowKeyModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-xl border border-gray-300 dark:border-slate-600 transition shadow-sm whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>{googleApiKey ? 'Google Maps (Active)' : 'Map Engine / API Key'}</span>
          </button>
        </div>
      </div>

      {/* District Filter Pills Bar */}
      <div className="px-3 sm:px-4 py-2.5 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto text-xs w-full min-w-0 scrollbar-none">
        <span className="text-gray-400 dark:text-slate-500 font-semibold whitespace-nowrap mr-1 flex items-center gap-1 flex-shrink-0">
          <Layers className="w-3.5 h-3.5" /> Filter:
        </span>
        {Object.keys(DISTRICT_PRESETS).map(distKey => {
          const isSelected = selectedDistrict === distKey;
          return (
            <button
              key={distKey}
              onClick={() => setSelectedDistrict(distKey)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium text-xs transition flex-shrink-0 ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-sm font-semibold'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {DISTRICT_PRESETS[distKey].name}
            </button>
          );
        })}
      </div>

      {/* Responsive Map Layout: 2-Column Split on Desktop, Stacked on Mobile/Tablet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-w-0">
        {/* Left/Main Column: Leaflet Map Container */}
        <div className="lg:col-span-8 relative w-full min-w-0 bg-slate-900 overflow-hidden" style={{ minHeight: '460px' }}>
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[460px] z-0"
            style={{ minHeight: '460px' }}
          />

          {/* Engine watermark badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-600 dark:text-slate-300 shadow-md border border-gray-200 dark:border-slate-700 z-[400] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{mapEngine === 'google' ? 'Google Maps JS Engine' : 'CartoDB / OpenStreetMap Engine'}</span>
          </div>
        </div>

        {/* Right/Side Column: Docked Active Post Office Details Inspector */}
        <div className="lg:col-span-4 p-4 bg-slate-50/50 dark:bg-slate-800/60 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-700 flex flex-col justify-between min-w-0">
          {activeDnk ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-red)] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                    <MapPin className="w-3 h-3" /> {activeDnk.district}, Gujarat
                  </span>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-1 leading-snug">
                    {activeDnk.name}
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  activeDnk.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {activeDnk.status}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                {activeDnk.address}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" /> Operating Hours
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-slate-200 text-[11px] mt-0.5">
                    {activeDnk.operatingHours}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm">
                  <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3 text-green-500" /> Helpline
                  </div>
                  <a href={`tel:${activeDnk.contactPhone}`} className="font-semibold text-blue-600 text-[11px] mt-0.5 block hover:underline">
                    {activeDnk.contactPhone}
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Export Services Provided
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeDnk.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-md font-medium border border-green-200 dark:border-green-800/40"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeDnk.lat},${activeDnk.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 text-xs font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <button
                  onClick={() => {
                    showToast(`Assisted Export dispatched to ${activeDnk.name}! PBE draft ready.`);
                  }}
                  className="flex-1 py-2.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition shadow"
                >
                  Book Dispatch
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center text-gray-400">
              <MapPin className="w-8 h-8 mb-2 text-gray-300 dark:text-slate-600" />
              <p className="text-xs">Click on any post office pin on the map to inspect details</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-700 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Key className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  Google Maps API Configuration
                </h4>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-gray-400 hover:text-gray-600 rounded p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              Enter your Google Maps JavaScript API key to activate high-resolution Google Maps imagery. The key will be stored securely in your local browser storage.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-slate-200">
                Google Maps API Key:
              </label>
              <input
                type="text"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 text-xs border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-gray-50/50 dark:bg-slate-900"
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-xs text-blue-800 dark:text-blue-300 space-y-2 border border-blue-200 dark:border-blue-900">
              <div className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Map Engine Mode:
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMapEngine('leaflet')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition ${
                    mapEngine === 'leaflet'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 border-blue-200'
                  }`}
                >
                  Carto / OpenStreetMap (Free)
                </button>
                <button
                  onClick={() => setMapEngine('google')}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition ${
                    mapEngine === 'google'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 border-blue-200'
                  }`}
                >
                  Google Maps Engine
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setTempKeyInput('');
                  setGoogleApiKey('');
                  localStorage.removeItem('niryat_google_maps_api_key');
                  setMapEngine('leaflet');
                  localStorage.setItem('niryat_map_engine', 'leaflet');
                  setShowKeyModal(false);
                  showToast('Reset to default OpenStreetMap engine.');
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 transition"
              >
                Clear & Reset
              </button>
              <button
                onClick={saveGoogleApiKey}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-[var(--color-primary)] rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
