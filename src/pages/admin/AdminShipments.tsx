import { useState, useMemo } from 'react';
import {
  Truck, Clock, MapPin, AlertTriangle, ChevronDown, ChevronUp,
  CheckCircle, Package, Download,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { downloadCSV, generateShipmentReport } from '../../utils/exportReport';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  CREATED: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Created' },
  DNK_RECEIVED: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'DNK Received' },
  EXPORT_PROCESSING: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Export Processing' },
  CUSTOMS: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Customs' },
  DISPATCHED: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Dispatched' },
  IN_TRANSIT: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Transit' },
  DESTINATION_PROCESSING: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Destination Processing' },
  DELIVERED: { color: 'text-[var(--color-success)]', bg: 'bg-green-100', label: 'Delivered' },
  DELAYED: { color: 'text-[var(--color-brand-red)]', bg: 'bg-red-100', label: 'Delayed' },
};

const TABS = ['All', 'In Transit', 'Processing', 'Delayed', 'Delivered'] as const;
type Tab = (typeof TABS)[number];

const TAB_STATUS_MAP: Record<Tab, string[]> = {
  All: [],
  'In Transit': ['IN_TRANSIT', 'DISPATCHED', 'CUSTOMS', 'EXPORT_PROCESSING'],
  Processing: ['CREATED', 'DNK_RECEIVED'],
  Delayed: ['DELAYED'],
  Delivered: ['DELIVERED'],
};

const ALL_STATUSES = [
  'CREATED', 'DNK_RECEIVED', 'EXPORT_PROCESSING', 'CUSTOMS',
  'DISPATCHED', 'IN_TRANSIT', 'DESTINATION_PROCESSING', 'DELIVERED',
];

export default function AdminShipments() {
  const { shipments, orders, language, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab];
    if (statuses.length === 0) return shipments;
    return shipments.filter((sh) => statuses.includes(sh.currentStatus));
  }, [shipments, activeTab]);

  const getSellerForOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return undefined;
    return SELLERS.find((s) => s.id === order.sellerId);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.shipmentTracking', language)}</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-amber)] text-white">
          Demo Data
        </span>
        <button
          onClick={() => {
            downloadCSV(generateShipmentReport(filtered), 'shipments-report.csv');
            addToast({ type: 'success', message: 'Report downloaded successfully!' });
          }}
          className="ml-auto px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {shipments.some((sh) => sh.currentStatus === 'DELAYED') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-red)]">Delayed Shipment Alert</p>
            <p className="text-sm text-gray-600">
              {shipments.filter((sh) => sh.currentStatus === 'DELAYED').length} shipment(s) delayed across the platform.
            </p>
          </div>
        </div>
      )}

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
            <Truck className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No shipments found</p>
          </div>
        )}
        {filtered.map((sh) => {
          const cfg = STATUS_CONFIG[sh.currentStatus] ?? STATUS_CONFIG.CREATED;
          const isExpanded = expandedId === sh.id;
          const isDelayed = sh.currentStatus === 'DELAYED';
          const seller = getSellerForOrder(sh.orderId);
          return (
            <div
              key={sh.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                isDelayed ? 'border-red-300' : 'border-gray-100'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : sh.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{sh.trackingNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Order: {sh.orderId}</p>
                    {seller && <p className="text-xs text-gray-500">Seller: {seller.businessName}</p>}
                    <p className="text-xs text-gray-400 mt-1">Updated {timeAgo(sh.lastUpdated)}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Timeline</h4>
                  <div className="relative pl-6">
                    <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-200" />
                    {[...sh.events].reverse().map((ev, idx) => {
                      const evStatus = STATUS_CONFIG[ev.status] ?? STATUS_CONFIG.CREATED;
                      return (
                        <div key={idx} className="relative mb-4 last:mb-0">
                          <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${evStatus.bg} border-2 border-white flex items-center justify-center z-10`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${evStatus.color.replace('text-', 'bg-')}`} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-800">{evStatus.label}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span>{ev.location}</span>
                              <span>{formatDateTime(ev.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
              <th className="p-4 font-medium">Tracking #</th>
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Seller</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">No shipments found</td>
              </tr>
            )}
            {filtered.map((sh) => {
              const cfg = STATUS_CONFIG[sh.currentStatus] ?? STATUS_CONFIG.CREATED;
              const isDelayed = sh.currentStatus === 'DELAYED';
              const seller = getSellerForOrder(sh.orderId);
              const order = orders.find((o) => o.id === sh.orderId);
              return (
                <tr
                  key={sh.id}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${isDelayed ? 'bg-red-50' : ''}`}
                  onClick={() => setExpandedId(expandedId === sh.id ? null : sh.id)}
                >
                  <td className="p-4 font-semibold text-gray-900">{sh.trackingNumber}</td>
                  <td className="p-4 text-gray-600">{sh.orderId}</td>
                  <td className="p-4 text-gray-600">{seller?.businessName ?? '—'}</td>
                  <td className="p-4 text-gray-600">{order?.destination ?? '—'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{formatDate(sh.lastUpdated)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
