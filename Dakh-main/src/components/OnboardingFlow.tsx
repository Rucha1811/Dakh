import { useState } from 'react';
import { Package, FileText, Truck, CheckCircle, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const STEPS = [
  {
    icon: Package,
    title: 'List Your Products',
    description: 'Add your products with details like price, weight, and category to prepare for export.',
    link: '/seller/products/new',
  },
  {
    icon: FileText,
    title: 'Generate Documents',
    description: 'Auto-generate IEC, shipping bills, and compliance documents needed for export.',
    link: '/seller/documents',
  },
  {
    icon: CheckCircle,
    title: 'Check Export Readiness',
    description: 'Verify your readiness score and complete all required steps before shipping.',
    link: '/seller/readiness',
  },
  {
    icon: Truck,
    title: 'Ship & Track',
    description: 'Create shipments through DNK centers and track them in real-time.',
    link: '/seller/shipments',
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useAppStore();

  const current = STEPS[step];
  const Icon = current.icon;

  const handleDismiss = () => {
    localStorage.setItem('ns_onboarding_seen', 'true');
    setDismissed(true);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
      navigate(current.link);
    }
  };

  const handleSkip = () => {
    handleDismiss();
    addToast({ type: 'info', message: 'You can access these features from the sidebar anytime.' });
  };

  if (dismissed || localStorage.getItem('ns_onboarding_seen') === 'true') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'bg-[var(--color-brand-red)] w-8' : i < step ? 'bg-[var(--color-success)] w-2' : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </div>

        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-soft-gray)] flex items-center justify-center">
            <Icon className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{current.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-red)] text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            {step < STEPS.length - 1 ? (
              <>Next <ArrowRight className="h-4 w-4" /></>
            ) : (
              <>Get Started <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Skip Tour
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
