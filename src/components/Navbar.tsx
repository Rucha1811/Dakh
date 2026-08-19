import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';
import { Bell, Menu, Moon, Sun } from 'lucide-react';

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
  '/operator': t('nav.dashboard', lang),
  '/operator/sellers': t('nav.sellerQueue', lang),
  '/operator/assisted': t('nav.assistedExports', lang),
  '/operator/documents': t('nav.documents', lang),
  '/operator/shipments': t('nav.shipments', lang),
  '/operator/complaints': t('nav.complaints', lang),
  '/admin': t('nav.dashboard', lang),
  '/admin/sellers': t('common.sellers', lang),
  '/admin/dnks': t('nav.dnks', lang),
  '/admin/products': t('nav.products', lang),
  '/admin/orders': t('nav.orders', lang),
  '/admin/shipments': t('nav.shipments', lang),
  '/admin/compliance': t('nav.compliance', lang),
  '/admin/analytics': t('nav.analytics', lang),
  '/buyer': t('nav.dashboard', lang),
  '/buyer/orders': t('nav.orders', lang),
});

export default function Navbar() {
  const user = useAuthStore(s => s.user);
  const notifications = useAppStore(s => s.notifications);
  const language = useAppStore(s => s.language);
  const darkMode = useAppStore(s => s.darkMode);
  const toggleSidebar = useAppStore(s => s.toggleSidebar);
  const toggleDarkMode = useAppStore(s => s.toggleDarkMode);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const pageTitle = Object.entries(ROUTE_TITLES(language)).find(
    ([path]) => location.pathname === path
  )?.[1]
    ?? (user?.role
      ? `${user!.role.charAt(0).toUpperCase() + user!.role.slice(1)} Portal`
      : 'Dashboard');

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
      <button
        type="button"
        onClick={toggleSidebar}
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)] md:hidden"
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
            onClick={toggleDarkMode}
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
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

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
