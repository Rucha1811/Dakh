import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';
import { Bell, Menu } from 'lucide-react';

const ROUTE_TITLES = (lang: string): Record<string, string> => ({
  '/seller': t('nav.dashboard', lang),
  '/seller/products': t('nav.products', lang),
  '/seller/products/new': t('seller.products.addNew', lang),
  '/seller/readiness': t('nav.readiness', lang),
  '/seller/cost-calculator': t('nav.calculator', lang),
  '/seller/documents': t('nav.documents', lang),
  '/seller/orders': t('nav.orders', lang),
  '/seller/shipments': t('nav.shipments', lang),
  '/seller/dnk': t('nav.findDNK', lang),
  '/seller/assistant': t('nav.assistant', lang),
  '/seller/notifications': t('nav.notifications', lang),
  '/seller/support': t('nav.support', lang),
  '/seller/profile': t('nav.profile', lang),
  '/seller/settings': t('settings.title', lang),
  '/seller/faq': t('nav.faqFeedback', lang),
  '/operator': t('nav.dashboard', lang),
  '/operator/sellers': t('nav.sellerQueue', lang),
  '/operator/assisted': t('nav.assistedExports', lang),
  '/operator/documents': t('nav.documents', lang),
  '/operator/shipments': t('nav.shipments', lang),
  '/operator/complaints': t('nav.complaints', lang),
  '/operator/profile': t('nav.profile', lang),
  '/operator/settings': t('settings.title', lang),
  '/operator/faq': t('nav.faqFeedback', lang),
  '/admin': t('nav.dashboard', lang),
  '/admin/sellers': t('common.sellers', lang),
  '/admin/dnks': t('nav.dnks', lang),
  '/admin/products': t('nav.products', lang),
  '/admin/orders': t('nav.orders', lang),
  '/admin/shipments': t('nav.shipments', lang),
  '/admin/compliance': t('nav.compliance', lang),
  '/admin/analytics': t('nav.analytics', lang),
  '/admin/profile': t('nav.profile', lang),
  '/admin/settings': t('settings.title', lang),
  '/admin/faq': t('nav.faqFeedback', lang),
  '/buyer': t('nav.dashboard', lang),
  '/buyer/orders': t('nav.orders', lang),
  '/buyer/profile': t('nav.profile', lang),
  '/buyer/settings': t('settings.title', lang),
  '/buyer/faq': t('nav.faqFeedback', lang),
});

export default function Navbar() {
  const user = useAuthStore(s => s.user);
  const notifications = useAppStore(s => s.notifications);
  const language = useAppStore(s => s.language);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const pageTitle = Object.entries(ROUTE_TITLES(language)).find(
    ([path]) => location.pathname === path
  )?.[1]
    ?? (user?.role
      ? `${user!.role.charAt(0).toUpperCase() + user!.role.slice(1)} Portal`
      : 'Dashboard');

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-[#0F172A] shadow-xs border-b border-gray-200 dark:border-gray-800 transition-colors">
      <button
        type="button"
        onClick={toggleSidebar}
        className="px-4 border-r border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 hidden sm:block">
            {pageTitle}
          </h1>
          <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
            SIH Demo
          </span>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <button
            type="button"
            className="relative bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-[var(--color-brand-red)] text-white text-[10px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 px-1 hidden md:inline">Role:</span>
            {(['seller', 'buyer', 'admin', 'operator'] as const).map(r => (
              <button
                key={r}
                onClick={async () => {
                  const demoEmail = `${r}@demo.com`;
                  await useAuthStore.getState().login(demoEmail, 'demo123');
                  window.location.href = `/${r}`;
                }}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg capitalize transition ${
                  user?.role === r
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Link
            to={`/${user?.role || 'seller'}/settings`}
            className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="Account Settings"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200 hidden sm:block">
              {user?.name || 'User'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
