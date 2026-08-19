import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { ReactNode } from 'react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { ADMIN_ANALYTICS } from '../../data/mockData';

const PIE_COLORS = ['#102A43', '#C62828', '#E8A317', '#2E7D32', '#6366f1', '#94a3b8'];

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminAnalytics() {
  const language = useAppStore(s => s.language);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.analytics', language)}</h2>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-amber)] text-white">
          Demo Data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Exports by Month">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={ADMIN_ANALYTICS.exportsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Value']} />
              <Area type="monotone" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Product Categories">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ADMIN_ANALYTICS.topCategories} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Exports by Destination">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ADMIN_ANALYTICS.exportsByDestination}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {ADMIN_ANALYTICS.exportsByDestination.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DNK Activity">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ADMIN_ANALYTICS.dnkActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="assisted" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shipment Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ADMIN_ANALYTICS.shipmentStatus}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {ADMIN_ANALYTICS.shipmentStatus.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Common Failure Points">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ADMIN_ANALYTICS.failurePoints} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="reason" tick={{ fontSize: 12 }} width={130} />
              <Tooltip formatter={(v) => [`${v}%`, 'Percentage']} />
              <Bar dataKey="percentage" fill="var(--color-brand-red)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Journey Funnel">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ADMIN_ANALYTICS.userJourneyFunnel} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} width={140} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-accent-amber)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
