import { useState, useMemo } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, CheckCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';

const NOTIF_ICON: Record<string, typeof Bell> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const NOTIF_BORDER: Record<string, string> = {
  success: 'border-l-[var(--color-success)]',
  warning: 'border-l-[var(--color-accent-amber)]',
  error: 'border-l-[var(--color-brand-red)]',
  info: 'border-l-[var(--color-primary)]',
};

const NOTIF_ICON_COLOR: Record<string, string> = {
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-accent-amber)]',
  error: 'text-[var(--color-brand-red)]',
  info: 'text-[var(--color-primary)]',
};

type Filter = 'all' | 'unread' | 'read';

export default function Notifications() {
  const user = useAuthStore((s) => s.user);
  const { notifications, markNotificationRead, toggleNotificationRead, language } = useAppStore();
  const [filter, setFilter] = useState<Filter>('all');

  const userNotifications = useMemo(
    () =>
      notifications
        .filter((n) => n.userId === user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications, user?.id],
  );

  const filtered = useMemo(() => {
    if (filter === 'unread') return userNotifications.filter((n) => !n.read);
    if (filter === 'read') return userNotifications.filter((n) => n.read);
    return userNotifications;
  }, [userNotifications, filter]);

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const readCount = userNotifications.filter((n) => n.read).length;

  const markAllRead = () => {
    userNotifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  const handleClick = (id: string) => {
    toggleNotificationRead(id);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.notifications.title', language)}</h2>
          <p className="text-gray-500">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[var(--color-primary)] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <CheckCheck className="h-4 w-4" />
            {t('seller.notifications.markAll', language)}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('notifications.filterAll', language)} ({userNotifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('notifications.filterUnread', language)} ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'read' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('notifications.filterRead', language)} ({readCount})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>{t('seller.notifications.noNotifications', language)}</p>
          </div>
        )}
        {filtered.map((n) => {
          const Icon = NOTIF_ICON[n.type] ?? Info;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 border-b border-gray-50 border-l-4 ${
                n.read ? 'border-l-transparent bg-white' : `${NOTIF_BORDER[n.type]} bg-[var(--color-soft-gray)]`
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon className={`h-5 w-5 ${NOTIF_ICON_COLOR[n.type]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${n.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(n.createdAt)}</span>
                </div>
                <p className={`text-sm mt-0.5 ${n.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {n.message}
                </p>
              </div>
              <button
                onClick={() => handleClick(n.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                title={n.read ? t('notifications.markAsUnread', language) : t('notifications.markAsRead', language)}
              >
                {n.read ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-[var(--color-primary)]" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
