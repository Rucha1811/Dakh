import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  Calculator,
  FileText,
  ShoppingCart,
  Truck,
  MapPin,
  MessageSquare,
  Bell,
  LifeBuoy,
  User,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user } = useAuthStore();
  const language = useAppStore(s => s.language);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const closeSidebar = useAppStore(s => s.closeSidebar);

  const sellerLinks = [
    { name: t('nav.dashboard', language), to: '/seller', icon: LayoutDashboard, end: true },
    { name: t('nav.products', language), to: '/seller/products', icon: Package },
    { name: t('nav.readiness', language), to: '/seller/readiness', icon: CheckCircle },
    { name: t('nav.calculator', language), to: '/seller/cost-calculator', icon: Calculator },
    { name: t('nav.documents', language), to: '/seller/documents', icon: FileText },
    { name: t('nav.orders', language), to: '/seller/orders', icon: ShoppingCart },
    { name: t('nav.shipments', language), to: '/seller/shipments', icon: Truck },
    { name: t('nav.findDNK', language), to: '/seller/dnk', icon: MapPin },
    { name: t('nav.assistant', language), to: '/seller/assistant', icon: MessageSquare },
    { name: t('nav.notifications', language), to: '/seller/notifications', icon: Bell },
    { name: t('nav.support', language), to: '/seller/support', icon: LifeBuoy },
    { name: t('nav.faqFeedback', language), to: '/seller/faq', icon: HelpCircle },
    { name: t('nav.settings', language), to: '/seller/settings', icon: Settings },
  ];

  const operatorLinks = [
    { name: t('nav.dashboard', language), to: '/operator', icon: LayoutDashboard, end: true },
    { name: t('nav.sellerQueue', language), to: '/operator/sellers', icon: User },
    { name: t('nav.assistedExports', language), to: '/operator/assisted', icon: Package },
    { name: t('nav.documents', language), to: '/operator/documents', icon: FileText },
    { name: t('nav.shipments', language), to: '/operator/shipments', icon: Truck },
    { name: t('nav.complaints', language), to: '/operator/complaints', icon: LifeBuoy },
    { name: t('nav.faqFeedback', language), to: '/operator/faq', icon: HelpCircle },
    { name: t('nav.settings', language), to: '/operator/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: t('nav.dashboard', language), to: '/admin', icon: LayoutDashboard, end: true },
    { name: t('nav.sellers', language), to: '/admin/sellers', icon: User },
    { name: t('nav.dnks', language), to: '/admin/dnks', icon: MapPin },
    { name: t('nav.products', language), to: '/admin/products', icon: Package },
    { name: t('nav.orders', language), to: '/admin/orders', icon: ShoppingCart },
    { name: t('nav.shipments', language), to: '/admin/shipments', icon: Truck },
    { name: t('nav.compliance', language), to: '/admin/compliance', icon: CheckCircle },
    { name: t('nav.analytics', language), to: '/admin/analytics', icon: Calculator },
    { name: t('nav.faqFeedback', language), to: '/admin/faq', icon: HelpCircle },
    { name: t('nav.settings', language), to: '/admin/settings', icon: Settings },
  ];

  const buyerLinks = [
    { name: t('nav.dashboard', language), to: '/buyer', icon: LayoutDashboard, end: true },
    { name: t('nav.orders', language), to: '/buyer/orders', icon: ShoppingCart },
    { name: t('nav.faqFeedback', language), to: '/buyer/faq', icon: HelpCircle },
    { name: t('nav.settings', language), to: '/buyer/settings', icon: Settings },
  ];

  const links =
    user?.role === 'seller' ? sellerLinks :
    user?.role === 'operator' ? operatorLinks :
    user?.role === 'admin' ? adminLinks :
    user?.role === 'buyer' ? buyerLinks : [];

  const roleBadgeColor =
    user?.role === 'seller' ? 'bg-red-900/50 text-red-300 border-red-700' :
    user?.role === 'operator' ? 'bg-amber-900/50 text-amber-300 border-amber-700' :
    user?.role === 'admin' ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
    'bg-emerald-900/50 text-emerald-300 border-emerald-700';

  const sidebarContent = (
    <div className="app-sidebar flex flex-col w-64 text-white h-full flex-shrink-0 border-r border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-brand-red)] text-white font-bold text-sm shadow-sm">
            NS
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Niryat Saathi</span>
        </div>
        <button
          onClick={closeSidebar}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-col flex-grow overflow-y-auto">
        {user && (
          <div className="px-4 py-3.5 border-b border-gray-800/80 bg-black/20">
            <div className="text-[11px] font-medium text-gray-400">{t('nav.loggedInAs', language)}</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">{user.name}</div>
            <div className="mt-1.5">
              <span className={clsx('inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border capitalize', roleBadgeColor)}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto py-2">
          <nav className="flex-1 px-3 space-y-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-xs'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white',
                    'group flex items-center px-3 py-2.5 text-xs font-semibold rounded-xl transition-all'
                  )
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-4 w-4 text-gray-300 group-hover:text-white" aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-800 p-3">
          <NavLink
            to={`/${user?.role || 'seller'}/settings`}
            onClick={closeSidebar}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-medium text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-gray-400">{t('common.' + (user?.role || 'seller'), language)} {t('nav.settings', language)}</div>
            </div>
            <Settings className="h-4 w-4 text-gray-400" />
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        {sidebarContent}
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          <div className="relative z-10 flex">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
