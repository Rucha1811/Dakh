import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Package,
  Ruler,
  Weight,
  MapPin,
  Tag,
  Layers,
  Sparkles,
  Truck,
  ShieldCheck,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';
import { PRODUCTS, SELLERS, COUNTRIES } from '../data/mockData';
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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-[var(--color-primary)]">Product not found</h2>
          <Link to="/marketplace" className="mt-4 inline-block text-sm text-[var(--color-brand-red)] font-medium hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const seller = SELLERS.find((s) => s.id === product.sellerId);
  const catColor = CATEGORY_COLORS[product.category] ?? 'var(--color-primary)';
  const country = COUNTRIES.find((c) => c.name === product.destinationCountry);

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-gray-900 dark:text-gray-100">
      {/* Top bar */}
      <div className="bg-[var(--color-soft-gray)] dark:bg-[#0F172A] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div>
            <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 relative">
              <ProductImage
                src={galleryImages[selectedImg] || galleryImages[0]}
                category={product.category}
                name={product.name}
                size="full"
                className="w-full h-full"
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="mt-4 flex items-center gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImg(i)}
                    className={`h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImg === i
                        ? 'border-[var(--color-brand-red)] ring-2 ring-red-200 dark:ring-red-900/50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ color: catColor, borderColor: `color-mix(in srgb, ${catColor} 30%, white)`, backgroundColor: `color-mix(in srgb, ${catColor} 8%, white)` }}>
                {product.category}
              </span>
              {product.exportStatus === 'READY' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[var(--color-success)] px-3 py-1 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Export Ready
                </span>
              )}
              {product.destinationCountry && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {country?.flag} {product.destinationCountry}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Seller */}
            {seller && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{seller.businessName}</span>
                {(seller.verificationStatus === 'ACTIVE' || seller.verificationStatus === 'VERIFIED') && (
                  <BadgeCheck className="w-4 h-4 text-[var(--color-success)]" />
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--color-primary)] dark:text-amber-400">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-400">/ unit</span>
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specs grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <Weight className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Weight</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">{product.weight} kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <Ruler className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Dimensions</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Origin</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">{product.countryOfOrigin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <Layers className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Material</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">{product.material ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Intended Use</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">{product.intendedUse ?? '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-soft-gray)] dark:bg-[#151F30] border border-transparent dark:border-gray-800 rounded-xl px-4 py-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Packaging</p>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">{product.packagingType}</p>
                </div>
              </div>
            </div>

            {/* Shipping estimate */}
            <div className="mt-6 bg-[var(--color-off-white)] dark:bg-[#151F30] border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-start gap-3">
              <Truck className="w-5 h-5 text-[var(--color-accent-amber)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">Estimated Shipping</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {product.exportStatus === 'READY'
                    ? `7–14 business days via India Post International${product.destinationCountry ? ` to ${product.destinationCountry}` : ''}`
                    : 'Shipping details will be available once export is ready.'}
                </p>
              </div>
            </div>

            {/* Compliance note */}
            {product.hsCode && (
              <div className="mt-3 bg-[var(--color-off-white)] dark:bg-[#151F30] border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--color-success)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-primary)] dark:text-white">Compliance</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    HS Code: {product.hsCode}. Export documents and compliance requirements are managed through the DNK workflow.
                  </p>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-2 bg-[var(--color-brand-red)] hover:bg-red-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-900/20">
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </button>
              <button className="inline-flex items-center gap-2 border-2 border-[var(--color-primary)] dark:border-gray-600 text-[var(--color-primary)] dark:text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[var(--color-primary)] dark:hover:bg-gray-800 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
                Ask About Export
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-extrabold text-[var(--color-primary)] dark:text-white tracking-tight">
              Related Products
            </h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151F30] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${CATEGORY_COLORS[rp.category] ?? 'var(--color-primary)'} 10%, white)` }}
                  >
                    <ProductImage category={rp.category} name={rp.name} size="md" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--color-primary)] dark:text-white group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2 text-sm">
                      {rp.name}
                    </h3>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-lg font-extrabold text-[var(--color-primary)] dark:text-amber-400">
                        ₹{rp.price.toLocaleString('en-IN')}
                      </span>
                      {rp.exportStatus === 'READY' && (
                        <span className="text-[10px] font-bold text-white bg-[var(--color-success)] px-2 py-0.5 rounded-full">
                          Export Ready
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
