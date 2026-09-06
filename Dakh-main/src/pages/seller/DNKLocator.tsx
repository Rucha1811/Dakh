import { useState, useRef, useMemo } from 'react';
import { Search, MapPin, Building2, Phone, Clock, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';
import { DNKS, DNK } from '../../data/mockData';
import GujaratMap from '../../components/GujaratMap';

export default function DNKLocator() {
  const { language } = useAppStore();
  const [selectedDnkId, setSelectedDnkId] = useState<string | undefined>('DNK001');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'gujarat' | 'all'>('gujarat');
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredDnks = useMemo(() => {
    return DNKS.filter(dnk => {
      const matchesTab = activeTab === 'gujarat' ? dnk.state === 'Gujarat' : true;
      const q = search.toLowerCase();
      const matchesSearch =
        dnk.name.toLowerCase().includes(q) ||
        dnk.address.toLowerCase().includes(q) ||
        dnk.district.toLowerCase().includes(q) ||
        dnk.state.toLowerCase().includes(q) ||
        dnk.pinCode.includes(q);
      return matchesTab && matchesSearch;
    });
  }, [search, activeTab]);

  const handleMapSelect = (dnkId: string) => {
    setSelectedDnkId(dnkId);
    const el = document.getElementById(`dnk-card-${dnkId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] via-slate-900 to-red-950 p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>India Post Dak Ghar Niryat Kendra Network</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t('seller.dnk.title', language)} & Gujarat Post Office Map
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Locate nearest export-enabled post offices across Ahmedabad, Surat, Kutch/Bhuj, Vadodara, Rajkot, and all Gujarat districts for simplified international customs and dispatch.
          </p>
        </div>
      </div>

      {/* Interactive Map Component */}
      <GujaratMap
        dnks={DNKS}
        selectedId={selectedDnkId}
        onSelect={handleMapSelect}
        initialDistrict="Gujarat"
        height="520px"
      />

      {/* Search & Listing Section */}
      <div className="space-y-4 pt-2">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tab Filter */}
          <div className="flex bg-gray-100 dark:bg-slate-700/60 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('gujarat')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'gujarat'
                  ? 'bg-white dark:bg-slate-800 text-[var(--color-brand-red)] shadow-sm'
                  : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              Gujarat DNK Hubs ({DNKS.filter(d => d.state === 'Gujarat').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-[var(--color-primary)] dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-300'
              }`}
            >
              All India DNKs ({DNKS.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by city (e.g. Ahmedabad, Bhuj, Surat), PIN code, or facility name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50/50 dark:bg-slate-900"
            />
          </div>
        </div>

        {/* List of DNKs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" ref={listRef}>
          {filteredDnks.map(dnk => {
            const isSelected = selectedDnkId === dnk.id;
            return (
              <div
                key={dnk.id}
                id={`dnk-card-${dnk.id}`}
                className={`bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[var(--color-brand-red)] ring-2 ring-[var(--color-brand-red)]/20 shadow-md'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
                onClick={() => setSelectedDnkId(dnk.id)}
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-red)] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                        {dnk.district}, {dnk.state}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm pt-1">
                        {dnk.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      dnk.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-red-100 text-red-700'
                    }`}>
                      {dnk.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 flex items-start mb-2.5 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0 text-red-500" />
                    {dnk.address}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-slate-400 mb-3 font-mono">
                    <span>PIN: <b className="text-gray-800 dark:text-slate-200">{dnk.pinCode}</b></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" /> {dnk.operatingHours}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {dnk.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${dnk.lat || 23.0225},${dnk.lng || 72.5714}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 text-center transition"
                  >
                    Directions
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBannerMsg(`Export dispatch initiated for ${dnk.name}! Postal Bill of Export draft ready.`);
                      setTimeout(() => setBannerMsg(null), 4000);
                    }}
                    className="flex-1 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-lg hover:bg-slate-900 text-center transition"
                  >
                    Book Dispatch
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {bannerMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="text-xs font-medium">{bannerMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}

