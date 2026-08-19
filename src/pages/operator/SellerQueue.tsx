import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Filter, ArrowRight, Clock, AlertTriangle, CheckCircle, FileText,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS, USERS, DOCUMENTS } from '../../data/mockData';

type QueueFilter = 'All' | 'Pending Review' | 'Action Required' | 'Ready';

const FILTERS: QueueFilter[] = ['All', 'Pending Review', 'Action Required', 'Ready'];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_VERIFICATION: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100' },
  VERIFIED: { label: 'Ready', color: 'text-[var(--color-success)]', bg: 'bg-green-100' },
  ACTIVE: { label: 'Active', color: 'text-[var(--color-success)]', bg: 'bg-green-100' },
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
};

function getRequestTypes(sellerId: string, docs: typeof DOCUMENTS) {
  const sellerDocs = docs.filter((d) => d.sellerId === sellerId);
  const types: string[] = [];

  const hasVerifiedSellerDocs = sellerDocs.some(
    (d) => d.type === 'Seller Document' && d.status === 'VERIFIED',
  );
  if (!hasVerifiedSellerDocs) types.push('New Export');

  const hasUnderReview = sellerDocs.some((d) => d.status === 'UNDER_REVIEW');
  if (hasUnderReview) types.push('Document Verification');

  const hasCorrection = sellerDocs.some((d) => d.status === 'CORRECTION_REQUIRED');
  if (hasCorrection) types.push('Action Required');

  if (types.length === 0) types.push('Shipment Booking');
  return types;
}

function getPriority(sellerId: string, docs: typeof DOCUMENTS): 'High' | 'Medium' | 'Low' {
  const sellerDocs = docs.filter((d) => d.sellerId === sellerId);
  if (sellerDocs.some((d) => d.status === 'CORRECTION_REQUIRED')) return 'High';
  if (sellerDocs.some((d) => d.status === 'UNDER_REVIEW')) return 'Medium';
  return 'Low';
}

function matchesFilter(sellerId: string, filter: QueueFilter, docs: typeof DOCUMENTS): boolean {
  if (filter === 'All') return true;
  const seller = SELLERS.find((s) => s.id === sellerId);
  if (!seller) return false;

  if (filter === 'Pending Review') {
    return seller.verificationStatus === 'PENDING_VERIFICATION' ||
      docs.some((d) => d.sellerId === sellerId && d.status === 'UNDER_REVIEW');
  }
  if (filter === 'Action Required') {
    return docs.some((d) => d.sellerId === sellerId && d.status === 'CORRECTION_REQUIRED') ||
      seller.verificationStatus === 'DRAFT';
  }
  if (filter === 'Ready') {
    return seller.verificationStatus === 'VERIFIED' || seller.verificationStatus === 'ACTIVE';
  }
  return true;
}

export default function SellerQueue() {
  const { documents, language } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<QueueFilter>('All');

  const docs = documents.length ? documents : DOCUMENTS;

  const queueItems = useMemo(() => {
    const sellerIds = [...new Set(docs.map((d) => d.sellerId))];
    return sellerIds
      .map((sid) => {
        const seller = SELLERS.find((s) => s.id === sid);
        const user = USERS.find((u) => u.id === seller?.userId);
        return { sellerId: sid, seller, user, requestTypes: getRequestTypes(sid, docs), priority: getPriority(sid, docs) };
      })
      .filter((item) => matchesFilter(item.sellerId, activeFilter, docs))
      .sort((a, b) => {
        const pOrder = { High: 0, Medium: 1, Low: 2 };
        return pOrder[a.priority] - pOrder[b.priority];
      });
  }, [docs, activeFilter]);

  const priorityBadge = (p: string) => {
    if (p === 'High') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">High</span>;
    if (p === 'Medium') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Medium</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Low</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('operator.sellerQueue', language)}</h2>
        <p className="text-gray-500">{t('operator.manageQueue', language)}</p>
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
            {f === 'All' ? t('common.all', language) : f === 'Pending Review' ? t('operator.pendingReview', language) : f === 'Action Required' ? t('operator.actionRequired', language) : t('operator.ready', language)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {queueItems.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>{t('operator.noSellers', language)}</p>
          </div>
        )}
        {queueItems.map((item) => {
          const status = STATUS_MAP[item.seller?.verificationStatus ?? 'DRAFT'] ?? STATUS_MAP.DRAFT;
          return (
            <Link
              key={item.sellerId}
              to={`/operator/assisted/${item.sellerId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.seller?.businessName ?? 'Unknown Seller'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    {priorityBadge(item.priority)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.seller?.district}, {item.seller?.state} — {item.seller?.businessType}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.requestTypes.map((rt) => (
                      <span key={rt} className="px-2 py-0.5 rounded bg-[var(--color-soft-gray)] text-xs text-gray-600">
                        {rt}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
