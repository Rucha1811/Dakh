import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Package, Clock, MapPin, CalendarDays, Truck, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { PRODUCTS, SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import ProductImage from '../../components/ProductImage';

const TABS = ['All', 'Processing', 'Shipped', 'In Transit', 'Delivered'] as const;
type Tab = (typeof TABS)[number];

const TAB_TO_STATUS: Record<Tab, string | null> = {
  All: null,
  Processing: 'PROCESSING',
  Shipped: 'SHIPPED',
  'In Transit': 'IN_TRANSIT',
  Delivered: 'DELIVERED',
};

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function BuyerOrders() {
  const user = useAuthStore((s) => s.user);
  const { orders, language } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const buyerOrders = useMemo(
    () => orders.filter((o) => o.buyerId === user?.id),
    [orders, user?.id],
  );

  const filtered = useMemo(() => {
    const status = TAB_TO_STATUS[activeTab];
    if (!status) return buyerOrders;
    return buyerOrders.filter((o) => o.status === status);
  }, [buyerOrders, activeTab]);

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
  const getSeller = (id: string) => SELLERS.find((s) => s.id === id);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('buyer.myOrders', language)}</h2>
        <p className="text-gray-500">{t('buyer.ordersSubtitle', language)}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>{t('buyer.noOrdersYet', language)}</p>
          </div>
        )}
        {filtered.map((o) => {
          const product = getProduct(o.productId);
          const seller = getSeller(o.sellerId);
          const isExpanded = expandedId === o.id;
          return (
            <div key={o.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : o.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--color-primary)]">{o.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ProductImage category={product?.category} name={product?.name} size="sm" />
                      <p className="text-sm text-gray-700 truncate">{product?.name ?? 'Unknown Product'}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{o.amount.toLocaleString('en-IN')}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2 text-sm">
                  {seller && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="h-4 w-4" /> Seller: {seller.businessName}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" /> Destination: {o.destination}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" /> Qty: {o.quantity}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" /> Ordered: {formatDate(o.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="h-4 w-4" /> Est. Delivery: {formatDate(o.estimatedDelivery)}
                  </div>
                  {product && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Category: {product.category}</span>
                        <span>Weight: {product.weight}kg</span>
                      </div>
                    </div>
                  )}
                  <Link
                    to={`/buyer/orders/${o.id}`}
                    className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                      <Eye className="h-3.5 w-3.5" /> {t('buyer.trackOrder', language)}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">{t('common.product', language)}</th>
              <th className="p-4 font-medium">{t('common.seller', language)}</th>
              <th className="p-4 font-medium">{t('common.amount', language)}</th>
              <th className="p-4 font-medium">{t('common.destination', language)}</th>
              <th className="p-4 font-medium">{t('common.status', language)}</th>
              <th className="p-4 font-medium">{t('common.created', language)}</th>
              <th className="p-4 font-medium">{t('buyer.estimatedDelivery', language)}</th>
              <th className="p-4 font-medium">Track</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">{t('buyer.noOrdersYet', language)}</td>
              </tr>
            )}
            {filtered.map((o) => {
              const product = getProduct(o.productId);
              const seller = getSeller(o.sellerId);
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-primary)]">{o.id}</td>
                  <td className="p-4 text-gray-700 max-w-[180px] truncate">
                    <div className="flex items-center gap-2">
                      <ProductImage category={product?.category} name={product?.name} size="sm" />
                      <span className="truncate">{product?.name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{seller?.businessName ?? '—'}</td>
                  <td className="p-4 text-gray-900 font-medium">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{o.destination}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-gray-600">{formatDate(o.estimatedDelivery)}</td>
                  <td className="p-4">
                    <Link
                      to={`/buyer/orders/${o.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> {t('common.track', language)}
                    </Link>
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
