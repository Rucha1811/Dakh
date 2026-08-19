import { useState, useMemo } from 'react';
import {
  FileText, Search,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';

type DocFilter = 'All' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED';

const FILTERS: DocFilter[] = ['All', 'UNDER_REVIEW', 'VERIFIED', 'CORRECTION_REQUIRED'];

const FILTER_LABELS: Record<DocFilter, string> = {
  All: 'All',
  UNDER_REVIEW: 'Under Review',
  VERIFIED: 'Verified',
  CORRECTION_REQUIRED: 'Correction Required',
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  UPLOADED: { label: 'Uploaded', color: 'text-blue-700', bg: 'bg-blue-100' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-100' },
  VERIFIED: { label: 'Verified', color: 'text-[var(--color-success)]', bg: 'bg-green-100' },
  CORRECTION_REQUIRED: { label: 'Correction Required', color: 'text-[var(--color-brand-red)]', bg: 'bg-red-100' },
};

export default function OperatorDocuments() {
  const { documents, updateDocumentStatus, addToast, language } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<DocFilter>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = documents;
    if (activeFilter !== 'All') result = result.filter((d) => d.status === activeFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) => {
        const seller = SELLERS.find((s) => s.id === d.sellerId);
        return d.name.toLowerCase().includes(q) || seller?.businessName.toLowerCase().includes(q);
      });
    }
    return result;
  }, [documents, activeFilter, searchQuery]);

  const getSellerName = (sellerId: string) => {
    const seller = SELLERS.find((s) => s.id === sellerId);
    return seller?.businessName ?? 'Unknown';
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const reviewable = filtered.filter((d) => d.status === 'UNDER_REVIEW');
    if (reviewable.length === selectedIds.size) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(reviewable.map((d) => d.id)));
    }
  };

  const handleVerify = (id: string) => {
    updateDocumentStatus(id, 'VERIFIED');
    addToast({ message: 'Document verified', type: 'success' });
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleRequestCorrection = (id: string) => {
    updateDocumentStatus(id, 'CORRECTION_REQUIRED');
    addToast({ message: 'Correction requested', type: 'info' });
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkVerify = () => {
    selectedIds.forEach((id) => updateDocumentStatus(id, 'VERIFIED'));
    addToast({ message: `${selectedIds.size} document(s) verified`, type: 'success' });
    setSelectedIds(new Set());
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('nav.documents', language)}</h2>
        <p className="text-gray-500">{t('operator.reviewDocs', language)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by document or seller name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-blue-700">{selectedIds.size} document(s) selected</span>
          <button onClick={handleBulkVerify} className="px-3 py-1 bg-[var(--color-success)] text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
            Bulk Verify
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium w-10">
                  <input
                    type="checkbox"
                    checked={filtered.filter((d) => d.status === 'UNDER_REVIEW').length > 0 && filtered.filter((d) => d.status === 'UNDER_REVIEW').every((d) => selectedIds.has(d.id))}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 font-medium">Document</th>
                <th className="p-4 font-medium hidden sm:table-cell">Seller</th>
                <th className="p-4 font-medium hidden md:table-cell">Order ID</th>
                <th className="p-4 font-medium hidden sm:table-cell">Upload Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No documents found</td></tr>
              )}
              {filtered.map((d) => {
                const st = STATUS_STYLES[d.status] ?? STATUS_STYLES.DRAFT;
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(d.id)}
                        onChange={() => toggleSelect(d.id)}
                        disabled={d.status !== 'UNDER_REVIEW'}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{d.name}</span>
                    </td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{getSellerName(d.sellerId)}</td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">{d.orderId ?? '—'}</td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{formatDate(d.uploadedAt)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="p-4 text-right">
                      {d.status === 'UNDER_REVIEW' && (
                        <div className="flex gap-2 justify-end">
                           <button onClick={() => handleVerify(d.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors">{t('common.verify', language)}</button>
                           <button onClick={() => handleRequestCorrection(d.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-accent-amber)] text-white rounded-lg hover:bg-amber-600 transition-colors">{t('operator.requestInfo', language)}</button>
                        </div>
                      )}
                      {(d.status === 'VERIFIED' || d.status === 'CORRECTION_REQUIRED') && (
                        <span className="text-xs text-gray-400">No action</span>
                      )}
                      {(d.status === 'DRAFT' || d.status === 'UPLOADED') && (
                        <span className="text-xs text-gray-400">Awaiting review</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
