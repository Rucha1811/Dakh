import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, Clock, MapPin, CalendarDays, Search, Download } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import { downloadCSV, generateOrderReport } from '../../utils/exportReport';

const TABS = ['All', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  All: 'All',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const { orders, products: storeProducts, language, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const seller = useMemo(() => SELLERS.find((s) => s.userId === user?.id), [user?.id]);
  const sellerId = seller?.id ?? '';

  const sellerOrders = useMemo(
    () => orders.filter((o) => o.sellerId === sellerId),
    [orders, sellerId],
  );

  const filtered = useMemo(() => {
    let list = sellerOrders;
    if (activeTab !== 'All') {
      list = list.filter((o) => o.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => {
        const product = storeProducts.find((p) => p.id === o.productId);
        return (
          o.id.toLowerCase().includes(q) ||
          product?.name.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [sellerOrders, activeTab, search, storeProducts]);

  const getProduct = (id: string) => storeProducts.find((p) => p.id === id);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.orders.title', language)}</h2>
        <p className="text-gray-500">{t('seller.orders.subtitle', language)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search', language) + '...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          onClick={() => {
            downloadCSV(generateOrderReport(filtered), 'my-orders-report.csv');
            addToast({ type: 'success', message: 'Report downloaded successfully!' });
          }}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
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
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No orders found</p>
          </div>
        )}
        {filtered.map((o) => {
          const product = getProduct(o.productId);
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
                        {TAB_LABELS[o.status as Tab] ?? o.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 truncate">{product?.name ?? 'Unknown Product'}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{o.amount.toLocaleString('en-IN')}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" /> {o.destination}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" /> Qty: {o.quantity}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" /> Created: {formatDate(o.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="h-4 w-4" /> Est. Delivery: {formatDate(o.estimatedDelivery)}
                  </div>
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
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Est. Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">No orders found</td>
              </tr>
            )}
            {filtered.map((o) => {
              const product = getProduct(o.productId);
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-primary)]">{o.id}</td>
                  <td className="p-4 text-gray-700 max-w-[200px] truncate">{product?.name ?? 'Unknown'}</td>
                  <td className="p-4 text-gray-900 font-medium">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{o.destination}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {TAB_LABELS[o.status as Tab] ?? o.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-gray-600">{formatDate(o.estimatedDelivery)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
