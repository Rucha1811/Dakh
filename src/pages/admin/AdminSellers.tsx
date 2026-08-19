import { useState, useMemo } from 'react';
import { Search, Eye, CheckCircle, Ban } from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS, USERS } from '../../data/mockData';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  VERIFIED: 'bg-blue-100 text-blue-700',
  PENDING_VERIFICATION: 'bg-amber-100 text-amber-700',
  DRAFT: 'bg-gray-100 text-gray-600',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  VERIFIED: 'Verified',
  PENDING_VERIFICATION: 'Pending',
  DRAFT: 'Draft',
};

const FILTERS = ['All', 'Active', 'Verified', 'Pending'] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_MAP: Record<Filter, string | null> = {
  All: null,
  Active: 'ACTIVE',
  Verified: 'VERIFIED',
  Pending: 'PENDING_VERIFICATION',
};

export default function AdminSellers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const { addToast, language } = useAppStore();

  const filtered = useMemo(() => {
    let list = SELLERS;
    const status = FILTER_MAP[filter];
    if (status) list = list.filter((s) => s.verificationStatus === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.businessName.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const getOwner = (userId: string) => USERS.find((u) => u.id === userId);

  const handleAction = (action: string, name: string) => {
    addToast({ type: 'info', message: `${action} for "${name}" — simulated action` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.sellerManagement', language)}</h2>
        <p className="text-gray-500">{t('admin.manageVerify', language)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, state, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <p>No sellers found</p>
          </div>
        )}
        {filtered.map((s) => {
          const owner = getOwner(s.userId);
          return (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-primary)]">{s.businessName}</p>
                  {owner && <p className="text-xs text-gray-500 mt-0.5">{owner.name}</p>}
                  <p className="text-xs text-gray-500 mt-1">{s.district}, {s.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.verificationStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[s.verificationStatus] ?? s.verificationStatus}
                    </span>
                    <span className="text-xs text-gray-500">Readiness: {s.exportReadiness}%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleAction('View', s.businessName)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button
                  onClick={() => handleAction('Verify', s.businessName)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Verify
                </button>
                <button
                  onClick={() => handleAction('Disable', s.businessName)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Ban className="h-3.5 w-3.5" /> Disable
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">Business Name</th>
              <th className="p-4 font-medium">Owner</th>
              <th className="p-4 font-medium">State</th>
              <th className="p-4 font-medium">District</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Readiness</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">No sellers found</td>
              </tr>
            )}
            {filtered.map((s) => {
              const owner = getOwner(s.userId);
              return (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-primary)]">{s.businessName}</td>
                  <td className="p-4 text-gray-600">{owner?.name ?? '—'}</td>
                  <td className="p-4 text-gray-600">{s.state}</td>
                  <td className="p-4 text-gray-600">{s.district}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[s.verificationStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[s.verificationStatus] ?? s.verificationStatus}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{s.exportReadiness}%</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction('View', s.businessName)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('Verify', s.businessName)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-[var(--color-success)]"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction('Disable', s.businessName)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--color-brand-red)]"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
