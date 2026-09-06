import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';

interface ScoreItem {
  label: string;
  points: number;
  maxPoints: number;
  complete: boolean;
  link: string;
  linkText: string;
}

import { getSellerForUser } from '../../utils/sellerHelper';

export default function ExportReadiness() {
  const user = useAuthStore((s) => s.user);
  const { products: allProducts, orders: allOrders, documents, shipments, language } = useAppStore();

  const seller = useMemo(() => getSellerForUser(user), [user]);
  const sellerId = seller.id;

  const sellerProducts = useMemo(
    () => allProducts.filter((p) => p.sellerId === sellerId),
    [allProducts, sellerId],
  );

  const sellerDocs = useMemo(
    () => documents.filter((d) => d.sellerId === sellerId),
    [documents, sellerId],
  );

  const sellerOrderIds = useMemo(
    () => allOrders.filter((o) => o.sellerId === sellerId).map((o) => o.id),
    [allOrders, sellerId],
  );

  const sellerShipments = useMemo(
    () => shipments.filter((sh) => sellerOrderIds.includes(sh.orderId)),
    [shipments, sellerOrderIds],
  );

  const scoreItems = useMemo<ScoreItem[]>(() => {
    const isProfileVerified =
      seller?.verificationStatus === 'VERIFIED' || seller?.verificationStatus === 'ACTIVE';

    const hasCompleteProduct = sellerProducts.some(
      (p) => p.name && p.description && p.category && p.price > 0 && p.weight > 0,
    );

    const hasDestination = sellerProducts.some(
      (p) => p.destinationCountry && p.destinationCountry.length > 0,
    );

    const docsVerified = sellerDocs.some((d) => d.status === 'VERIFIED');
    const docsInProgress = sellerDocs.some(
      (d) => d.status === 'UPLOADED' || d.status === 'UNDER_REVIEW' || d.status === 'DRAFT',
    );

    const hasPackaging = sellerProducts.some(
      (p) => p.packagingType && p.dimensions.length > 0,
    );

    const hasShipment = sellerShipments.length > 0;

    const isActive = seller?.verificationStatus === 'ACTIVE';

    return [
      {
        label: 'Seller Profile',
        points: isProfileVerified ? 20 : 0,
        maxPoints: 20,
        complete: isProfileVerified,
        link: '/seller/profile',
        linkText: 'Complete Profile',
      },
      {
        label: 'Product Information',
        points: hasCompleteProduct ? 20 : 0,
        maxPoints: 20,
        complete: hasCompleteProduct,
        link: '/seller/products/new',
        linkText: 'Add Product',
      },
      {
        label: 'Destination Selected',
        points: hasDestination ? 10 : 0,
        maxPoints: 10,
        complete: hasDestination,
        link: '/seller/products/new',
        linkText: 'Select Destination',
      },
      {
        label: 'Documentation',
        points: docsVerified ? 20 : docsInProgress ? 10 : 0,
        maxPoints: 20,
        complete: docsVerified && !docsInProgress,
        link: '/seller/documents',
        linkText: 'Upload Documents',
      },
      {
        label: 'Packaging Information',
        points: hasPackaging ? 10 : 0,
        maxPoints: 10,
        complete: hasPackaging,
        link: '/seller/products/new',
        linkText: 'Add Packaging',
      },
      {
        label: 'Shipping Option',
        points: hasShipment ? 10 : 0,
        maxPoints: 10,
        complete: hasShipment,
        link: '/seller/dnk',
        linkText: 'Book Shipment',
      },
      {
        label: 'Verification',
        points: isActive ? 10 : 0,
        maxPoints: 10,
        complete: isActive,
        link: '/seller/profile',
        linkText: 'Get Verified',
      },
    ];
  }, [seller, sellerProducts, sellerDocs, sellerShipments]);

  const totalScore = useMemo(
    () => scoreItems.reduce((sum, item) => sum + item.points, 0),
    [scoreItems],
  );

  const getScoreInfo = (score: number) => {
    if (score >= 90) return { label: 'Export Ready', color: 'text-[var(--color-success)]', border: 'border-[var(--color-success)]', bg: 'bg-green-50', ring: 'stroke-[var(--color-success)]' };
    if (score >= 75) return { label: 'Almost Ready', color: 'text-blue-600', border: 'border-blue-600', bg: 'bg-blue-50', ring: 'stroke-blue-600' };
    if (score >= 50) return { label: 'Partially Ready', color: 'text-[var(--color-accent-amber)]', border: 'border-[var(--color-accent-amber)]', bg: 'bg-amber-50', ring: 'stroke-[var(--color-accent-amber)]' };
    return { label: 'Needs Preparation', color: 'text-[var(--color-brand-red)]', border: 'border-[var(--color-brand-red)]', bg: 'bg-red-50', ring: 'stroke-[var(--color-brand-red)]' };
  };

  const scoreInfo = getScoreInfo(totalScore);
  const circumference = 2 * Math.PI * 64;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  const missingItems = scoreItems.filter((item) => !item.complete);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.readiness.title', language)}</h2>
        <p className="text-gray-500">{t('seller.readiness.subtitle', language)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <div className="relative w-44 h-44">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="64" fill="none" stroke="#EEF2F5" strokeWidth="10" />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                className={scoreInfo.ring}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreInfo.color}`}>{totalScore}</span>
              <span className="text-xs text-gray-400">/100</span>
              <span className={`text-sm font-medium mt-0.5 ${scoreInfo.color}`}>{scoreInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Score Breakdown</h3>
          {scoreItems.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {item.complete ? (
                    <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  {item.label}
                </span>
                <span className="text-sm font-medium text-gray-500">{item.points}/{item.maxPoints}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${item.complete ? 'bg-[var(--color-success)]' : 'bg-blue-500'}`}
                  style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {missingItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Missing Requirements</h3>
          <div className="space-y-3">
            {missingItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-lg bg-[var(--color-soft-gray)] border-l-4 border-[var(--color-brand-red)]"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-[var(--color-brand-red)] flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800">{item.label} — incomplete</span>
                </div>
                <Link
                  to={item.link}
                  className="text-xs bg-white text-[var(--color-brand-red)] font-semibold px-3 py-1.5 rounded border border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  {item.linkText} <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {missingItems.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle className="h-12 w-12 text-[var(--color-success)] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[var(--color-success)]">You're Export Ready!</h3>
          <p className="text-sm text-gray-600 mt-1">All requirements are met. You can start accepting international orders.</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-gray-800">Tips to Improve Your Score</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-[var(--color-accent-amber)] mt-0.5 flex-shrink-0" />
            Complete your seller profile and get verified by a DNK operator.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-[var(--color-accent-amber)] mt-0.5 flex-shrink-0" />
            Add complete product details including weight, dimensions, and images.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-[var(--color-accent-amber)] mt-0.5 flex-shrink-0" />
            Upload and verify all required export documents.
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="h-4 w-4 text-[var(--color-accent-amber)] mt-0.5 flex-shrink-0" />
            Book your first shipment through a DNK to unlock the shipping score.
          </li>
        </ul>
      </div>
    </div>
  );
}
