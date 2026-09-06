import { useState, useMemo } from 'react';
import {
  FileText, Search, Download, Eye, CheckCircle, Clock, AlertCircle, FileSpreadsheet, ShieldCheck
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import DocumentPreview from '../../components/DocumentPreview';
import { downloadPDF, downloadWord, downloadCSV } from '../../utils/documentExporter';

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

  // Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{
    name: string;
    type: string;
    sellerName: string;
    orderId?: string;
  }>({ name: '', type: '', sellerName: '' });

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
    addToast({ message: 'Document verified & customs stamp applied', type: 'success' });
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleRequestCorrection = (id: string) => {
    updateDocumentStatus(id, 'CORRECTION_REQUIRED');
    addToast({ message: 'Correction request notified to seller', type: 'info' });
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkVerify = () => {
    selectedIds.forEach((id) => updateDocumentStatus(id, 'VERIFIED'));
    addToast({ message: `${selectedIds.size} document(s) verified & stamped!`, type: 'success' });
    setSelectedIds(new Set());
  };

  const handleOpenPreview = (doc: typeof documents[0]) => {
    setPreviewDoc({
      name: doc.name,
      type: doc.type,
      sellerName: getSellerName(doc.sellerId),
      orderId: doc.orderId,
    });
    setPreviewOpen(true);
  };

  const handleDownloadDoc = (doc: typeof documents[0], format: 'pdf' | 'word' | 'csv') => {
    const sellerName = getSellerName(doc.sellerId);
    const filename = `${doc.name.replace(/\s+/g, '_')}`;

    if (format === 'pdf') {
      downloadPDF({
        title: doc.name,
        documentType: doc.type,
        docNumber: doc.id,
        date: doc.uploadedAt,
        sellerName: sellerName,
        sellerBusiness: 'Verified DNK Exporter',
        orderId: doc.orderId || 'ORD-98231',
      }, filename);
      addToast({ message: `${doc.name} PDF generated`, type: 'success' });
    } else if (format === 'word') {
      downloadWord({
        title: doc.name,
        documentType: doc.type,
        docNumber: doc.id,
        date: doc.uploadedAt,
        sellerName: sellerName,
        sellerBusiness: 'Verified DNK Exporter',
        orderId: doc.orderId || 'ORD-98231',
      }, `${filename}.doc`);
      addToast({ message: `${doc.name} Word (.doc) downloaded`, type: 'success' });
    } else if (format === 'csv') {
      downloadCSV([{
        'Document ID': doc.id,
        'Document Title': doc.name,
        'Category': doc.type,
        'Seller': sellerName,
        'Status': doc.status,
        'Upload Date': doc.uploadedAt,
      }], `${filename}.csv`);
      addToast({ message: `${doc.name} CSV downloaded`, type: 'success' });
    }
  };

  const handleExportAllCSV = () => {
    const rows = filtered.map(d => ({
      'Doc ID': d.id,
      'Title': d.name,
      'Category': d.type,
      'Seller': getSellerName(d.sellerId),
      'Order Ref': d.orderId || 'N/A',
      'Status': d.status,
      'Upload Date': d.uploadedAt,
    }));
    downloadCSV(rows, 'operator_compliance_review.csv');
    addToast({ message: 'Compliance Review CSV downloaded!', type: 'success' });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Export Suite */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-primary)]">{t('nav.documents', language)}</h2>
          <p className="text-gray-500 text-sm">{t('operator.reviewDocs', language)}</p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkVerify}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify Selected ({selectedIds.size})</span>
            </button>
          )}

          <button
            onClick={handleExportAllCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Review CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by document title or seller business..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={filtered.filter((d) => d.status === 'UNDER_REVIEW').length > 0 && filtered.filter((d) => d.status === 'UNDER_REVIEW').every((d) => selectedIds.has(d.id))}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4">Document</th>
                <th className="p-4 hidden sm:table-cell">Seller</th>
                <th className="p-4 hidden md:table-cell">Order ID</th>
                <th className="p-4 hidden sm:table-cell">Upload Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification & Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400">
                    <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    No documents found matching this filter.
                  </td>
                </tr>
              )}
              {filtered.map((d) => {
                const st = STATUS_STYLES[d.status] ?? STATUS_STYLES.DRAFT;
                return (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
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
                      <FileText className="h-4 w-4 text-rose-600 shrink-0" />
                      <span className="truncate font-semibold">{d.name}</span>
                    </td>
                    <td className="p-4 text-gray-600 text-xs hidden sm:table-cell">{getSellerName(d.sellerId)}</td>
                    <td className="p-4 text-gray-600 text-xs font-mono hidden md:table-cell">{d.orderId ?? '—'}</td>
                    <td className="p-4 text-gray-600 text-xs font-mono hidden sm:table-cell">{formatDate(d.uploadedAt)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.color} border border-current/20`}>{st.label}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Preview */}
                        <button
                          onClick={() => handleOpenPreview(d)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                          title="Preview Document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* PDF */}
                        <button
                          onClick={() => handleDownloadDoc(d, 'pdf')}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition"
                          title="Download PDF"
                        >
                          PDF
                        </button>

                        {/* Word */}
                        <button
                          onClick={() => handleDownloadDoc(d, 'word')}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition"
                          title="Download Word (.doc)"
                        >
                          Word
                        </button>

                        {/* Verify Actions */}
                        {d.status === 'UNDER_REVIEW' && (
                          <div className="flex gap-1 pl-2 border-l border-gray-200">
                            <button
                              onClick={() => handleVerify(d.id)}
                              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleRequestCorrection(d.id)}
                              className="px-2 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <DocumentPreview
          documentName={previewDoc.name}
          documentType={previewDoc.type}
          sellerName={previewDoc.sellerName}
          orderId={previewDoc.orderId}
          onClose={() => setPreviewOpen(false)}
        />
      )}

    </div>
  );
}
