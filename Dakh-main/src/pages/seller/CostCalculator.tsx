import React, { useState } from 'react';
import { Calculator, Package, Plane, FileText, Info } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { t } from '../../i18n/translations';

export default function CostCalculator() {
  const [calculating, setCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { language } = useAppStore();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setShowResult(false);
    setTimeout(() => {
      setCalculating(false);
      setShowResult(true);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.costCalculator.title', language)}</h2>
        <p className="text-gray-500">{t('seller.costCalculator.subtitle', language)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.costCalculator.value', language)}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input type="number" required defaultValue="2000" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.costCalculator.weight', language)}</label>
                <input type="number" step="0.1" required defaultValue="0.8" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.costCalculator.destination', language)}</label>
              <select required defaultValue="DE" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <option value="">Select Destination</option>
                <option value="DE">Germany</option>
                <option value="US">USA</option>
                <option value="UK">United Kingdom</option>
                <option value="AE">UAE</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                <input type="number" defaultValue="20" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                <input type="number" defaultValue="15" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input type="number" defaultValue="10" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={calculating}
              className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              {calculating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Calculator className="h-5 w-5 mr-2" />
                  {t('seller.costCalculator.estimate', language)}
                </>
              )}
            </button>
          </form>
        </div>

        <div>
          {showResult ? (
            <div className="bg-white rounded-xl shadow-md border border-[var(--color-primary)] p-6 sticky top-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4 border-b pb-2">Estimated Cost</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><Package className="h-4 w-4 mr-2" /> Product Value</span>
                  <span className="font-medium">₹2,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><FileText className="h-4 w-4 mr-2" /> Packaging</span>
                  <span className="font-medium">₹120</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><Plane className="h-4 w-4 mr-2" /> Estimated Shipping</span>
                  <span className="font-medium">₹850</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center"><Info className="h-4 w-4 mr-2" /> Additional Charges</span>
                  <span className="font-medium">₹180</span>
                </div>
                
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Estimated Total</span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">₹3,150</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                <span className="block font-semibold mb-1">Estimated Delivery:</span>
                7–12 business days (India Post International)
              </div>

              <div className="mt-4 text-xs text-center text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                <span className="font-semibold text-gray-700">Prototype Estimate</span><br/>
                Rates are simulated for demonstration purposes.
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Calculator className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Enter details and calculate to see the estimated export cost.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
