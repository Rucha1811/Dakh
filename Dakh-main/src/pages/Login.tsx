import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Building2, ShieldAlert, ShoppingBag, ArrowLeft, Mail, Lock, AlertCircle, Loader2, UserPlus } from 'lucide-react';

export default function Login() {
  const login = useAuthStore(state => state.login);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  const handleDemoLogin = async (role: 'seller' | 'operator' | 'admin' | 'buyer') => {
    setLoading(true);
    setError('');
    try {
      const success = await login(`${role}@demo.com`, 'demo123');
      if (success) {
        navigate(`/${role}`);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email or use a demo account.');
      } else {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) navigate(`/${currentUser.role}`);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoRoles = [
    { role: 'seller' as const, label: 'Seller Portal', sub: 'Meera Patel (Artisan/Exporter)', icon: User, color: 'hover:border-[var(--color-brand-red)] hover:bg-red-50/60' },
    { role: 'operator' as const, label: 'DNK Post Office Operator', sub: 'Rajesh Kumar (Ahmedabad HPO)', icon: Building2, color: 'hover:border-[var(--color-accent-amber)] hover:bg-amber-50/60' },
    { role: 'buyer' as const, label: 'International Buyer', sub: 'Hans Mueller (Munich, Germany)', icon: ShoppingBag, color: 'hover:border-[var(--color-success)] hover:bg-green-50/60' },
    { role: 'admin' as const, label: 'Postal Admin & Analytics', sub: 'Priya Sharma (New Delhi)', icon: ShieldAlert, color: 'hover:border-[var(--color-primary)] hover:bg-blue-50/60' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-950/20">
            <span className="text-3xl text-white font-bold tracking-tighter">NS</span>
          </div>
        </div>
        <h2 className="mt-5 text-center text-3xl font-extrabold text-[var(--color-primary)]">
          Niryat Saathi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digital Export Enablement Platform for Rural Indian Sellers & MSMEs
        </p>
        <div className="mt-3 text-center text-xs font-semibold text-[var(--color-brand-red)] bg-red-50 py-1 rounded-full w-fit mx-auto px-3.5 border border-red-100">
          Dak Ghar Niryat Kendra (DNK) Network
        </div>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. seller@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123 or your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[var(--color-brand-red)] hover:underline inline-flex items-center gap-1">
                Create an Account <UserPlus className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-3 bg-white text-gray-400 font-semibold">1-Click Demo Login</span>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {demoRoles.map(({ role, label, sub, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={loading}
                className={`w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 ${color}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <Icon className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">{label}</div>
                    <div className="text-[11px] text-gray-500 font-normal">{sub}</div>
                  </div>
                </div>
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <span className="text-xs text-gray-400">→</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
