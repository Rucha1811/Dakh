import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle, Phone, AlertCircle, ChevronDown, ChevronUp, Send, CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';

const CATEGORIES = ['Shipment Delay', 'Document Issue', 'Export Compliance', 'Platform Feedback', 'Account Issue', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'] as const;

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-gray-100 text-gray-600',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  Assigned: 'bg-indigo-100 text-indigo-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-green-100 text-green-700',
};

export default function Support() {
  const user = useAuthStore((s) => s.user);
  const { supportTickets, addSupportTicket, addToast, language } = useAppStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [orderId, setOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Medium');

  const userTickets = useMemo(
    () =>
      supportTickets
        .filter((ticket) => ticket.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [supportTickets, user?.id],
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleSubmit = () => {
    if (!description.trim() || !user) return;
    const ticket = {
      id: `TKT${Date.now()}`,
      userId: user.id,
      orderId: orderId || undefined,
      category,
      description: description.trim(),
      priority,
      status: 'Open' as const,
      createdAt: new Date().toISOString(),
    };
    addSupportTicket(ticket);
    addToast({ type: 'success', message: 'Support ticket raised successfully!' });
    setFormOpen(false);
    setCategory(CATEGORIES[0]);
    setOrderId('');
    setDescription('');
    setPriority('Medium');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.support.title', language)}</h2>
        <p className="text-gray-500">{t('seller.support.subtitle', language)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/seller/assistant"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-blue-50">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ask AI Assistant</h3>
            <p className="text-sm text-gray-500">Get instant answers to export questions</p>
          </div>
        </Link>
        <Link
          to="/seller/dnk"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-green-50">
            <Phone className="h-6 w-6 text-[var(--color-success)]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Contact DNK</h3>
            <p className="text-sm text-gray-500">Reach your nearest Export Center</p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Raise a Complaint</h3>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="text-sm text-[var(--color-primary)] font-medium hover:underline"
          >
            {formOpen ? 'Close' : 'Open Form'}
          </button>
        </div>

        {formOpen && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (optional)</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. DNK10234"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      priority === p
                        ? p === 'High'
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : p === 'Medium'
                            ? 'bg-amber-50 border-amber-300 text-amber-700'
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Describe your issue in detail..."
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Submit Ticket
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Previous Tickets</h3>
        {userTickets.length === 0 && (
          <p className="text-sm text-gray-400">No tickets yet</p>
        )}
        <div className="space-y-3">
          {userTickets.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <div key={t.id} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800">{t.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[t.priority]}`}>
                          {t.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{t.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(t.createdAt)}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                    <p className="text-sm text-gray-700">{t.description}</p>
                    {t.orderId && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Order:</span> {t.orderId}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
