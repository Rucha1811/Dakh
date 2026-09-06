import { useState, useMemo } from 'react';
import { ShieldAlert, Info, CheckCircle, XCircle, FileText } from 'lucide-react';
import { t } from '../../i18n/translations';
import { useAppStore } from '../../store/appStore';
import { COMPLIANCE_RULES, PRODUCT_CATEGORIES, COUNTRIES } from '../../data/mockData';

export default function AdminCompliance() {
  const language = useAppStore(s => s.language);
  const [catFilter, setCatFilter] = useState('All');
  const [destFilter, setDestFilter] = useState('All');
  const [rules, setRules] = useState(COMPLIANCE_RULES);

  const [checkCategory, setCheckCategory] = useState('');
  const [checkDestination, setCheckDestination] = useState('');
  const [checkResults, setCheckResults] = useState<typeof COMPLIANCE_RULES>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const categories = useMemo(() => ['All', ...PRODUCT_CATEGORIES], []);
  const destinations = useMemo(() => ['All', ...COUNTRIES.map((c) => c.name)], []);

  const filtered = useMemo(() => {
    let list = rules;
    if (catFilter !== 'All') list = list.filter((r) => r.productCategory === catFilter);
    if (destFilter !== 'All') list = list.filter((r) => r.destination === destFilter);
    return list;
  }, [rules, catFilter, destFilter]);

  const toggleStatus = (id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r,
      ),
    );
  };

  const handleCheck = () => {
    if (!checkCategory || !checkDestination) return;
    const results = COMPLIANCE_RULES.filter(
      (r) => r.productCategory === checkCategory && r.destination === checkDestination
    );
    setCheckResults(results);
    setHasChecked(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.compliance', language)}</h2>
        <p className="text-gray-500">Manage export compliance requirements by product and destination.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-[var(--color-accent-amber)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Demo rules — not legal advice</p>
          <p className="text-xs text-amber-700 mt-0.5">
            These are simulated compliance rules for prototype demonstration purposes only.
            Always consult official trade authorities for actual export requirements.
          </p>
        </div>
      </div>

      {/* Interactive Compliance Checker */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">{t('admin.compliance.checker', language)}</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.compliance.selectCategory', language)}</label>
            <select
              value={checkCategory}
              onChange={(e) => setCheckCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">{t('admin.compliance.selectCategory', language)}</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.compliance.selectDestination', language)}</label>
            <select
              value={checkDestination}
              onChange={(e) => setCheckDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="">{t('admin.compliance.selectDestination', language)}</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCheck}
            disabled={!checkCategory || !checkDestination}
            className="px-6 py-2 bg-[var(--color-brand-red)] text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {t('admin.compliance.check', language)}
          </button>
        </div>

        {hasChecked && (
          <div className="mt-6">
            {checkResults.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Info className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">{t('admin.compliance.noRules', language)}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkResults.map((rule) => (
                  <div
                    key={rule.id}
                    className={`rounded-lg border p-4 ${
                      rule.status === 'Active'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {rule.productCategory}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {rule.destination}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{rule.requirement}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <FileText className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">{t('admin.compliance.requiredDocs', language)}: {rule.document}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        rule.status === 'Active'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rule.status === 'Active' ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        {rule.status === 'Active' ? t('admin.compliance.restrictions', language) : 'No restrictions'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
        <select
          value={destFilter}
          onChange={(e) => setDestFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          {destinations.map((d) => (
            <option key={d} value={d}>{d === 'All' ? 'All Destinations' : d}</option>
          ))}
        </select>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <Info className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No compliance rules found</p>
          </div>
        )}
        {filtered.map((rule) => (
          <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {rule.productCategory}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {rule.destination}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 mt-2">{rule.requirement}</p>
                <p className="text-xs text-gray-500 mt-1">Document: {rule.document}</p>
              </div>
              <button
                onClick={() => toggleStatus(rule.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  rule.status === 'Active'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {rule.status}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Destination</th>
              <th className="p-4 font-medium">Requirement</th>
              <th className="p-4 font-medium">Document</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">No compliance rules found</td>
              </tr>
            )}
            {filtered.map((rule) => (
              <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {rule.productCategory}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {rule.destination}
                  </span>
                </td>
                <td className="p-4 text-gray-700 max-w-[250px]">{rule.requirement}</td>
                <td className="p-4 text-gray-600">{rule.document}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(rule.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      rule.status === 'Active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {rule.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[var(--color-soft-gray)] rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500">
          Compliance rules shown are simulated for prototype demonstration. Always verify requirements with official authorities before exporting.
        </p>
      </div>
    </div>
  );
}
