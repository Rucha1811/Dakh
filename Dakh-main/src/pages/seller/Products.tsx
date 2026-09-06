import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2, Package, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS, PRODUCT_CATEGORIES } from '../../data/mockData';
import ProductImage from '../../components/ProductImage';
import type { Product } from '../../data/mockData';
import { t } from '../../i18n/translations';

const EXPORT_STATUS_MAP: Record<Product['exportStatus'], { label: string; color: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'bg-gray-100 text-gray-600' },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-700' },
  READY: { label: 'Export Ready', color: 'bg-green-100 text-green-700' },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', color: 'bg-indigo-100 text-indigo-700' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
};

const CATEGORY_COLORS: Record<string, string> = {
  Handicrafts: 'bg-orange-100 text-orange-700',
  Textiles: 'bg-purple-100 text-purple-700',
  'Home Decor': 'bg-pink-100 text-pink-700',
  Jewellery: 'bg-yellow-100 text-yellow-700',
  'Food Products': 'bg-green-100 text-green-700',
  'Traditional Products': 'bg-red-100 text-red-700',
  'Eco-Friendly Products': 'bg-teal-100 text-teal-700',
  Art: 'bg-indigo-100 text-indigo-700',
  'Fashion Accessories': 'bg-cyan-100 text-cyan-700',
};

import { getSellerForUser } from '../../utils/sellerHelper';

export default function Products() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { products, deleteProduct, addToast, language } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const seller = useMemo(() => getSellerForUser(user), [user]);
  const sellerId = seller.id;

  const filtered = useMemo(() => {
    return products
      .filter((p) => p.sellerId === sellerId)
      .filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !categoryFilter || p.category === categoryFilter;
        return matchSearch && matchCategory;
      });
  }, [products, sellerId, search, categoryFilter]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProduct(deleteId);
    addToast({ type: 'success', message: 'Product deleted successfully' });
    setDeleteId(null);
  };

  const getPlaceholderColor = (name: string) => {
    const colors = [
      'from-orange-300 to-amber-400',
      'from-blue-300 to-indigo-400',
      'from-green-300 to-emerald-400',
      'from-pink-300 to-rose-400',
      'from-purple-300 to-violet-400',
      'from-teal-300 to-cyan-400',
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.products.title', language)}</h2>
          <p className="text-gray-500">{t('seller.products.subtitle', language)}</p>
        </div>
        <button
          onClick={() => navigate('/seller/products/new')}
          className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('seller.products.addNew', language)}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>No products found</p>
            </div>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex gap-3">
                <ProductImage src={p.images?.[0]} category={p.category} name={p.name} size="md" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${p.id}`} className="font-medium text-gray-900 text-sm hover:text-[var(--color-primary)] line-clamp-1">
                    {p.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500">{p.weight} kg</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500">Stock: {p.stock}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${EXPORT_STATUS_MAP[p.exportStatus].color}`}>
                      {EXPORT_STATUS_MAP[p.exportStatus].label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-50">
                <Link
                  to={`/product/${p.id}`}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => navigate(`/seller/products/new?edit=${p.id}`)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-accent-amber)] hover:bg-amber-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-brand-red)] hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Weight</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Export Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No products found</td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <ProductImage src={p.images?.[0]} category={p.category} name={p.name} size="sm" className="mr-3" />
                      <Link to={`/product/${p.id}`} className="font-medium text-gray-900 hover:text-[var(--color-primary)]">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[p.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900 font-medium">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-600">{p.weight} kg</td>
                  <td className="p-4 text-gray-600">{p.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${EXPORT_STATUS_MAP[p.exportStatus].color}`}>
                      {EXPORT_STATUS_MAP[p.exportStatus].label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/product/${p.id}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-primary)] hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => navigate(`/seller/products/new?edit=${p.id}`)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-accent-amber)] hover:bg-amber-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[var(--color-brand-red)] hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-50">
                <Trash2 className="h-5 w-5 text-[var(--color-brand-red)]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this product? All associated data will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[var(--color-brand-red)] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
