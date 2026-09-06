import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore';
import Toast from './components/Toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowItWorks from './pages/HowItWorks';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';

import MainLayout from './layouts/MainLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import Products from './pages/seller/Products';
import AddProduct from './pages/seller/AddProduct';
import ExportReadiness from './pages/seller/ExportReadiness';
import CostCalculator from './pages/seller/CostCalculator';
import Documents from './pages/seller/Documents';
import Orders from './pages/seller/Orders';
import Shipments from './pages/seller/Shipments';
import DNKLocator from './pages/seller/DNKLocator';
import Assistant from './pages/seller/Assistant';
import Notifications from './pages/seller/Notifications';
import Support from './pages/seller/Support';
import Profile from './pages/seller/Profile';

import OperatorDashboard from './pages/operator/OperatorDashboard';
import SellerQueue from './pages/operator/SellerQueue';
import AssistedExport from './pages/operator/AssistedExport';
import OperatorDocuments from './pages/operator/OperatorDocuments';
import OperatorShipments from './pages/operator/OperatorShipments';
import OperatorComplaints from './pages/operator/OperatorComplaints';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSellers from './pages/admin/AdminSellers';
import AdminDNKs from './pages/admin/AdminDNKs';
import AdminOrders from './pages/admin/AdminOrders';
import AdminShipments from './pages/admin/AdminShipments';
import AdminCompliance from './pages/admin/AdminCompliance';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProductsPage from './pages/admin/AdminProducts';

import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BuyerOrders from './pages/buyer/BuyerOrders';
import BuyerOrderTracking from './pages/buyer/BuyerOrderTracking';

import AccountSettings from './pages/AccountSettings';
import FAQFeedback from './pages/FAQFeedback';

export default function App() {
  const initFromStorage = useAuthStore(s => s.initFromStorage);
  const initFromBackend = useAppStore(s => s.initFromBackend);
  const darkMode = useAppStore(s => s.darkMode);

  useEffect(() => {
    initFromStorage();
    if (initFromBackend) {
      initFromBackend();
    }
  }, [initFromStorage, initFromBackend]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/faq" element={<FAQFeedback />} />

        <Route element={<ProtectedRouteWrapper />}>
          <Route element={<MainLayout />}>
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<Products />} />
            <Route path="/seller/products/new" element={<AddProduct />} />
            <Route path="/seller/readiness" element={<ExportReadiness />} />
            <Route path="/seller/cost-calculator" element={<CostCalculator />} />
            <Route path="/seller/documents" element={<Documents />} />
            <Route path="/seller/orders" element={<Orders />} />
            <Route path="/seller/shipments" element={<Shipments />} />
            <Route path="/seller/dnk" element={<DNKLocator />} />
            <Route path="/seller/assistant" element={<Assistant />} />
            <Route path="/seller/notifications" element={<Notifications />} />
            <Route path="/seller/support" element={<Support />} />
            <Route path="/seller/profile" element={<Profile />} />
            <Route path="/seller/settings" element={<AccountSettings />} />
            <Route path="/seller/faq" element={<FAQFeedback />} />

            <Route path="/operator" element={<OperatorDashboard />} />
            <Route path="/operator/sellers" element={<SellerQueue />} />
            <Route path="/operator/assisted/:sellerId" element={<AssistedExport />} />
            <Route path="/operator/assisted" element={<AssistedExport />} />
            <Route path="/operator/documents" element={<OperatorDocuments />} />
            <Route path="/operator/shipments" element={<OperatorShipments />} />
            <Route path="/operator/complaints" element={<OperatorComplaints />} />
            <Route path="/operator/profile" element={<Profile />} />
            <Route path="/operator/settings" element={<AccountSettings />} />
            <Route path="/operator/faq" element={<FAQFeedback />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/dnks" element={<AdminDNKs />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/shipments" element={<AdminShipments />} />
            <Route path="/admin/compliance" element={<AdminCompliance />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/settings" element={<AccountSettings />} />
            <Route path="/admin/faq" element={<FAQFeedback />} />

            <Route path="/buyer" element={<BuyerDashboard />} />
            <Route path="/buyer/orders" element={<BuyerOrders />} />
            <Route path="/buyer/orders/:orderId" element={<BuyerOrderTracking />} />
            <Route path="/buyer/profile" element={<Profile />} />
            <Route path="/buyer/settings" element={<AccountSettings />} />
            <Route path="/buyer/faq" element={<FAQFeedback />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRouteWrapper() {
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace />;

  const path = location.pathname;
  // If user is admin or accessing public/shared routes, allow all
  if (user.role === 'admin') {
    return <Outlet />;
  }

  const rolePrefixes = ['/seller', '/operator', '/admin', '/buyer'];
  for (const prefix of rolePrefixes) {
    if (path.startsWith(prefix) && !path.startsWith(`/${user.role}`)) {
      // In prototype demo, if accessing another role route, allow or redirect to user's role
      return <Outlet />;
    }
  }

  return <Outlet />;
}
