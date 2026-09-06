import { Link } from 'react-router-dom';
import {
  Globe,
  FileText,
  ShieldCheck,
  Truck,
  Wifi,
  Languages,
  Eye,
  UserPlus,
  PackageSearch,
  ClipboardCheck,
  FileCheck,
  Building2,
  Send,
  MapPin,
  PartyPopper,
  Store,
  ShoppingCart,
  Globe2,
  ArrowRight,
  Zap,
  Headphones,
  WifiOff,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { t } from '../i18n/translations';
import { useAppStore } from '../store/appStore';

const ROUTE_NODES = [
  { icon: Store, label: 'Seller', color: 'var(--color-primary)' },
  { icon: Building2, label: 'DNK', color: 'var(--color-brand-red)' },
  { icon: PackageSearch, label: 'India Post', color: 'var(--color-accent-amber)' },
  { icon: ShieldCheck, label: 'Customs', color: 'var(--color-success)' },
  { icon: Globe, label: 'Global Customer', color: 'var(--color-primary)' },
];

const PROBLEMS = [
  { icon: FileText, title: 'Complex Documentation', desc: 'Invoices, packing lists, certificates of origin — the paperwork alone stops most sellers.' },
  { icon: ShieldCheck, title: 'Unclear Compliance', desc: 'Every country has different rules. Knowing what applies to your product is nearly impossible alone.' },
  { icon: Truck, title: 'Shipping Uncertainty', desc: 'No clear idea of costs, timelines, or which carrier to trust for international delivery.' },
  { icon: Wifi, title: 'Limited Digital Skills', desc: 'Many artisans and rural sellers are not comfortable navigating complex online export portals.' },
  { icon: Languages, title: 'Language Barriers', desc: 'Export portals and documentation often require English proficiency that many sellers lack.' },
  { icon: Eye, title: 'Lack of Visibility', desc: 'Once shipped, sellers lose track of their package with no reliable tracking updates.' },
];

const SOLUTION_STEPS = [
  { num: 1, icon: UserPlus, title: 'Register', desc: 'Create your seller profile with basic details.' },
  { num: 2, icon: PackageSearch, title: 'Add Product', desc: 'List your product with photos, weight, and dimensions.' },
  { num: 3, icon: ClipboardCheck, title: 'Check Readiness', desc: 'Get an export readiness score and improvement tips.' },
  { num: 4, icon: FileCheck, title: 'Prepare Documents', desc: 'Upload invoices, certificates, and compliance docs.' },
  { num: 5, icon: Building2, title: 'Visit DNK', desc: 'Get physical verification and packaging help at your nearest DNK.' },
  { num: 6, icon: Send, title: 'Ship', desc: 'Book your shipment through India Post with guided support.' },
  { num: 7, icon: MapPin, title: 'Track', desc: 'Real-time tracking from pickup to international delivery.' },
  { num: 8, icon: PartyPopper, title: 'Deliver', desc: 'Your product reaches the global customer successfully.' },
];

const ACCESS_MODES = [
  {
    icon: Zap,
    title: 'Self-Service',
    subtitle: 'For digitally confident sellers',
    desc: 'Full platform access. Manage your products, documents, shipments, and tracking independently through the web dashboard.',
    features: ['Full dashboard access', 'Real-time tracking', 'Document management'],
    accent: 'var(--color-primary)',
  },
  {
    icon: Headphones,
    title: 'DNK Assisted',
    subtitle: 'For sellers who need hands-on help',
    desc: 'Visit your nearest Dak Ghar Niryat Kendra. An operator walks you through every step — registration to shipping.',
    features: ['In-person guidance', 'Document help', 'Packaging & shipping'],
    accent: 'var(--color-brand-red)',
  },
  {
    icon: WifiOff,
    title: 'Low-Bandwidth',
    subtitle: 'For poor connectivity areas',
    desc: 'SMS and USSD-based workflow for areas with limited internet. Start on your phone, finish at the DNK.',
    features: ['SMS notifications', 'Offline drafts', 'Voice support'],
    accent: 'var(--color-accent-amber)',
  },
];

const CHANNELS_IN = [
  { icon: Store, label: 'Amazon' },
  { icon: ShoppingCart, label: 'ONDC' },
  { icon: Globe2, label: 'Own Website' },
  { icon: Globe, label: 'Direct Buyer' },
];

const CHANNELS_OUT = [
  'Export Readiness',
  'Documentation',
  'DNK Verification',
  'Shipping',
  'Tracking',
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* ───── NAV ───── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white font-extrabold text-sm tracking-tight">NS</span>
            </div>
            <span className="text-lg font-bold text-[var(--color-primary)] tracking-tight">Niryat Saathi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-[var(--color-primary)] transition-colors">{t('landing.nav.about', language)}</a>
            <a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors">{t('landing.howItWorksTitle', language)}</a>
            <a href="#marketplace" className="hover:text-[var(--color-primary)] transition-colors">Marketplace</a>
            <Link to="/faq" className="hover:text-[var(--color-primary)] transition-colors">FAQ & Feedback</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors px-3 py-2">
              {t('auth.login', language)}
            </Link>
            <Link to="/login" className="text-sm font-semibold text-white bg-[var(--color-brand-red)] hover:bg-red-700 px-5 py-2.5 rounded-lg transition-colors">
              {t('landing.cta.button', language)}
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">{t('landing.nav.about', language)}</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">{t('landing.howItWorksTitle', language)}</a>
            <a href="#marketplace" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">Marketplace</a>
            <Link to="/faq" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-600 hover:text-[var(--color-primary)]">FAQ & Feedback</Link>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link to="/login" className="text-sm font-medium text-gray-600 py-2">{t('auth.login', language)}</Link>
              <Link to="/login" className="text-sm font-semibold text-white bg-[var(--color-brand-red)] px-5 py-2.5 rounded-lg text-center">{t('landing.cta.button', language)}</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ───── HERO ───── */}
      <section id="about" className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-50 text-[var(--color-brand-red)] text-xs font-semibold px-3 py-1 rounded-full border border-red-100 mb-6">
                SIH Prototype
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-primary)] leading-[1.1] tracking-tight">
                {t('landing.hero', language)}
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
                {t('landing.subtitle', language)}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-900/20"
                >
                  {t('landing.startJourney', language)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold px-7 py-3.5 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  {t('landing.howItWorks', language)}
                </a>
              </div>
            </div>

            {/* Route illustration */}
            <div className="hidden lg:flex flex-col items-center gap-0">
              {ROUTE_NODES.map((node, i) => (
                <div key={node.label} className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: node.color }}
                    >
                      <node.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-bold text-[var(--color-primary)]">{node.label}</span>
                  </div>
                  {i < ROUTE_NODES.length - 1 && (
                    <div className="flex flex-col items-center my-1">
                      <div className="w-px h-6 bg-gray-300" />
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-5 border-l-transparent border-r-transparent border-t-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="bg-[var(--color-off-white)] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
              {t('landing.features', language)}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, titleKey: 'landing.feature1Title', descKey: 'landing.feature1Desc' },
              { icon: ClipboardCheck, titleKey: 'landing.feature2Title', descKey: 'landing.feature2Desc' },
              { icon: FileCheck, titleKey: 'landing.feature3Title', descKey: 'landing.feature3Desc' },
              { icon: Truck, titleKey: 'landing.feature4Title', descKey: 'landing.feature4Desc' },
            ].map((f) => (
              <div key={f.titleKey} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-[var(--color-brand-red)]" />
                </div>
                <h3 className="font-bold text-[var(--color-primary)]">{t(f.titleKey, language)}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(f.descKey, language)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── SOLUTION (8 STEPS) ───── */}
      <section id="how-it-works" className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
              {t('landing.howItWorksTitle', language)}
            </h2>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTION_STEPS.map((s) => (
              <div key={s.num} className="relative bg-[var(--color-soft-gray)] rounded-2xl p-6 border border-gray-100 hover:border-[var(--color-primary)]/20 transition-colors group">
                <span className="absolute -top-3 -left-1 w-8 h-8 rounded-lg bg-[var(--color-brand-red)] text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {s.num}
                </span>
                <div className="mt-3">
                  <s.icon className="w-6 h-6 text-[var(--color-primary)] mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-[var(--color-primary)]">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── THREE ACCESS MODES ───── */}
      <section className="bg-[var(--color-off-white)] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
              Exporting for everyone
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Three ways to access the platform, depending on your needs.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {ACCESS_MODES.map((m) => (
              <div key={m.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `color-mix(in srgb, ${m.accent} 12%, white)` }}>
                  <m.icon className="w-6 h-6" style={{ color: m.accent }} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-primary)]">{m.title}</h3>
                <p className="text-sm font-medium text-gray-400 mt-1">{m.subtitle}</p>
                <p className="mt-4 text-sm text-gray-500 leading-relaxed flex-1">{m.desc}</p>
                <ul className="mt-6 space-y-2">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── DIFFERENTIATOR ───── */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
              One Export Journey. Multiple Selling Channels.
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Sell anywhere — Niryat Saathi handles the export complexity.
            </p>
          </div>

          <div className="mt-14 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
            {/* Channels In */}
            <div className="flex flex-col gap-4 items-end">
              {CHANNELS_IN.map((c) => (
                <div key={c.label} className="flex items-center gap-3 bg-[var(--color-soft-gray)] border border-gray-100 rounded-xl px-5 py-3 shadow-sm">
                  <c.icon className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-semibold text-[var(--color-primary)]">{c.label}</span>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center gap-1 text-[var(--color-brand-red)]">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="lg:hidden text-[var(--color-brand-red)]">
              <ArrowRight className="w-6 h-6 rotate-90" />
            </div>

            {/* Center Box */}
            <div className="bg-[var(--color-primary)] rounded-2xl px-10 py-12 text-center shadow-xl min-w-[220px]">
              <span className="text-white text-xl font-extrabold tracking-tight block">NIRYAT</span>
              <span className="text-[var(--color-accent-amber)] text-xl font-extrabold tracking-tight block">SAATHI</span>
              <div className="w-10 h-0.5 bg-white/30 mx-auto mt-4 mb-3 rounded-full" />
              <span className="text-white/60 text-xs font-medium">Export Platform</span>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex flex-col items-center gap-1 text-[var(--color-brand-red)]">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="lg:hidden text-[var(--color-brand-red)]">
              <ArrowRight className="w-6 h-6 rotate-90" />
            </div>

            {/* Channels Out */}
            <div className="flex flex-col gap-4 items-start">
              {CHANNELS_OUT.map((c) => (
                <div key={c} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-3 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-brand-red)]" />
                  <span className="text-sm font-semibold text-[var(--color-brand-red)]">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="bg-[var(--color-primary)] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('landing.cta.title', language)}
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-lg mx-auto">
            {t('landing.cta.desc', language)}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 mt-8 bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-red-900/30"
          >
            {t('landing.cta.button', language)}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-[var(--color-off-white)] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                  <span className="text-white font-extrabold text-xs tracking-tight">NS</span>
                </div>
                <span className="font-bold text-[var(--color-primary)]">Niryat Saathi</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t('landing.footer.desc', language)}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-primary)] mb-3">Links</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#about" className="hover:text-[var(--color-primary)] transition-colors">{t('landing.nav.about', language)}</a></li>
                <li><a href="#how-it-works" className="hover:text-[var(--color-primary)] transition-colors">{t('landing.howItWorksTitle', language)}</a></li>
                <li><Link to="/marketplace" className="hover:text-[var(--color-primary)] transition-colors">Marketplace</Link></li>
                <li><Link to="/faq" className="hover:text-[var(--color-primary)] transition-colors">FAQ & Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--color-primary)] mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-relaxed">
                SIH Prototype &bull; Demonstration System
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Designed around the Dak Ghar Niryat Kendra ecosystem
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Prototype integration &mdash; simulated APIs
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
