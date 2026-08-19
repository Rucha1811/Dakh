import { useState, useMemo } from 'react';
import { Search, Package } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';

export default function AdminProducts() {
  const allProducts = useAppStore(s => s.products);
  const language = useAppStore(s => s.language);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(allProducts.map(p => p.category)))], [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [allProducts, search, catFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.productManagement', language)}</h2>
        <p className="text-gray-500">{t('admin.viewManage', language)}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium hidden md:table-cell">Weight</th>
                <th className="p-4 font-medium">Seller</th>
                <th className="p-4 font-medium">Export Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const seller = SELLERS.find(s => s.id === p.sellerId);
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="truncate max-w-[180px]">{p.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{p.category}</td>
                    <td className="p-4 text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">{p.weight} kg</td>
                    <td className="p-4 text-gray-600">{seller?.businessName ?? 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.exportStatus === 'READY' || p.exportStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        p.exportStatus === 'NOT_STARTED' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {p.exportStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
