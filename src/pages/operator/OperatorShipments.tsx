import { useState, useMemo } from 'react';
import {
  Truck, Clock, MapPin, AlertTriangle,
  ChevronDown, ChevronUp, ArrowRight, Search,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';

type ShipmentFilter = 'All' | 'CREATED' | 'PROCESSING' | 'IN_TRANSIT' | 'DELAYED' | 'DELIVERED';

const FILTERS: ShipmentFilter[] = ['All', 'CREATED', 'PROCESSING', 'IN_TRANSIT', 'DELAYED', 'DELIVERED'];

const FILTER_LABELS: Record<ShipmentFilter, string> = {
  All: 'All',
  CREATED: 'Created',
  PROCESSING: 'Processing',
  IN_TRANSIT: 'In Transit',
  DELAYED: 'Delayed',
  DELIVERED: 'Delivered',
};

const FILTER_TO_STATUSES: Record<ShipmentFilter, string[]> = {
  All: [],
  CREATED: ['CREATED', 'DNK_RECEIVED'],
  PROCESSING: ['EXPORT_PROCESSING', 'CUSTOMS'],
  IN_TRANSIT: ['IN_TRANSIT', 'DISPATCHED', 'DESTINATION_PROCESSING'],
  DELAYED: ['DELAYED'],
  DELIVERED: ['DELIVERED'],
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  CREATED: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Created' },
  DNK_RECEIVED: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'DNK Received' },
  EXPORT_PROCESSING: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Export Processing' },
  CUSTOMS: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Customs' },
  DISPATCHED: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Dispatched' },
  IN_TRANSIT: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Transit' },
  DESTINATION_PROCESSING: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Destination Processing' },
  DELIVERED: { color: 'text-[var(--color-success)]', bg: 'bg-green-100', label: 'Delivered' },
  DELAYED: { color: 'text-[var(--color-brand-red)]', bg: 'bg-red-100', label: 'Delayed' },
};

const STATUS_FLOW = ['CREATED', 'DNK_RECEIVED', 'EXPORT_PROCESSING', 'CUSTOMS', 'DISPATCHED', 'IN_TRANSIT', 'DESTINATION_PROCESSING', 'DELIVERED'] as const;

function nextStatus(current: string): string | null {
  const idx = STATUS_FLOW.indexOf(current as typeof STATUS_FLOW[number]);
  if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

export default function OperatorShipments() {
  const { shipments, orders, updateShipmentStatus, addToast, language } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<ShipmentFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = shipments;
    if (activeFilter !== 'All') {
      const allowed = FILTER_TO_STATUSES[activeFilter];
      list = list.filter((s) => allowed.includes(s.currentStatus));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.orderId.toLowerCase().includes(q),
      );
    }
    return list;
  }, [shipments, activeFilter, search]);

  const getSellerName = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const seller = SELLERS.find((s) => s.id === order?.sellerId);
    return seller?.businessName ?? 'Unknown';
  };

  const getDestination = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    return order?.destination ?? '—';
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleAdvance = (shipmentId: string, currentStatus: string) => {
    const next = nextStatus(currentStatus);
    if (!next) return;
    const now = new Date().toISOString();
    updateShipmentStatus(shipmentId, {
      status: next,
      timestamp: now,
      location: 'Ahmedabad Head Post Office DNK',
      description: `Status updated to ${STATUS_CONFIG[next]?.label ?? next}`,
    }, next as typeof STATUS_FLOW[number]);
    addToast({ message: `Shipment advanced to ${STATUS_CONFIG[next]?.label}`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('nav.shipments', language)}</h2>
        <p className="text-gray-500">{t('operator.processShipments', language)}</p>
      </div>

      {shipments.some((s) => s.currentStatus === 'DELAYED') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-red)]">Delayed Shipments Alert</p>
            <p className="text-sm text-gray-600">{shipments.filter((s) => s.currentStatus === 'DELAYED').length} shipment(s) require attention.</p>
          </div>
        </div>
      )}

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
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
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
          const next = nextStatus(sh.currentStatus);
          return (
            <div key={sh.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isDelayed ? 'border-red-300' : 'border-gray-100'}`}>
              <button onClick={() => setExpandedId(isExpanded ? null : sh.id)} className="w-full p-4 text-left">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0`}>
                    <Truck className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{sh.trackingNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      {isDelayed && <AlertTriangle className="h-4 w-4 text-[var(--color-brand-red)]" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Order: {sh.orderId} — {getSellerName(sh.orderId)}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {getDestination(sh.orderId)}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Est. {formatDate(sh.estimatedDelivery)}</span>
                      <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Updated {timeAgo(sh.lastUpdated)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {next && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAdvance(sh.id, sh.currentStatus); }}
                        className="px-3 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
                      >
                        Advance <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Tracking Timeline</h4>
                  <div className="relative pl-6">
                    <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-gray-200" />
                    {[...sh.events].reverse().map((ev, idx) => {
                      const evCfg = STATUS_CONFIG[ev.status] ?? STATUS_CONFIG.CREATED;
                      return (
                        <div key={idx} className="relative mb-4 last:mb-0">
                          <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${evCfg.bg} border-2 border-white flex items-center justify-center z-10`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${evCfg.color.replace('text-', 'bg-')}`} />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-800">{evCfg.label}</span>
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
    </div>
  );
}
