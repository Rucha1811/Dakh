import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  MapPin,
  User,
  Moon,
  Sun,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';

const SELLER_NAV = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/seller/products', icon: Package, label: 'Products' },
  { to: '/seller/documents', icon: FileText, label: 'Docs' },
  { to: '/seller/dnk', icon: MapPin, label: 'DNK' },
  { to: '/seller/profile', icon: User, label: 'Profile' },
];

const OPERATOR_NAV = [
  { to: '/operator', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/operator/sellers', icon: Package, label: 'Queue' },
  { to: '/operator/documents', icon: FileText, label: 'Docs' },
  { to: '/operator/shipments', icon: MapPin, label: 'Ship' },
  { to: '/operator/complaints', icon: User, label: 'Tickets' },
];

const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/analytics', icon: Package, label: 'Analytics' },
  { to: '/admin/sellers', icon: FileText, label: 'Sellers' },
  { to: '/admin/dnks', icon: MapPin, label: 'DNKs' },
  { to: '/admin/shipments', icon: User, label: 'Shipments' },
];

const BUYER_NAV = [
  { to: '/buyer', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/buyer/orders', icon: Package, label: 'Orders' },
];

const NAV_MAP = {
  seller: SELLER_NAV,
  operator: OPERATOR_NAV,
  admin: ADMIN_NAV,
  buyer: BUYER_NAV,
} as const;

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const items = user ? NAV_MAP[user.role] ?? SELLER_NAV : SELLER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-primary)]/10 bg-white shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors',
                isActive
                  ? 'text-[var(--color-brand-red)]'
                  : 'text-[var(--color-primary)]/50 hover:text-[var(--color-primary)]'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={toggleDarkMode}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors text-[var(--color-primary)]/50 hover:text-[var(--color-primary)]"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
}
