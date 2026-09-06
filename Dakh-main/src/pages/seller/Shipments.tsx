import { useState, useMemo } from 'react';
import {
  Package, Truck, Clock, MapPin, AlertTriangle,
  ChevronDown, ChevronUp, CheckCircle, Box, Search,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';

const STATUS_CONFIG: Record<string, { icon: typeof Package; color: string; bg: string; label: string }> = {
  CREATED: { icon: Box, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Created' },
  DNK_RECEIVED: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'DNK Received' },
  EXPORT_PROCESSING: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Export Processing' },
  CUSTOMS: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Customs' },
  DISPATCHED: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Dispatched' },
  IN_TRANSIT: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Transit' },
  DESTINATION_PROCESSING: { icon: MapPin, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Destination Processing' },
  DELIVERED: { icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-green-100', label: 'Delivered' },
  DELAYED: { icon: AlertTriangle, color: 'text-[var(--color-brand-red)]', bg: 'bg-red-100', label: 'Delayed' },
};

import { getSellerForUser } from '../../utils/sellerHelper';

export default function Shipments() {
  const user = useAuthStore((s) => s.user);
  const { shipments, orders, language } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const seller = useMemo(() => getSellerForUser(user), [user]);
  const sellerId = seller.id;

  const sellerOrderIds = useMemo(
    () => orders.filter((o) => o.sellerId === sellerId).map((o) => o.id),
    [orders, sellerId],
  );

  const sellerShipments = useMemo(
    () => shipments.filter((sh) => sellerOrderIds.includes(sh.orderId)),
    [shipments, sellerOrderIds],
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sellerShipments;
    const q = search.toLowerCase();
    return sellerShipments.filter(
      (s) =>
        s.trackingNumber.toLowerCase().includes(q) ||
        s.orderId.toLowerCase().includes(q),
    );
  }, [sellerShipments, search]);

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
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.shipments.title', language)}</h2>
        <p className="text-gray-500">{t('seller.shipments.subtitle', language)}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={t('common.search', language) + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {sellerShipments.some((sh) => sh.currentStatus === 'DELAYED') && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-[var(--color-brand-red)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-brand-red)]">Delayed Shipment Alert</p>
            <p className="text-sm text-gray-600">One or more of your shipments have been delayed. Check details below.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Truck className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>{t('common.noData', language)}</p>
          </div>
        )}
        {filtered.map((sh) => {
          const cfg = STATUS_CONFIG[sh.currentStatus] ?? STATUS_CONFIG.CREATED;
          const isExpanded = expandedId === sh.id;
          const isDelayed = sh.currentStatus === 'DELAYED';
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
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0`}>
                    <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{sh.trackingNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Order: {sh.orderId}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {sh.events[sh.events.length - 1]?.location ?? '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Est. {formatDate(sh.estimatedDelivery)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        Updated {timeAgo(sh.lastUpdated)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">{t('seller.shipments.timeline', language)}</h4>
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
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{evCfg.label}</span>
                            </div>
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
