import { useState, useMemo, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, CheckCircle, Save, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';

const VERIFICATION_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
  PENDING_VERIFICATION: { label: 'Pending Verification', color: 'text-amber-700', bg: 'bg-amber-100' },
  VERIFIED: { label: 'Verified', color: 'text-blue-700', bg: 'bg-blue-100' },
  ACTIVE: { label: 'Active', color: 'text-[var(--color-success)]', bg: 'bg-green-100' },
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
] as const;

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { products, documents, language, setLanguage, addToast } = useAppStore();
  const seller = useMemo(() => SELLERS.find((s) => s.userId === user?.id), [user?.id]);
  const isSeller = !!seller;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [location, setLocation] = useState(user?.location ?? '');

  useEffect(() => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setLocation(user?.location ?? '');
  }, [user]);

  const sellerProducts = useMemo(
    () => products.filter((p) => p.sellerId === seller?.id),
    [products, seller?.id],
  );

  const sellerDocs = useMemo(
    () => documents.filter((d) => d.sellerId === seller?.id),
    [documents, seller?.id],
  );

  const docsVerified = sellerDocs.filter((d) => d.status === 'VERIFIED').length;

  const readiness = seller?.exportReadiness ?? 0;

  const handleSave = () => {
    updateProfile({ name, phone, location });
    setEditing(false);
    addToast({ type: 'success', message: 'Profile updated successfully!' });
  };

  if (!user) return null;

  const vBadge = VERIFICATION_BADGES[seller?.verificationStatus ?? 'DRAFT'] ?? VERIFICATION_BADGES.DRAFT;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.profile.title', language)}</h2>
        <p className="text-gray-500">{t('seller.profile.subtitle', language)}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              {isSeller && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${vBadge.bg} ${vBadge.color}`}>
                  {vBadge.label}
                </span>
              )}
            </div>
            {seller && (
              <p className="text-sm text-gray-500 mt-1">{seller.businessName} · {seller.businessType}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t('seller.profile.businessInfo', language)}</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-[var(--color-primary)] font-medium hover:underline"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          {editing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </>
          ) : (
            <>
              <InfoRow icon={User} label="Owner Name" value={user.name} />
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Phone" value={user.phone} />
              <InfoRow icon={MapPin} label="Location" value={user.location} />
              {seller && (
                <>
                  <InfoRow icon={Shield} label="Business Name" value={seller.businessName} />
                  <InfoRow icon={Shield} label="Business Type" value={seller.businessType} />
                  <InfoRow icon={MapPin} label="Address" value={`${seller.address}, ${seller.district}, ${seller.state} - ${seller.pinCode}`} />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isSeller && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.profile.exportOverview', language)}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-[var(--color-soft-gray)] rounded-xl p-4">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{readiness}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('seller.profile.readinessScore', language)}</p>
          </div>
          <div className="bg-[var(--color-soft-gray)] rounded-xl p-4">
            <p className="text-2xl font-bold text-[var(--color-primary)]">{sellerProducts.length}</p>
            <p className="text-xs text-gray-500 mt-1">Products</p>
          </div>
          <div className="bg-[var(--color-soft-gray)] rounded-xl p-4">
            <p className="text-2xl font-bold text-[var(--color-success)]">{docsVerified}</p>
            <p className="text-xs text-gray-500 mt-1">{t('seller.profile.docsVerified', language)}</p>
          </div>
        </div>
      </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.profile.accountSettings', language)}</h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4" />
              {t('settings.language', language)}
            </label>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code as 'en' | 'hi' | 'gu')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    language === l.code
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
              <span>{t('settings.emailVerified', language)} · {t('settings.lastLogin', language)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
