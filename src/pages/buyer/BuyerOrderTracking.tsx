import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package, Clock, MapPin, AlertTriangle,
  CheckCircle, ArrowLeft, Info,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { PRODUCTS, SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import ProductImage from '../../components/ProductImage';

const getStatusLabels = (language: string): Record<string, string> => ({
  CREATED: t('status.created', language),
  DNK_RECEIVED: t('status.dnkReceived', language),
  EXPORT_PROCESSING: t('status.exportProcessing', language),
  CUSTOMS: t('status.customs', language),
  DISPATCHED: t('status.dispatched', language),
  IN_TRANSIT: t('status.inTransit', language),
  DESTINATION_PROCESSING: t('status.destinationProcessing', language),
  DELIVERED: t('status.delivered', language),
  DELAYED: t('status.delayed', language),
});

const STATUS_COLORS: Record<string, string> = {
  CREATED: 'bg-gray-100 text-gray-600',
  DNK_RECEIVED: 'bg-blue-100 text-blue-700',
  EXPORT_PROCESSING: 'bg-indigo-100 text-indigo-700',
  CUSTOMS: 'bg-amber-100 text-amber-700',
  DISPATCHED: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  DESTINATION_PROCESSING: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  DELAYED: 'bg-red-100 text-red-700',
};

const ALL_STATUSES = [
  'CREATED', 'DNK_RECEIVED', 'EXPORT_PROCESSING', 'CUSTOMS',
  'DISPATCHED', 'IN_TRANSIT', 'DESTINATION_PROCESSING', 'DELIVERED',
];

export default function BuyerOrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { shipments, orders, language } = useAppStore();

  const shipment = useMemo(
    () => shipments.find((sh) => sh.orderId === orderId),
    [shipments, orderId],
  );

  const statusLabels = useMemo(() => getStatusLabels(language), [language]);

  const order = useMemo(
    () => orders.find((o) => o.id === orderId),
    [orders, orderId],
  );

  const product = useMemo(
    () => (order ? PRODUCTS.find((p) => p.id === order.productId) : undefined),
    [order],
  );

  const seller = useMemo(
    () => (order ? SELLERS.find((s) => s.id === order.sellerId) : undefined),
    [order],
  );

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (!shipment) {
    return (
      <div className="space-y-6">
        <Link
          to="/buyer/orders"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {t('common.back', language)}
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package className="h-14 w-14 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('buyer.orderNotFound', language)}</h3>
          <p className="text-gray-500 text-sm">
            The shipment for order <span className="font-medium">{orderId}</span> has not been created yet.
            Please check back later.
          </p>
        </div>
        {order && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">Order Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">₹{order.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{order.destination}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estimated Delivery</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(order.estimatedDelivery)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            {product && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Product</p>
                <div className="flex items-center gap-3">
                  <ProductImage category={product.category} name={product.name} size="md" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    {seller && <p className="text-xs text-gray-500 mt-1">Seller: {seller.businessName}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const currentIdx = ALL_STATUSES.indexOf(shipment.currentStatus);
  const isDelayed = shipment.currentStatus === 'DELAYED';

  return (
    <div className="space-y-6">
      <Link
        to="/buyer/orders"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> {t('common.back', language)}
      </Link>

      {isDelayed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-red)]">Shipment Delayed</p>
            <p className="text-sm text-gray-600">
              Your shipment has been delayed. Consider contacting the seller or DNK for an update.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('buyer.trackingNumber', language)}</p>
            <p className="text-xl font-bold text-[var(--color-primary)] mt-1">{shipment.trackingNumber}</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[shipment.currentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
            {statusLabels[shipment.currentStatus] ?? shipment.currentStatus}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Order</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{shipment.orderId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t('buyer.estimatedDelivery', language)}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(shipment.estimatedDelivery)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">{t('buyer.lastUpdated', language)}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(shipment.lastUpdated)}</p>
          </div>
        </div>

        {product && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Product</p>
            <div className="flex items-center gap-3">
              <ProductImage category={product.category} name={product.name} size="md" />
              <div>
                <p className="text-sm font-medium text-gray-800">{product.name}</p>
                {seller && <p className="text-xs text-gray-500 mt-1">Seller: {seller.businessName}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-6">{t('buyer.trackingTimeline', language)}</h3>
        <div className="relative pl-8">
          <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gray-200" />

          {shipment.events.map((ev, idx) => {
            const isLast = idx === shipment.events.length - 1;
            const isCompleted = ALL_STATUSES.indexOf(ev.status) < currentIdx || ev.status === shipment.currentStatus;
            const isCurrent = isLast && ev.status === shipment.currentStatus;

            return (
              <div key={idx} className="relative mb-6 last:mb-0">
                <div
                  className={`absolute -left-8 top-1 w-7 h-7 rounded-full flex items-center justify-center z-10 border-2 border-white ${
                    isCurrent
                      ? 'bg-[var(--color-brand-red)]'
                      : isCompleted
                        ? 'bg-[var(--color-success)]'
                        : 'bg-gray-200'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent
                          ? 'text-[var(--color-brand-red)]'
                          : isCompleted
                            ? 'text-gray-800'
                            : 'text-gray-400'
                      }`}
                    >
                      {statusLabels[ev.status] ?? ev.status}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-red)] text-white">
                        {t('status.current', language)}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-0.5 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                    {ev.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {ev.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDateTime(ev.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--color-soft-gray)] rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500">
          Tracking data is simulated for prototype demonstration.
        </p>
      </div>
    </div>
  );
}
