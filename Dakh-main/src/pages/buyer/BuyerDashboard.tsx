import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Truck, CheckCircle, Package, ArrowRight, MapPin, Eye,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { PRODUCTS, SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import ProductImage from '../../components/ProductImage';

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

export default function BuyerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { orders, language } = useAppStore();

  const buyerOrders = useMemo(
    () => orders.filter((o) => o.buyerId === user?.id),
    [orders, user?.id],
  );

  const totalOrders = buyerOrders.length;
  const inTransitCount = buyerOrders.filter(
    (o) => o.status === 'IN_TRANSIT' || o.status === 'SHIPPED',
  ).length;
  const deliveredCount = buyerOrders.filter((o) => o.status === 'DELIVERED').length;

  const recentOrders = useMemo(
    () =>
      [...buyerOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [buyerOrders],
  );

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const firstName = user?.name.split(' ')[0] ?? 'Buyer';

  const metrics = [
    {
      label: t('buyer.totalOrders', language),
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-[var(--color-primary)]',
      bg: 'bg-blue-50',
    },
    {
      label: t('buyer.pendingDelivery', language),
      value: inTransitCount,
      icon: Truck,
      color: 'text-[var(--color-accent-amber)]',
      bg: 'bg-amber-50',
    },
    {
      label: t('buyer.delivered', language),
      value: deliveredCount,
      icon: CheckCircle,
      color: 'text-[var(--color-success)]',
      bg: 'bg-green-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Welcome, {firstName}
        </h2>
        <p className="text-gray-500 flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {user?.location ?? 'Location not set'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${m.bg}`}>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{m.label}</p>
                <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[var(--color-primary)]">{t('buyer.recentOrders', language)}</h3>
          <Link
            to="/buyer/orders"
            className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1"
          >
            {t('buyer.viewAll', language)} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => {
              const product = getProduct(o.productId);
              return (
                <div
                  key={o.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[var(--color-primary)]">{o.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ProductImage category={product?.category} name={product?.name} size="sm" />
                      <p className="text-sm text-gray-600 truncate">
                        {product?.name ?? 'Unknown Product'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{o.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500">{o.destination}</p>
                    <p className="text-xs text-gray-400">Est. {formatDate(o.estimatedDelivery)}</p>
                    <Link
                      to={`/buyer/orders/${o.id}`}
                      className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      <Eye className="h-3 w-3" /> {t('buyer.trackOrder', language)}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/marketplace"
          className="flex items-center gap-3 p-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-medium">{t('buyer.browseMarketplace', language)}</span>
        </Link>
        <Link
          to="/buyer/orders"
          className="flex items-center gap-3 p-4 bg-[var(--color-soft-gray)] text-[var(--color-primary)] rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Truck className="h-5 w-5" />
          <span className="font-medium">{t('buyer.trackShipment', language)}</span>
        </Link>
      </div>
    </div>
  );
}
