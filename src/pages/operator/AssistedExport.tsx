import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, FileText, Truck, Send,
  MessageSquare,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS, USERS, PRODUCTS } from '../../data/mockData';
import type { Shipment } from '../../data/mockData';
import NotificationChannels from '../../components/NotificationChannels';

const STEPS = [
  'Registration',
  'Product',
  'Compliance',
  'Documents',
  'DNK Verification',
  'Shipment Booking',
  'Customs Processing',
  'International Transit',
];

const SHIPMENT_STATUS_FLOW = [
  'CREATED', 'DNK_RECEIVED', 'EXPORT_PROCESSING', 'CUSTOMS',
  'DISPATCHED', 'IN_TRANSIT', 'DESTINATION_PROCESSING', 'DELIVERED',
] as const;

export default function AssistedExport() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { documents, shipments, orders, updateDocumentStatus, addShipment, addToast, language } = useAppStore();

  const seller = useMemo(() => SELLERS.find((s) => s.id === sellerId), [sellerId]);
  const sellerUser = useMemo(() => USERS.find((u) => u.id === seller?.userId), [seller?.userId]);

  const sellerDocs = useMemo(() => documents.filter((d) => d.sellerId === sellerId), [documents, sellerId]);
  const sellerOrders = useMemo(() => orders.filter((o) => o.sellerId === sellerId), [orders, sellerId]);
  const activeOrder = useMemo(
    () => sellerOrders.find((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'),
    [sellerOrders],
  );
  const product = useMemo(
    () => activeOrder ? PRODUCTS.find((p) => p.id === activeOrder.productId) : undefined,
    [activeOrder],
  );

  const hasVerifiedDocs = useMemo(() => sellerDocs.some((d) => d.status === 'VERIFIED'), [sellerDocs]);
  const hasCorrection = useMemo(() => sellerDocs.some((d) => d.status === 'CORRECTION_REQUIRED'), [sellerDocs]);
  const hasShipment = useMemo(
    () => sellerOrders.some((o) => shipments.some((s) => s.orderId === o.id)),
    [sellerOrders, shipments],
  );

  const completedSteps = useMemo(() => {
    const steps: number[] = [];
    if (seller?.verificationStatus === 'ACTIVE' || seller?.verificationStatus === 'VERIFIED') steps.push(1);
    if (product) steps.push(2);
    if (seller && seller.exportReadiness >= 70) steps.push(3);
    if (hasVerifiedDocs) steps.push(4);
    if (seller?.verificationStatus === 'ACTIVE' || seller?.verificationStatus === 'VERIFIED') steps.push(5);
    if (hasShipment) steps.push(6);
    const sellerShipment = shipments.find((sh) => sellerOrders.some((o) => o.id === sh.orderId));
    if (sellerShipment) {
      const idx = SHIPMENT_STATUS_FLOW.indexOf(sellerShipment.currentStatus as typeof SHIPMENT_STATUS_FLOW[number]);
      if (idx >= 3) steps.push(7);
      if (idx >= 5) steps.push(8);
    }
    return steps;
  }, [seller, product, hasVerifiedDocs, hasShipment, shipments, sellerOrders]);

  const [notes, setNotes] = useState('');

  const handleVerifyDocument = (docId: string) => {
    updateDocumentStatus(docId, 'VERIFIED');
    addToast({ message: 'Document verified successfully', type: 'success' });
  };

  const handleRequestInfo = (docId: string) => {
    updateDocumentStatus(docId, 'CORRECTION_REQUIRED');
    addToast({ message: 'Correction requested for document', type: 'info' });
  };

  const handleCreateShipment = () => {
    if (!activeOrder || !seller || !product) return;
    if (!hasVerifiedDocs) {
      addToast({ message: 'Cannot create shipment: documents not verified', type: 'error' });
      return;
    }
    const countryCode = activeOrder.destination.substring(0, 2).toUpperCase();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = `DNK-${countryCode}-2026-${randomDigits}`;
    const now = new Date().toISOString();
    const newShipment: Shipment = {
      id: `SHP${Date.now()}`,
      orderId: activeOrder.id,
      trackingNumber,
      dnkId: 'DNK001',
      currentStatus: 'CREATED',
      estimatedDelivery: activeOrder.estimatedDelivery,
      createdAt: now.split('T')[0],
      lastUpdated: now,
      events: [
        { status: 'CREATED', timestamp: now, location: seller.district, description: 'Shipment created by operator' },
      ],
    };
    addShipment(newShipment);
    addToast({ message: `Shipment created: ${trackingNumber}`, type: 'success' });
  };

  if (!seller || !sellerUser) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--color-primary)]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          <p>Seller not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--color-primary)]">
        <ArrowLeft className="h-4 w-4" /> Back to Queue
      </button>

      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{seller.businessName}</h2>
        <p className="text-gray-500">Assisted Export Detail</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">{t('operator.sellerProfile', language)}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium text-gray-900">{sellerUser.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Business</span><span className="font-medium text-gray-900">{seller.businessName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium text-gray-900">{seller.district}, {seller.state}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Mobile</span><span className="font-medium text-gray-900">{sellerUser.phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Seller ID</span><span className="font-medium text-gray-900">{seller.id}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Verification</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                seller.verificationStatus === 'ACTIVE' || seller.verificationStatus === 'VERIFIED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {seller.verificationStatus}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <NotificationChannels
                recipientName={sellerUser.name}
                recipientPhone={sellerUser.phone}
                messageType="order_update"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">{t('operator.currentExport', language)}</h3>
          {activeOrder && product ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-medium text-gray-900">{product.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Destination</span><span className="font-medium text-gray-900">{activeOrder.destination}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Value</span><span className="font-medium text-gray-900">₹{activeOrder.amount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Weight</span><span className="font-medium text-gray-900">{product.weight} kg</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-medium text-gray-900">{activeOrder.id}</span></div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No active export order</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">{t('operator.exportProgress', language)}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const completed = completedSteps.includes(stepNum);
            return (
              <div key={step} className={`p-3 rounded-lg border text-sm text-center ${
                completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                  completed ? 'bg-[var(--color-success)] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {completed ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                <span className={`text-xs ${completed ? 'text-[var(--color-success)] font-medium' : 'text-gray-500'}`}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">{t('nav.documents', language)}</h3>
        <div className="space-y-2">
          {sellerDocs.filter((d) => ['UNDER_REVIEW', 'VERIFIED', 'CORRECTION_REQUIRED'].includes(d.status)).map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-900 truncate">{d.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  d.status === 'VERIFIED' ? 'bg-green-100 text-green-700'
                    : d.status === 'CORRECTION_REQUIRED' ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>{d.status.replace('_', ' ')}</span>
              </div>
              {d.status === 'UNDER_REVIEW' && (
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button onClick={() => handleVerifyDocument(d.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors">{t('common.verify', language)}</button>
                  <button onClick={() => handleRequestInfo(d.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-accent-amber)] text-white rounded-lg hover:bg-amber-600 transition-colors">{t('operator.requestInfo', language)}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-3">
          <MessageSquare className="inline h-4 w-4 mr-1" /> {t('operator.operatorNotes', language)}
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          rows={4}
          placeholder="Add notes about this seller..."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {!hasVerifiedDocs && sellerDocs.some((d) => d.status === 'UNDER_REVIEW') && (
          <button onClick={() => sellerDocs.filter((d) => d.status === 'UNDER_REVIEW').forEach((d) => handleVerifyDocument(d.id))} className="px-4 py-2 bg-[var(--color-success)] text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> {t('operator.verifyDocs', language)}
          </button>
        )}
        {hasCorrection && (
          <button onClick={() => addToast({ message: 'Info request sent to seller', type: 'info' })} className="px-4 py-2 bg-[var(--color-accent-amber)] text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2">
            <Send className="h-4 w-4" /> {t('operator.requestInfo', language)}
          </button>
        )}
        <button onClick={() => addToast({ message: 'Seller marked complete', type: 'success' })} className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {t('operator.markComplete', language)}
        </button>
        <button
          onClick={handleCreateShipment}
          disabled={!hasVerifiedDocs || !activeOrder}
          className="px-4 py-2 bg-[var(--color-brand-red)] text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Truck className="h-4 w-4" /> {t('operator.createShipment', language)}
        </button>
      </div>
    </div>
  );
}
