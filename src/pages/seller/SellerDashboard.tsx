import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, Truck, IndianRupee, ArrowRight,
  Bell, AlertTriangle, CheckCircle, Info, Plus, Search, MapPin,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS, PRODUCTS, ORDERS, SHIPMENTS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import ProductImage from '../../components/ProductImage';
import OnboardingFlow from '../../components/OnboardingFlow';

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 24000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 30000 },
];

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const { products: allProducts, orders: allOrders, shipments: allShipments, notifications, language } = useAppStore();

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const seller = useMemo(() => SELLERS.find((s) => s.userId === user?.id), [user?.id]);
  const sellerId = seller?.id ?? '';

  const sellerProducts = useMemo(
    () => allProducts.filter((p) => p.sellerId === sellerId),
    [allProducts, sellerId],
  );

  const sellerOrders = useMemo(
    () => allOrders.filter((o) => o.sellerId === sellerId),
    [allOrders, sellerId],
  );

  const sellerOrderIds = useMemo(() => new Set(sellerOrders.map((o) => o.id)), [sellerOrders]);

  const transitShipments = useMemo(
    () =>
      allShipments.filter(
        (sh) =>
          sellerOrderIds.has(sh.orderId) &&
          ['IN_TRANSIT', 'CUSTOMS', 'DISPATCHED', 'EXPORT_PROCESSING'].includes(sh.currentStatus),
      ),
    [allShipments, sellerOrderIds],
  );

  const estimatedRevenue = useMemo(
    () => sellerOrders.reduce((sum, o) => sum + o.amount, 0),
    [sellerOrders],
  );

  const userNotifications = useMemo(
    () =>
      notifications
        .filter((n) => n.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications, user?.id],
  );

  const recentNotifications = userNotifications.slice(0, 4);

  const pendingDocs = useMemo(() => {
    return sellerProducts.filter(
      (p) => p.exportStatus === 'NOT_STARTED',
    );
  }, [sellerProducts]);

  const nextStep = useMemo(() => {
    const draftOrders = sellerOrders.filter((o) => o.status === 'CONFIRMED');
    if (draftOrders.length > 0) {
      return {
        text: `You have ${draftOrders.length} confirmed order(s) waiting to be processed`,
        link: '/seller/orders',
      };
    }
    const notStartedProducts = sellerProducts.filter(
      (p) => p.exportStatus === 'NOT_STARTED',
    );
    if (notStartedProducts.length > 0) {
      return {
        text: `${notStartedProducts.length} product(s) haven't started the export process yet`,
        link: '/seller/readiness',
      };
    }
    if (pendingDocs.length > 0) {
      return {
        text: 'Complete documentation for products pending export',
        link: '/seller/documents',
      };
    }
    return {
      text: 'All caught up! Add a new product to expand your catalog.',
      link: '/seller/products/new',
    };
  }, [sellerOrders, sellerProducts, pendingDocs]);

  const firstName = user?.name.split(' ')[0] ?? 'Seller';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const metrics = [
    {
      label: t('seller.exportReadiness', language),
      value: `${seller?.exportReadiness ?? 0}%`,
      icon: CheckCircle,
      color: 'text-[var(--color-success)]',
      bg: 'bg-green-50',
    },
    {
      label: t('seller.activeOrders', language),
      value: sellerOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length,
      icon: ShoppingCart,
      color: 'text-[var(--color-primary)]',
      bg: 'bg-blue-50',
    },
    {
      label: t('seller.inTransit', language),
      value: transitShipments.length,
      icon: Truck,
      color: 'text-[var(--color-accent-amber)]',
      bg: 'bg-amber-50',
    },
    {
      label: t('seller.revenue', language),
      value: `₹${estimatedRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-[var(--color-brand-red)]',
      bg: 'bg-red-50',
    },
  ];

  const quickActions = [
    { label: t('seller.addProduct', language), icon: Plus, link: '/seller/products/new', color: 'bg-[var(--color-primary)]' },
    { label: t('seller.checkReadiness', language), icon: Search, link: '/seller/readiness', color: 'bg-[var(--color-success)]' },
    { label: t('seller.findDNK', language), icon: MapPin, link: '/seller/dnk', color: 'bg-[var(--color-accent-amber)]' },
    { label: t('seller.askAssistant', language), icon: Info, link: '/seller/assistant', color: 'bg-[var(--color-brand-red)]' },
  ];

  const notifIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-[var(--color-success)]" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-[var(--color-accent-amber)]" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-[var(--color-brand-red)]" />;
      default: return <Info className="h-5 w-5 text-[var(--color-primary)]" />;
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="animate-pulse bg-gray-200 h-4 w-24 rounded mb-3" />
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded" />
            </div>
          ))}
        </div>
        <div className="animate-pulse bg-gray-200 h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="animate-pulse bg-gray-200 h-5 w-32 rounded mb-4" />
            {[1,2,3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-12 w-full rounded mb-3" />
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="animate-pulse bg-gray-200 h-5 w-28 rounded mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OnboardingFlow />
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          {t('seller.greeting', language).replace('{name}', firstName)} 👋
        </h2>
        <p className="text-gray-500">{t('seller.nextStep', language)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#C62828" fill="#C62828" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-brand-red)] p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-red)] flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-[var(--color-primary)]">{t('seller.nextStep', language)}</h3>
              <p className="text-gray-600 text-sm mt-0.5">{nextStep.text}</p>
            </div>
          </div>
          <Link
            to={nextStep.link}
            className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm flex-shrink-0"
          >
            Complete Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--color-primary)]">{t('seller.recentOrders', language)}</h3>
            <Link to="/seller/notifications" className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1">
              {t('seller.viewAll', language)} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifications.length === 0 && (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
            {recentNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mt-0.5">{notifIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 truncate">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(n.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.link}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-soft-gray)] hover:bg-gray-200 transition-colors text-center"
              >
                <div className={`p-2.5 rounded-lg text-white ${a.color}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
