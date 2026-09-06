import { useState, useMemo } from 'react';
import {
  Headphones, AlertTriangle, CheckCircle, Clock, User, ArrowRight,
} from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { USERS, SUPPORT_TICKETS } from '../../data/mockData';

type TicketFilter = 'All' | 'Open' | 'Assigned' | 'In Progress' | 'Resolved';

const FILTERS: TicketFilter[] = ['All', 'Open', 'Assigned', 'In Progress', 'Resolved'];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  Open: { color: 'text-blue-700', bg: 'bg-blue-100' },
  Assigned: { color: 'text-indigo-700', bg: 'bg-indigo-100' },
  'In Progress': { color: 'text-amber-700', bg: 'bg-amber-100' },
  Resolved: { color: 'text-[var(--color-success)]', bg: 'bg-green-100' },
};

const PRIORITY_STYLES: Record<string, { color: string; bg: string }> = {
  High: { color: 'text-red-700', bg: 'bg-red-100' },
  Medium: { color: 'text-amber-700', bg: 'bg-amber-100' },
  Low: { color: 'text-gray-600', bg: 'bg-gray-100' },
};

export default function OperatorComplaints() {
  const { supportTickets, updateTicketStatus, addToast, language } = useAppStore();
  const tickets = supportTickets.length ? supportTickets : SUPPORT_TICKETS;

  const [activeFilter, setActiveFilter] = useState<TicketFilter>('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return tickets;
    return tickets.filter((ticket) => ticket.status === activeFilter);
  }, [tickets, activeFilter]);

  const getUserName = (userId: string) => {
    const user = USERS.find((u) => u.id === userId);
    return user?.name ?? 'Unknown User';
  };

  const handleAssign = (id: string) => {
    updateTicketStatus(id, 'Assigned');
    addToast({ message: 'Ticket assigned', type: 'success' });
  };

  const handleInProgress = (id: string) => {
    updateTicketStatus(id, 'In Progress');
    addToast({ message: 'Ticket marked in progress', type: 'info' });
  };

  const handleResolve = (id: string) => {
    updateTicketStatus(id, 'Resolved');
    addToast({ message: 'Ticket resolved', type: 'success' });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('operator.complaints', language)}</h2>
        <p className="text-gray-500">{t('operator.manageTickets', language)}</p>
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
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Headphones className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No tickets found</p>
          </div>
        )}
        {filtered.map((ticket) => {
          const st = STATUS_STYLES[ticket.status] ?? STATUS_STYLES.Open;
          const pr = PRIORITY_STYLES[ticket.priority] ?? PRIORITY_STYLES.Medium;
          return (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{ticket.status}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pr.bg} ${pr.color}`}>{ticket.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{getUserName(ticket.userId)}</span>
                    {ticket.orderId && <span className="text-xs text-gray-500">— {ticket.orderId}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">{ticket.category}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {ticket.status === 'Open' && (
                    <button onClick={() => handleAssign(ticket.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1">
                      Assign
                    </button>
                  )}
                  {(ticket.status === 'Open' || ticket.status === 'Assigned') && (
                    <button onClick={() => handleInProgress(ticket.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-accent-amber)] text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1">
                      <Clock className="h-3 w-3" /> In Progress
                    </button>
                  )}
                  {ticket.status === 'In Progress' && (
                    <button onClick={() => handleResolve(ticket.id)} className="px-3 py-1 text-xs font-medium bg-[var(--color-success)] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Resolve
                    </button>
                  )}
                  {ticket.status === 'Resolved' && (
                    <span className="text-xs text-[var(--color-success)] font-medium flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Done
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
