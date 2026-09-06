import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  MapPin,
  User,
  Sliders,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const language = useAppStore((s) => s.language);

  const SELLER_NAV = [
    { to: '/seller', icon: LayoutDashboard, label: t('nav.dashboard', language) },
    { to: '/seller/products', icon: Package, label: t('nav.products', language) },
    { to: '/seller/documents', icon: FileText, label: t('nav.documents', language) },
    { to: '/seller/dnk', icon: MapPin, label: 'DNK' },
    { to: '/seller/profile', icon: User, label: t('nav.profile', language) },
  ];

  const OPERATOR_NAV = [
    { to: '/operator', icon: LayoutDashboard, label: t('nav.dashboard', language) },
    { to: '/operator/sellers', icon: Package, label: t('nav.sellerQueue', language) },
    { to: '/operator/documents', icon: FileText, label: t('nav.documents', language) },
    { to: '/operator/shipments', icon: MapPin, label: t('nav.shipments', language) },
    { to: '/operator/complaints', icon: User, label: t('nav.complaints', language) },
  ];

  const ADMIN_NAV = [
    { to: '/admin', icon: LayoutDashboard, label: t('nav.dashboard', language) },
    { to: '/admin/analytics', icon: Package, label: t('nav.analytics', language) },
    { to: '/admin/sellers', icon: FileText, label: t('nav.sellers', language) },
    { to: '/admin/dnks', icon: MapPin, label: t('nav.dnks', language) },
    { to: '/admin/shipments', icon: User, label: t('nav.shipments', language) },
  ];

  const BUYER_NAV = [
    { to: '/buyer', icon: LayoutDashboard, label: t('nav.dashboard', language) },
    { to: '/buyer/orders', icon: Package, label: t('nav.orders', language) },
  ];

  const items =
    user?.role === 'seller' ? SELLER_NAV :
    user?.role === 'operator' ? OPERATOR_NAV :
    user?.role === 'admin' ? ADMIN_NAV :
    user?.role === 'buyer' ? BUYER_NAV : SELLER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B1120] shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors',
                isActive
                  ? 'text-[var(--color-brand-red)] font-bold'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to={`/${user?.role ?? 'seller'}/settings`}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors',
              isActive
                ? 'text-[var(--color-brand-red)] font-bold'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            )
          }
        >
          <Sliders className="h-5 w-5" />
          <span className="font-medium">{t('nav.settings', language)}</span>
        </NavLink>
      </div>
    </nav>
  );
}
