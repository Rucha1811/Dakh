import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Building2, ShieldAlert, ShoppingBag, ArrowLeft, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

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

  const handleDemoLogin = (role: 'seller' | 'operator' | 'admin' | 'buyer') => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(`${role}@demo.com`, role);
      if (success) {
        navigate(`/${role}`);
      } else {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Invalid credentials. Use a demo button below.');
      } else {
        const user = useAuthStore.getState().user;
        if (user) navigate(`/${user.role}`);
      }
      setLoading(false);
    }, 400);
  };

  const demoRoles = [
    { role: 'seller' as const, label: 'Continue as Seller', sub: 'Meera Patel, Ahmedabad', icon: User, color: 'hover:border-[var(--color-brand-red)] hover:bg-red-50' },
    { role: 'operator' as const, label: 'Continue as DNK Operator', sub: 'Rajesh Kumar, Ahmedabad', icon: Building2, color: 'hover:border-[var(--color-accent-amber)] hover:bg-amber-50' },
    { role: 'buyer' as const, label: 'Continue as Buyer', sub: 'Hans Mueller, Munich', icon: ShoppingBag, color: 'hover:border-[var(--color-success)] hover:bg-green-50' },
    { role: 'admin' as const, label: 'Continue as Admin', sub: 'Priya Sharma, New Delhi', icon: ShieldAlert, color: 'hover:border-[var(--color-primary)] hover:bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white font-bold tracking-tighter">NS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-primary)]">
          Niryat Saathi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digital Export Enablement Platform for Rural Indian Sellers
        </p>
        <div className="mt-4 text-center text-xs font-semibold text-[var(--color-brand-red)] bg-red-50 py-1 rounded-md w-fit mx-auto px-3 border border-red-100">
          SIH Prototype - Concept Demonstration
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-[var(--color-soft-gray)] sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@demo.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">or use a demo account</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {demoRoles.map(({ role, label, sub, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={loading}
                className={`w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-[var(--color-primary)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50 ${color}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div className="text-left">
                    <div>{label}</div>
                    <div className="text-xs text-gray-400 font-normal">{sub}</div>
                  </div>
                </div>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
