import {
  Users, Building2, Globe, ShoppingCart, Truck,
  CheckCircle, AlertTriangle, IndianRupee,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { ADMIN_ANALYTICS } from '../../data/mockData';

export default function AdminDashboard() {
  const language = useAppStore(s => s.language);

  const metrics = [
    { label: t('admin.totalSellers', language), value: ADMIN_ANALYTICS.totalSellers, icon: Users, color: 'text-[var(--color-primary)]', bg: 'bg-blue-50' },
    { label: t('admin.activeSellers', language), value: ADMIN_ANALYTICS.activeDNKs, icon: Building2, color: 'text-[var(--color-success)]', bg: 'bg-green-50' },
    { label: 'Active Exports', value: ADMIN_ANALYTICS.activeExports, icon: Globe, color: 'text-[var(--color-accent-amber)]', bg: 'bg-amber-50' },
    { label: t('admin.totalOrders', language), value: ADMIN_ANALYTICS.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('admin.totalShipments', language), value: ADMIN_ANALYTICS.totalShipments, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Delivered', value: ADMIN_ANALYTICS.deliveredShipments, icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-green-50' },
    { label: 'Delayed', value: ADMIN_ANALYTICS.delayedShipments, icon: AlertTriangle, color: 'text-[var(--color-brand-red)]', bg: 'bg-red-50' },
    { label: t('admin.totalRevenue', language), value: `₹${(ADMIN_ANALYTICS.totalExportValue / 100000).toFixed(1)}L`, icon: IndianRupee, color: 'text-[var(--color-accent-amber)]', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.dashboard', language)}</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-amber)] text-white">
          Demo Data
        </span>
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
    </div>
  );
}
