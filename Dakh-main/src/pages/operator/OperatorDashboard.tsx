import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, ClipboardCheck, Truck, FileText, AlertTriangle, CheckCircle,
  ArrowRight, Bell, Info, UserCheck, Package,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';
import { DOCUMENTS, SHIPMENTS, SELLERS, USERS } from '../../data/mockData';
import NotificationChannels from '../../components/NotificationChannels';

const activityData = [
  { day: 'Mon', exports: 12, shipments: 8 },
  { day: 'Tue', exports: 15, shipments: 11 },
  { day: 'Wed', exports: 9, shipments: 7 },
  { day: 'Thu', exports: 18, shipments: 14 },
  { day: 'Fri', exports: 22, shipments: 16 },
  { day: 'Sat', exports: 10, shipments: 6 },
];

export default function OperatorDashboard() {
  const user = useAuthStore((s) => s.user);
  const { notifications, documents, shipments, language } = useAppStore();

  const docs = documents.length ? documents : DOCUMENTS;
  const shps = shipments.length ? shipments : SHIPMENTS;

  const underReviewCount = useMemo(
    () => docs.filter((d) => d.status === 'UNDER_REVIEW').length,
    [docs],
  );

  const delayedCount = useMemo(
    () => shps.filter((s) => s.currentStatus === 'DELAYED').length,
    [shps],
  );

  const deliveredCount = useMemo(
    () => shps.filter((s) => s.currentStatus === 'DELIVERED').length,
    [shps],
  );

  const awaitingProcessing = useMemo(
    () => shps.filter((s) => ['CREATED', 'DNK_RECEIVED'].includes(s.currentStatus)).length,
    [shps],
  );

  const operatorNotifications = useMemo(
    () =>
      notifications
        .filter((n) => n.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [notifications, user?.id],
  );

  const firstName = user?.name.split(' ')[0] ?? 'Operator';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const metrics = [
    { label: 'Sellers Assisted Today', value: 12, icon: Users, color: 'text-[var(--color-primary)]', bg: 'bg-blue-50' },
    { label: 'Pending Verifications', value: 5, icon: ClipboardCheck, color: 'text-[var(--color-accent-amber)]', bg: 'bg-amber-50' },
    { label: 'Awaiting Processing', value: awaitingProcessing, icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Docs Under Review', value: underReviewCount, icon: FileText, color: 'text-[var(--color-brand-red)]', bg: 'bg-red-50' },
    { label: 'Delayed Shipments', value: delayedCount, icon: AlertTriangle, color: 'text-[var(--color-brand-red)]', bg: 'bg-red-50' },
    { label: 'Completed Exports', value: deliveredCount, icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-green-50' },
  ];

  const quickActions = [
    { label: t('operator.sellerQueue', language), icon: UserCheck, link: '/operator/sellers', color: 'bg-[var(--color-primary)]' },
    { label: t('operator.reviewDocs', language), icon: FileText, link: '/operator/documents', color: 'bg-[var(--color-accent-amber)]' },
    { label: t('operator.processShipments', language), icon: Package, link: '/operator/shipments', color: 'bg-[var(--color-brand-red)]' },
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          {t('operator.dashboard', language)}
        </h2>
        <p className="text-gray-500">Ahmedabad Head Post Office DNK</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">DNK Activity by Week</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={activityData}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="exports" fill="#C62828" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shipments" fill="#1B5E20" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-[var(--color-primary)] mb-4">Sellers Needing Attention</h3>
        <div className="space-y-3">
          {SELLERS.filter(s => s.verificationStatus !== 'ACTIVE').slice(0, 3).map(seller => {
            const sellerUser = USERS.find(u => u.id === seller.userId);
            if (!sellerUser) return null;
            return (
              <div key={seller.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{seller.businessName}</p>
                  <p className="text-xs text-gray-500">{sellerUser.name} · {sellerUser.phone}</p>
                </div>
                <NotificationChannels
                  recipientName={sellerUser.name}
                  recipientPhone={sellerUser.phone}
                  messageType="seller_verification"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--color-primary)]">Recent Activity</h3>
            <span className="text-sm text-[var(--color-primary)] flex items-center gap-1">
              <Bell className="h-4 w-4" /> Operator Feed
            </span>
          </div>
          <div className="space-y-3">
            {operatorNotifications.length === 0 && (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
            {operatorNotifications.map((n) => (
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
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.link}
                className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-soft-gray)] hover:bg-gray-200 transition-colors"
              >
                <div className={`p-2.5 rounded-lg text-white ${a.color}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 flex-1">{a.label}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
