import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Building2, ShoppingBag, ArrowLeft, Mail, Lock, Phone, MapPin, Briefcase, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [role, setRole] = useState<'seller' | 'buyer'>('seller');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    businessName: '',
    businessType: 'Individual Artisan',
    state: 'Gujarat',
    district: 'Ahmedabad',
    pinCode: '380001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const ok = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone || '+91 98765 00000',
        location: formData.location || `${formData.district}, ${formData.state}`,
        businessName: formData.businessName || `${formData.name}'s Exports`,
        businessType: formData.businessType,
        state: formData.state,
        district: formData.district,
        pinCode: formData.pinCode,
      });

      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/${role}`);
        }, 1200);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center">
          <div className="h-14 w-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-950/20">
            <span className="text-2xl text-white font-bold tracking-tighter">NS</span>
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-[var(--color-primary)]">
          Create an Account
        </h2>
        <p className="mt-1.5 text-center text-sm text-gray-600">
          Join Niryat Saathi & start exporting through Dak Ghar Niryat Kendra
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Account created successfully! Redirecting to your portal...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                I want to register as
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    role === 'seller'
                      ? 'border-[var(--color-brand-red)] bg-red-50/70 text-[var(--color-brand-red)] shadow-xs ring-2 ring-red-200'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Indian Artisan / Seller</span>
                  <span className="text-[10px] font-normal text-gray-500">Sell & Export via DNK</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                    role === 'buyer'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 shadow-xs ring-2 ring-emerald-200'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Global Buyer</span>
                  <span className="text-[10px] font-normal text-gray-500">Discover & Import Goods</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ahmedabad, Gujarat"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Seller Specific Fields */}
            {role === 'seller' && (
              <div className="p-3.5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-gray-800">Business & Craft Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">Business / Brand Name</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Patel Craftworks"
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">Enterprise Type</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <option value="Individual Artisan">Individual Artisan</option>
                      <option value="SHG / Cooperative">SHG / Cooperative</option>
                      <option value="MSME">MSME</option>
                      <option value="Small Enterprise">Small Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[var(--color-brand-red)] hover:underline">
                Sign In
              </Link>
            </p>
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
