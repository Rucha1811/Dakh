import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { useAppStore } from '../store/appStore';
import { WifiOff } from 'lucide-react';

export default function MainLayout() {
  const lowBandwidth = useAppStore(s => s.lowBandwidth);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[var(--color-soft-gray)] overflow-hidden w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 w-full h-full overflow-hidden">
        <Navbar />
        {isOffline && (
          <div className="bg-amber-500 text-white text-xs text-center py-1 px-4">
            You are offline — some features may be limited
          </div>
        )}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden focus:outline-none pb-24 md:pb-8">
          {lowBandwidth && (
            <div className="bg-[var(--color-accent-amber)]/10 border-b border-[var(--color-accent-amber)]/30 px-4 py-1.5 flex items-center justify-center gap-2">
              <WifiOff className="h-3.5 w-3.5 text-[var(--color-accent-amber)]" />
              <span className="text-xs font-medium text-[var(--color-accent-amber)]">
                Low Bandwidth Mode - Images and animations are reduced
              </span>
            </div>
          )}
          <div className="py-6 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
