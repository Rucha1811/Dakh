import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BadgeCheck, Package, Globe } from 'lucide-react';
import { PRODUCTS, SELLERS, PRODUCT_CATEGORIES, COUNTRIES } from '../data/mockData';
import ProductImage from '../components/ProductImage';

const CATEGORY_COLORS: Record<string, string> = {
  Handicrafts: 'var(--color-brand-red)',
  Textiles: '#7B1FA2',
  'Home Decor': 'var(--color-accent-amber)',
  Jewellery: '#00838F',
  'Food Products': 'var(--color-success)',
  'Traditional Products': '#AD1457',
  'Eco-Friendly Products': '#2E7D32',
  Art: '#E65100',
  'Fashion Accessories': '#4527A0',
};

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const getSellerName = (sellerId: string) => {
    const seller = SELLERS.find((s) => s.id === sellerId);
    return seller?.businessName ?? 'Unknown Seller';
  };

  const getCountryFlag = (name: string) => {
    const c = COUNTRIES.find((ct) => ct.name === name);
    return c?.flag ?? '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[var(--color-primary)] pt-14 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Global Marketplace
          </h1>
          <p className="mt-3 text-white/60 text-lg">
            Discover authentic Indian products ready for export.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all"
          />
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              !activeCategory
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mt-6 text-sm text-gray-400 font-medium">
          {filtered.length} product{filtered.length !== 1 && 's'} found
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="mt-4 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 w-full animate-pulse bg-gray-200" />
                <div className="p-5">
                  <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded mb-2" />
                  <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded mb-4" />
                  <div className="flex justify-between items-end">
                    <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
                    <div className="animate-pulse bg-gray-200 h-3 w-12 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <div className="mt-4 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              {/* Image placeholder */}
              <div
                className="h-48 w-full flex items-center justify-center relative"
                style={{ backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[product.category] ?? 'var(--color-primary)'} 12%, white)` }}
              >
                <ProductImage category={product.category} name={product.name} size="lg" />
                {product.exportStatus === 'READY' && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-[var(--color-success)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <BadgeCheck className="w-3 h-3" />
                    Export Ready
                  </span>
                )}
                {product.destinationCountry && (
                  <span className="absolute top-3 left-3 text-lg" title={product.destinationCountry}>
                    {getCountryFlag(product.destinationCountry)}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[var(--color-primary)] group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="mt-1.5 text-xs text-gray-400 font-medium">{getSellerName(product.sellerId)}</p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-[var(--color-primary)]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ unit</span>
                  </div>
                  <span className="text-xs text-gray-400">{product.weight} kg</span>
                </div>

                {product.destinationCountry && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <Globe className="w-3 h-3" />
                    Dest: {product.destinationCountry}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-400 font-medium">No products match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
