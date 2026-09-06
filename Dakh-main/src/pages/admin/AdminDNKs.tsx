import { useState, useMemo } from 'react';
import { Search, Building2, Phone, Clock, MapPin, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { DNKS } from '../../data/mockData';
import GujaratMap from '../../components/GujaratMap';
import { downloadPDF, downloadWord, downloadCSV } from '../../utils/documentExporter';

const STATES = ['All', ...Array.from(new Set(DNKS.map((d) => d.state)))].sort();
const STATUSES = ['All', 'Open', 'Closed'] as const;
type StatusFilter = (typeof STATUSES)[number];

export default function AdminDNKs() {
  const { language, addToast } = useAppStore();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [selectedDnkId, setSelectedDnkId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    let list = DNKS;
    if (stateFilter !== 'All') list = list.filter((d) => d.state === stateFilter);
    if (statusFilter !== 'All') list = list.filter((d) => d.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.district.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q),
      );
    }
    return list;
  }, [stateFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.dnkManagement', language)}</h2>
          <p className="text-gray-500">{t('admin.manageCenters', language)}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              const items = filtered.map(d => ({
                name: `${d.name} (${d.district}, ${d.state})`,
                quantity: 1,
                unitPrice: 0,
                total: 0,
                hsCode: d.pinCode,
                weight: 0
              }));
              downloadPDF({
                title: 'National Dak Ghar Niryat Kendra (DNK) Center Directory',
                documentType: 'Official India Post Network Directory',
                docNumber: `DNK-DIR-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString('en-IN'),
                sellerName: 'Department of Posts - India Post',
                sellerBusiness: 'Dak Ghar Niryat Kendra Network',
                items: items.slice(0, 15),
              }, 'dnk_centers_directory');
              addToast({ type: 'success', message: 'PDF DNK Directory generated!' });
            }}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download PDF Directory"
          >
            <Download className="h-3.5 w-3.5" /> PDF
          </button>

          <button
            onClick={() => {
              const items = filtered.map(d => ({
                name: `${d.name} (${d.district}, ${d.state})`,
                quantity: 1,
                unitPrice: 0,
                total: 0,
                hsCode: d.pinCode,
                weight: 0
              }));
              downloadWord({
                title: 'National Dak Ghar Niryat Kendra (DNK) Center Directory',
                documentType: 'Official India Post Network Directory',
                docNumber: `DNK-DIR-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString('en-IN'),
                sellerName: 'Department of Posts - India Post',
                sellerBusiness: 'Dak Ghar Niryat Kendra Network',
                items: items,
              }, 'dnk_centers_directory.doc');
              addToast({ type: 'success', message: 'Word (.doc) Directory downloaded!' });
            }}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download Word (.doc)"
          >
            <Download className="h-3.5 w-3.5" /> Word (.doc)
          </button>

          <button
            onClick={() => {
              const rows = filtered.map(d => ({
                'DNK ID': d.id,
                'Center Name': d.name,
                'District': d.district,
                'State': d.state,
                'Pincode': d.pinCode,
                'Status': d.status,
                'Contact Phone': d.contactPhone || 'N/A',
              }));
              downloadCSV(rows, 'dnk_centers_directory.csv');
              addToast({ type: 'success', message: 'CSV Directory downloaded!' });
            }}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download CSV"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <GujaratMap
        dnks={DNKS}
        selectedId={selectedDnkId}
        onSelect={(id) => setSelectedDnkId(id)}
        initialDistrict="Gujarat"
        height="440px"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, district, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All States' : s}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Building2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No DNKs found</p>
          </div>
        )}
        {filtered.map((dnk) => (
          <div key={dnk.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-primary)]">{dnk.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{dnk.district}, {dnk.state}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    dnk.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {dnk.status}
                  </span>
                  <span className="text-xs text-gray-500">{dnk.services.length} services</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {dnk.contactPhone}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {dnk.operatingHours}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">DNK Name</th>
              <th className="p-4 font-medium">State</th>
              <th className="p-4 font-medium">District</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Services</th>
              <th className="p-4 font-medium">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">No DNKs found</td>
              </tr>
            )}
            {filtered.map((dnk) => (
              <tr key={dnk.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold text-[var(--color-primary)]">{dnk.name}</td>
                <td className="p-4 text-gray-600">{dnk.state}</td>
                <td className="p-4 text-gray-600">{dnk.district}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dnk.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {dnk.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{dnk.services.length}</td>
                <td className="p-4 text-gray-600">{dnk.contactPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
