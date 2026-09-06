import { useState, useMemo } from 'react';
import { Package, Search, Download } from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { PRODUCTS, SELLERS, USERS } from '../../data/mockData';
import ProductImage from '../../components/ProductImage';
import { downloadCSV } from '../../utils/exportReport';
import { downloadPDF, downloadWord } from '../../utils/documentExporter';

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

export default function AdminOrders() {
  const { orders, language, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = orders;
    if (activeTab !== 'All') list = list.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.destination.toLowerCase().includes(q),
      );
    }
    return list;
  }, [orders, activeTab, search]);

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
  const getSeller = (id: string) => SELLERS.find((s) => s.id === id);
  const getBuyer = (id: string) => USERS.find((u) => u.id === id);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.orderManagement', language)}</h2>
        <p className="text-gray-500">{t('admin.viewTrackOrders', language)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              const items = filtered.map(o => ({
                name: `Order ${o.id} - ${o.destination}`,
                quantity: o.quantity || 1,
                unitPrice: o.amount || 0,
                total: o.amount || 0,
                hsCode: '6913.90',
                weight: 1.2
              }));
              downloadPDF({
                title: 'National Export Orders Consolidated Report',
                documentType: 'Official Postal Analytics',
                docNumber: `ORD-REP-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString('en-IN'),
                sellerName: 'Postal Admin Console',
                sellerBusiness: 'Department of Posts',
                buyerName: 'National Consignment Registry',
                totalAmount: filtered.reduce((s, o) => s + (o.amount || 0), 0),
                items: items.slice(0, 15),
              }, 'orders_report');
              addToast({ type: 'success', message: 'PDF Report generated!' });
            }}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download Printable PDF"
          >
            <Download className="h-3.5 w-3.5" /> PDF
          </button>

          <button
            onClick={() => {
              const items = filtered.map(o => ({
                name: `Order ${o.id} - ${o.destination}`,
                quantity: o.quantity || 1,
                unitPrice: o.amount || 0,
                total: o.amount || 0,
                hsCode: '6913.90',
                weight: 1.2
              }));
              downloadWord({
                title: 'National Export Orders Consolidated Report',
                documentType: 'Official Postal Analytics',
                docNumber: `ORD-REP-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString('en-IN'),
                sellerName: 'Postal Admin Console',
                sellerBusiness: 'Department of Posts',
                buyerName: 'National Consignment Registry',
                totalAmount: filtered.reduce((s, o) => s + (o.amount || 0), 0),
                items: items,
              }, 'orders_report.doc');
              addToast({ type: 'success', message: 'Word (.doc) downloaded successfully!' });
            }}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download Microsoft Word Document"
          >
            <Download className="h-3.5 w-3.5" /> Word (.doc)
          </button>

          <button
            onClick={() => {
              const csvRows = filtered.map(o => ({
                'Order ID': o.id,
                'Status': o.status,
                'Amount (INR)': o.amount,
                'Destination': o.destination,
                'Quantity': o.quantity,
                'Date': o.createdAt,
              }));
              downloadCSV(csvRows, 'orders_report.csv');
              addToast({ type: 'success', message: 'CSV Report downloaded successfully!' });
            }}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download CSV Spreadsheet"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
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
          const seller = getSeller(o.sellerId);
          const buyer = getBuyer(o.buyerId);
          return (
            <div key={o.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[var(--color-primary)]">{o.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {TAB_LABELS[o.status as Tab] ?? o.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <ProductImage category={product?.category} name={product?.name} size="sm" />
                    <p className="text-sm text-gray-700">{product?.name ?? 'Unknown Product'}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyer: {buyer?.name ?? '—'} &middot; Seller: {seller?.businessName ?? '—'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>₹{o.amount.toLocaleString('en-IN')}</span>
                    <span>{o.destination}</span>
                    <span>{formatDate(o.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Buyer</th>
              <th className="p-4 font-medium">Seller</th>
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">No orders found</td>
              </tr>
            )}
            {filtered.map((o) => {
              const product = getProduct(o.productId);
              const seller = getSeller(o.sellerId);
              const buyer = getBuyer(o.buyerId);
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-primary)]">{o.id}</td>
                  <td className="p-4 text-gray-600">{buyer?.name ?? '—'}</td>
                  <td className="p-4 text-gray-600">{seller?.businessName ?? '—'}</td>
                  <td className="p-4 text-gray-700 max-w-[180px] truncate">
                    <div className="flex items-center gap-2">
                      <ProductImage category={product?.category} name={product?.name} size="sm" />
                      <span className="truncate">{product?.name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900 font-medium">₹{o.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{o.destination}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {TAB_LABELS[o.status as Tab] ?? o.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(o.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
