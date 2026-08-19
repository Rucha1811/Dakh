import { NavLink, useNavigate } from 'react-router-dom';
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
  LogOut,
  Globe,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import clsx from 'clsx';

const LANG_OPTIONS = [
  { code: 'en' as const, label: 'EN' },
  { code: 'hi' as const, label: 'HI' },
  { code: 'gu' as const, label: 'GU' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const language = useAppStore(s => s.language);
  const lowBandwidth = useAppStore(s => s.lowBandwidth);
  const darkMode = useAppStore(s => s.darkMode);
  const sidebarOpen = useAppStore(s => s.sidebarOpen);
  const setLanguage = useAppStore(s => s.setLanguage);
  const toggleLowBandwidth = useAppStore(s => s.toggleLowBandwidth);
  const toggleDarkMode = useAppStore(s => s.toggleDarkMode);
  const closeSidebar = useAppStore(s => s.closeSidebar);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    { name: t('nav.profile', language), to: '/seller/profile', icon: User },
  ];

  const operatorLinks = [
    { name: t('nav.dashboard', language), to: '/operator', icon: LayoutDashboard, end: true },
    { name: 'Seller Queue', to: '/operator/sellers', icon: User },
    { name: 'Assisted Exports', to: '/operator/assisted', icon: Package },
    { name: t('nav.documents', language), to: '/operator/documents', icon: FileText },
    { name: t('nav.shipments', language), to: '/operator/shipments', icon: Truck },
    { name: 'Complaints', to: '/operator/complaints', icon: LifeBuoy },
    { name: t('nav.profile', language), to: '/seller/profile', icon: User },
  ];

  const adminLinks = [
    { name: t('nav.dashboard', language), to: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Sellers', to: '/admin/sellers', icon: User },
    { name: 'DNKs', to: '/admin/dnks', icon: MapPin },
    { name: t('nav.products', language), to: '/admin/products', icon: Package },
    { name: t('nav.orders', language), to: '/admin/orders', icon: ShoppingCart },
    { name: t('nav.shipments', language), to: '/admin/shipments', icon: Truck },
    { name: 'Compliance', to: '/admin/compliance', icon: CheckCircle },
    { name: 'Analytics', to: '/admin/analytics', icon: Calculator },
  ];

  const buyerLinks = [
    { name: t('nav.dashboard', language), to: '/buyer', icon: LayoutDashboard, end: true },
    { name: t('nav.orders', language), to: '/buyer/orders', icon: ShoppingCart },
    { name: t('nav.profile', language), to: '/seller/profile', icon: User },
  ];

  const links =
    user?.role === 'seller' ? sellerLinks :
    user?.role === 'operator' ? operatorLinks :
    user?.role === 'admin' ? adminLinks :
    user?.role === 'buyer' ? buyerLinks : [];

  const roleBadgeColor =
    user?.role === 'seller' ? 'bg-emerald-100 text-emerald-700' :
    user?.role === 'operator' ? 'bg-amber-100 text-amber-700' :
    user?.role === 'admin' ? 'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';

  const sidebarContent = (
    <div className="flex flex-col w-64 bg-[var(--color-primary)] h-full">
      <div className="flex flex-col h-0 flex-1">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 border-b border-gray-800">
          <span className="text-xl text-white font-bold tracking-tight">Niryat Saathi</span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-brand-red)] text-white">PROTOTYPE</span>
          <button
            onClick={closeSidebar}
            className="ml-auto md:hidden text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.location}</p>
              </div>
            </div>
            <span className={`mt-2 inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${roleBadgeColor}`}>
              {user.role}
            </span>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.end}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                  )
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex flex-col border-t border-gray-800 p-4 space-y-3">
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-gray-400 mr-1" />
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={clsx(
                  'px-2.5 py-1 text-xs font-semibold rounded transition-colors',
                  language === opt.code
                    ? 'bg-white text-[var(--color-primary)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors"
          >
            {darkMode ? (
              <>
                <Sun className="mr-3 h-5 w-5 text-[var(--color-accent-amber)]" />
                <span className="text-[var(--color-accent-amber)]">{t('settings.darkMode', language)} On</span>
              </>
            ) : (
              <>
                <Moon className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-gray-300 hover:text-white">{t('settings.darkMode', language)}</span>
              </>
            )}
          </button>

          <button
            onClick={toggleLowBandwidth}
            className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors"
          >
            {lowBandwidth ? (
              <>
                <WifiOff className="mr-3 h-5 w-5 text-[var(--color-accent-amber)]" />
                <span className="text-[var(--color-accent-amber)]">{t('settings.lowBandwidth', language)} On</span>
              </>
            ) : (
              <>
                <Wifi className="mr-3 h-5 w-5 text-gray-400" />
                <span className="text-gray-300 hover:text-white">{t('settings.lowBandwidth', language)}</span>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-gray-700 hover:text-red-300 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-400" />
            {t('nav.logout', language)}
          </button>
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
