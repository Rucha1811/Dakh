import { useState, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';
import { DNKS } from '../../data/mockData';
import IndiaMap from '../../components/IndiaMap';

export default function DNKLocator() {
  const { language } = useAppStore();
  const [selectedDnkId, setSelectedDnkId] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const filteredDnks = DNKS.filter(dnk =>
    dnk.name.toLowerCase().includes(search.toLowerCase()) ||
    dnk.address.toLowerCase().includes(search.toLowerCase()) ||
    dnk.district.toLowerCase().includes(search.toLowerCase()) ||
    dnk.state.toLowerCase().includes(search.toLowerCase()) ||
    dnk.pinCode.includes(search)
  );

  const handleMapSelect = (dnkId: string) => {
    setSelectedDnkId(dnkId);
    const el = document.getElementById(`dnk-card-${dnkId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.dnk.title', language)}</h2>
        <p className="text-gray-500">{t('seller.dnk.subtitle', language)}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by city, PIN code, or state..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2" ref={listRef}>
          {filteredDnks.map(dnk => (
            <div
              key={dnk.id}
              id={`dnk-card-${dnk.id}`}
              className={`bg-white p-5 rounded-xl shadow-sm border cursor-pointer transition-colors relative ${
                selectedDnkId === dnk.id
                  ? 'border-[var(--color-brand-red)] ring-2 ring-[var(--color-brand-red)]/20'
                  : 'border-gray-200 hover:border-[var(--color-primary)]'
              }`}
              onClick={() => setSelectedDnkId(dnk.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-[var(--color-primary)] pr-8">{dnk.name}</h3>
                <span className={`absolute top-5 right-5 text-xs font-bold px-2 py-1 rounded-full ${
                  dnk.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {dnk.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 flex items-start mb-3">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                {dnk.address}
              </p>
              <div className="text-xs text-gray-500 mb-3">{dnk.operatingHours}</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {dnk.services.map((service, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] text-sm font-medium rounded hover:bg-blue-50 transition-colors">
                  View Details
                </button>
                <button className="flex-1 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                  Start Assisted Export
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-center relative overflow-hidden min-h-[400px]">
          <IndiaMap onSelect={handleMapSelect} selectedId={selectedDnkId} />
        </div>
      </div>
    </div>
  );
}
