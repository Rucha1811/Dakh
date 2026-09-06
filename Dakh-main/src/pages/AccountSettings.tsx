import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  Globe,
  Wifi,
  WifiOff,
  LogOut,
  Save,
  Shield,
  Sparkles,
  CheckCircle2,
  Sliders,
  Database,
  Smartphone,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { t } from '../i18n/translations';

const LANGUAGES = [
  {
    code: 'en' as const,
    label: 'English',
    nativeLabel: 'English',
    desc: 'Default international language',
  },
  {
    code: 'hi' as const,
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    desc: 'राष्ट्रीय भाषा (देवनागरी)',
  },
  {
    code: 'gu' as const,
    label: 'Gujarati',
    nativeLabel: 'ગુજરાતી',
    desc: 'રાજ્ય ભાષા (ગુજરાત)',
  },
];

export default function AccountSettings() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const updateProfile = useAuthStore(s => s.updateProfile);

  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);
  const darkMode = useAppStore(s => s.darkMode);
  const toggleDarkMode = useAppStore(s => s.toggleDarkMode);
  const lowBandwidth = useAppStore(s => s.lowBandwidth);
  const toggleLowBandwidth = useAppStore(s => s.toggleLowBandwidth);
  const addToast = useAppStore(s => s.addToast);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setPhone(user.phone ?? '');
      setLocation(user.location ?? '');
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateProfile({ name, phone, location });
    setTimeout(() => {
      setSaving(false);
      addToast({
        type: 'success',
        message: 'Account details saved successfully!',
      });
    }, 400);
  };

  const handleLogout = () => {
    logout();
    addToast({
      type: 'info',
      message: 'You have been logged out.',
    });
    navigate('/login');
  };

  if (!user) return null;

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    seller: { bg: 'bg-red-50', text: 'text-[var(--color-brand-red)]', border: 'border-red-200' },
    operator: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    buyer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    admin: { bg: 'bg-blue-50', text: 'text-[var(--color-primary)]', border: 'border-blue-200' },
  };

  const roleStyle = roleColors[user.role] || roleColors.seller;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[var(--color-primary)] rounded-xl text-white shadow-xs">
            <Sliders className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {t('settings.title', language)}
            </h1>
            <p className="text-xs text-gray-500">
              {t('settings.subtitle', language)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
          >
            {user.role} {t('settings.accountBadge', language)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Profile Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
              <div className="h-20 w-20 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-950/10 mb-3">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
              <div className="mt-2 text-[11px] font-medium text-gray-400">
                {t('settings.userId', language)}: <span className="font-mono text-gray-600">{user.id}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t('settings.fullName', language)}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/60 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t('settings.phone', language)}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/60 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t('settings.location', language)}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50/60 border border-gray-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-gray-800 transition-all shadow-xs disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? t('settings.saving', language) : t('settings.updateDetails', language)}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Mode, Language, Low Bandwidth, Logout */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Theme / Mode Setting */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{t('settings.appearance', language)}</h3>
                  <p className="text-xs text-gray-500">
                    {t('settings.appearanceDesc', language)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                {darkMode ? t('settings.darkMode', language) : t('settings.lightMode', language)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (darkMode) toggleDarkMode();
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  !darkMode
                    ? 'border-[var(--color-primary)] bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Sun className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">{t('settings.lightMode', language)}</div>
                  <div className="text-[10px] text-gray-500">{t('settings.lightModeDesc', language)}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!darkMode) toggleDarkMode();
                }}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                  darkMode
                    ? 'border-[var(--color-primary)] bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Moon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">{t('settings.darkMode', language)}</div>
                  <div className="text-[10px] text-gray-500">{t('settings.darkModeDesc', language)}</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Language Selection Setting */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-[var(--color-primary)]">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{t('settings.systemLanguage', language)}</h3>
                  <p className="text-xs text-gray-500">
                    {t('settings.systemLanguageDesc', language)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 uppercase">
                {language}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      addToast({
                        type: 'info',
                        message: `Language switched to ${lang.label}`,
                      });
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all ${
                      isActive
                        ? 'border-[var(--color-primary)] bg-blue-50/60 shadow-xs ring-2 ring-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold text-gray-900">
                        {lang.nativeLabel}
                      </span>
                      {isActive && (
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-primary)]" />
                      )}
                    </div>
                    <span className="text-xs text-gray-700 font-medium">
                      {lang.label}
                    </span>
                    <span className="text-[10px] text-gray-500">{lang.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Low Bandwidth Mode Setting */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${lowBandwidth ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {lowBandwidth ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {t('settings.lowBandwidth', language)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t('settings.lowBandwidthDesc', language)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  toggleLowBandwidth();
                  addToast({
                    type: 'info',
                    message: lowBandwidth
                      ? 'Low Bandwidth Mode disabled'
                      : 'Low Bandwidth Mode enabled (Data Saver on)',
                  });
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  lowBandwidth ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    lowBandwidth ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 flex items-start gap-2.5">
              <Smartphone className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
              <span>
                {language === 'gu'
                  ? 'જ્યારે સક્ષમ હોય, ત્યારે ઉચ્ચ-રિઝોલ્યુશન મીડિયા સંકુચિત થાય છે અને ગ્રામીણ કનેક્ટિવિટી માટે આવશ્યક ડેટા ઑફલાઇન સંગ્રહિત થાય છે.'
                  : language === 'hi'
                  ? 'सक्रिय होने पर, उच्च-रिज़ॉल्यूशन मीडिया संपीड़ित होता है और ग्रामीण कनेक्टिविटी के लिए आवश्यक डेटा ऑफ़लाइन कैश किया जाता है।'
                  : 'When enabled, high-resolution product media is compressed, animations are minimized, and essential export data is cached offline for rural connectivity.'}
              </span>
            </div>
          </div>

          {/* 4. Session & Logout */}
          <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-red-950 flex items-center gap-1.5">
                <LogOut className="h-4 w-4 text-red-600" />
                {t('settings.logout', language)}
              </h3>
              <p className="text-xs text-red-700/80 mt-0.5">
                {t('settings.logoutDesc', language)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t('settings.logout', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
