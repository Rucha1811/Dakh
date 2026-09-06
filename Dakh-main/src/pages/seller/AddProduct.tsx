import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Upload, Check, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS, COUNTRIES, PRODUCT_CATEGORIES, PRODUCTS } from '../../data/mockData';
import { getSellerForUser } from '../../utils/sellerHelper';
import { t } from '../../i18n/translations';

const STEPS = ['Basic Info', 'Physical', 'Images', 'Export Info', 'Review'];

interface FormData {
  name: string;
  category: string;
  description: string;
  price: string;
  currency: string;
  stock: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  packagingType: string;
  destinationCountry: string;
  hsCode: string;
  material: string;
  intendedUse: string;
}

const initialForm: FormData = {
  name: '',
  category: 'Handicrafts',
  description: '',
  price: '',
  currency: 'INR',
  stock: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  packagingType: 'Cardboard Box',
  destinationCountry: '',
  hsCode: '',
  material: '',
  intendedUse: '',
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { products: storeProducts, addProduct, updateProduct, addToast, language } = useAppStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const seller = getSellerForUser(user);
  const editId = searchParams.get('edit');
  const editProduct = editId ? storeProducts.find((p) => p.id === editId) : undefined;
  const isEditing = !!editProduct;

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        category: editProduct.category,
        description: editProduct.description,
        price: String(editProduct.price),
        currency: editProduct.currency,
        stock: String(editProduct.stock),
        weight: String(editProduct.weight),
        length: String(editProduct.dimensions?.length ?? ''),
        width: String(editProduct.dimensions?.width ?? ''),
        height: String(editProduct.dimensions?.height ?? ''),
        packagingType: editProduct.packagingType ?? 'Cardboard Box',
        destinationCountry: editProduct.destinationCountry ?? '',
        hsCode: editProduct.hsCode ?? '',
        material: editProduct.material ?? '',
        intendedUse: editProduct.intendedUse ?? '',
      });
      if (editProduct.images && editProduct.images.length > 0) {
        setUploadedImages(editProduct.images);
      }
    }
  }, [editProduct]);

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) newErrors.name = 'Product name is required';
      if (!form.price || Number(form.price) <= 0) newErrors.price = 'Valid price is required';
      if (!form.stock || Number(form.stock) <= 0) newErrors.stock = 'Stock quantity is required';
      if (!form.description.trim()) newErrors.description = 'Description is required';
    } else if (s === 2) {
      if (!form.weight || Number(form.weight) <= 0) newErrors.weight = 'Weight is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setValidatedSteps((prev) => new Set(prev).add(step));
      setStep((s) => Math.min(s + 1, 5));
    }
  };

  const handleSubmit = () => {
    if (!seller) return;
    const productData = {
      id: isEditing ? editProduct!.id : `PRD${Date.now()}`,
      sellerId: seller.id,
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      currency: form.currency,
      weight: Number(form.weight),
      dimensions: {
        length: Number(form.length) || 0,
        width: Number(form.width) || 0,
        height: Number(form.height) || 0,
      },
      packagingType: form.packagingType,
      countryOfOrigin: 'India',
      images: uploadedImages.length > 0 ? uploadedImages : (isEditing ? editProduct!.images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80']),
      stock: Number(form.stock),
      exportStatus: isEditing ? editProduct!.exportStatus : ('NOT_STARTED' as const),
      destinationCountry: form.destinationCountry || undefined,
      hsCode: form.hsCode || undefined,
      material: form.material || undefined,
      intendedUse: form.intendedUse || undefined,
      createdAt: isEditing ? editProduct!.createdAt : new Date().toISOString().split('T')[0],
    };
    if (isEditing) {
      updateProduct(editProduct!.id, productData);
      addToast({ type: 'success', message: 'Product updated successfully!' });
    } else {
      addProduct(productData);
      addToast({ type: 'success', message: 'Product added successfully!' });
    }
    navigate('/seller/products');
  };

  const ErrorMsg = ({ field }: { field: keyof FormData }) =>
    errors[field] ? (
      <p className="text-xs text-[var(--color-brand-red)] mt-1 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">{isEditing ? t('seller.addProduct.editTitle', language) : t('seller.addProduct.title', language)}</h2>
        <p className="text-gray-500">Provide details to prepare your product for export.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Step {step} of 5</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-[var(--color-success)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isFailed = errors && Object.keys(errors).length > 0 && step === num;
            return (
              <div key={num} className="flex items-center flex-shrink-0 last:flex-shrink">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step > num
                        ? 'bg-[var(--color-success)] text-white'
                        : step === num
                          ? isFailed
                            ? 'bg-[var(--color-brand-red)] text-white ring-2 ring-red-300'
                            : 'bg-[var(--color-primary)] text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > num ? <Check className="h-4 w-4" /> : num}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 font-medium hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-1 w-8 sm:w-12 mx-1 sm:mx-2 rounded transition-all duration-300 ${step > num ? 'bg-[var(--color-success)]' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-5">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">1. Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.name', language)} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Handcrafted Wooden Box"
                />
                <ErrorMsg field="name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.category', language)} *</label>
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.description', language)} *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Describe the product and its cultural significance..."
                />
                <ErrorMsg field="description" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.price', language)} *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="2000"
                  />
                  <ErrorMsg field="price" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => update('currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.stock', language)} *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => update('stock', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Available stock"
                  />
                  <ErrorMsg field="stock" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">2. Physical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller.addProduct.weight', language)} *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="0.8"
                  />
                  <ErrorMsg field="weight" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
                  <select
                    value={form.packagingType}
                    onChange={(e) => update('packagingType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option>Cardboard Box</option>
                    <option>Wooden Crate</option>
                    <option>Bubble Wrap Only</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                  <input
                    type="number"
                    value={form.length}
                    onChange={(e) => update('length', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                  <input
                    type="number"
                    value={form.width}
                    onChange={(e) => update('width', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">3. Product Images</h3>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setUploadedImages((prev) => [...prev, ev.target!.result as string]);
                        addToast({ message: `Image "${file.name}" uploaded successfully!`, type: 'success' });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group shadow-sm bg-slate-100">
                      <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center text-xs shadow-md transition font-bold cursor-pointer"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-rose-500 rounded-2xl p-8 text-center hover:bg-rose-50/20 transition-all cursor-pointer"
              >
                <Upload className="mx-auto h-10 w-10 text-rose-500 mb-2" />
                <p className="text-sm font-bold text-gray-800">Click to upload product image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB (Uploads and previews instantly)</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">4. Export Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Country</label>
                <select
                  value={form.destinationCountry}
                  onChange={(e) => update('destinationCountry', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Select a country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Selecting a country helps provide specific compliance rules.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                <input
                  type="text"
                  value={form.hsCode}
                  onChange={(e) => update('hsCode', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. 442090"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  value={form.material}
                  onChange={(e) => update('material', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Teak Wood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intended Use</label>
                <input
                  type="text"
                  value={form.intendedUse}
                  onChange={(e) => update('intendedUse', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="e.g. Home Decor"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">5. Review</h3>
              <div className="bg-[var(--color-soft-gray)] p-4 rounded-lg space-y-3 text-sm">
                {([
                  ['Name', form.name || '—'],
                  ['Category', form.category],
                  ['Description', form.description || '—'],
                  ['Price', form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—'],
                  ['Currency', form.currency],
                  ['Stock', form.stock || '—'],
                  ['Weight', form.weight ? `${form.weight} kg` : '—'],
                  ['Dimensions', `${form.length || '0'} × ${form.width || '0'} × ${form.height || '0'} cm`],
                  ['Packaging', form.packagingType],
                  ['Destination', form.destinationCountry || '—'],
                  ['HS Code', form.hsCode || '—'],
                  ['Material', form.material || '—'],
                  ['Intended Use', form.intendedUse || '—'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/seller/products'))}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            {step > 1 && <ChevronLeft className="h-5 w-5 mr-1" />}
            {step === 1 ? 'Cancel' : t('common.back', language)}
          </button>
          <div className="flex space-x-3">
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center"
              >
                {t('common.next', language)}
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-[var(--color-success)] text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <Check className="h-5 w-5 mr-1" />
                {isEditing ? t('seller.addProduct.update', language) : t('seller.addProduct.submit', language)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
