import { Link } from 'react-router-dom';
import {
  UserPlus,
  PackageSearch,
  ClipboardCheck,
  FileCheck,
  Building2,
  Send,
  MapPin,
  Plane,
  PartyPopper,
  ArrowRight,
  Zap,
  Headphones,
  WifiOff,
} from 'lucide-react';
import { EXPORT_JOURNEY_STEPS } from '../data/mockData';

const STEP_ICONS = [UserPlus, PackageSearch, ClipboardCheck, FileCheck, Building2, Send, MapPin, Plane, PartyPopper];

const ACCESS_MODES = [
  {
    icon: Zap,
    title: 'Self-Service',
    desc: 'Full platform access for digitally confident sellers. Manage products, documents, and shipments independently from anywhere.',
    color: 'var(--color-primary)',
  },
  {
    icon: Headphones,
    title: 'DNK Assisted',
    desc: 'Visit your nearest Dak Ghar Niryat Kendra for in-person help with every step — from registration to shipping.',
    color: 'var(--color-brand-red)',
  },
  {
    icon: WifiOff,
    title: 'Low-Bandwidth',
    desc: 'SMS and USSD-based workflow for areas with limited internet. Start on your phone, complete at the DNK.',
    color: 'var(--color-accent-amber)',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[var(--color-primary)] pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How Niryat Saathi Works
          </h1>
          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            A step-by-step guided journey that takes your product from a local workshop to a global customer's doorstep.
          </p>
        </div>
      </section>

      {/* 9-Step Export Journey */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight text-center">
            The 9-Step Export Journey
          </h2>
          <p className="mt-3 text-gray-500 text-center max-w-xl mx-auto">
            Every export follows these steps. The platform and DNK operators guide you at each stage.
          </p>

          <div className="mt-14 relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />

            <div className="space-y-8">
              {EXPORT_JOURNEY_STEPS.map((step) => {
                const Icon = STEP_ICONS[step.step - 1] || PackageSearch;
                return (
                  <div key={step.step} className="relative flex gap-6 sm:gap-8 items-start">
                    {/* Step circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-brand-red)] text-white flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-[var(--color-soft-gray)] border border-gray-100 rounded-2xl p-6 flex-1 hover:border-[var(--color-primary)]/20 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-[var(--color-brand-red)] bg-red-50 px-2.5 py-0.5 rounded-full">
                          Step {step.step}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{step.responsible}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-primary)]">{step.title}</h3>
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Access Modes */}
      <section className="bg-[var(--color-off-white)] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] tracking-tight text-center">
            Three Ways to Access the Platform
          </h2>
          <p className="mt-3 text-gray-500 text-center max-w-xl mx-auto">
            Choose the mode that fits your connectivity, skills, and comfort level.
          </p>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {ACCESS_MODES.map((mode) => (
              <div key={mode.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-5" style={{ backgroundColor: `color-mix(in srgb, ${mode.color} 10%, white)` }}>
                  <mode.icon className="w-7 h-7" style={{ color: mode.color }} />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-primary)]">{mode.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">
            Ready to start your export journey?
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Create your account and begin in under 5 minutes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 mt-8 bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-red-900/20"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
