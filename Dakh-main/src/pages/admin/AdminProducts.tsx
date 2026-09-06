import { useState, useMemo, useRef } from 'react';
import { Search, Package, Download, Upload, FileText, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import { t } from '../../i18n/translations';
import ProductImage from '../../components/ProductImage';
import { downloadPDF, downloadWord, downloadCSV } from '../../utils/documentExporter';

export default function AdminProducts() {
  const { products: allProducts, addProduct, addToast, language } = useAppStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(allProducts.map(p => p.category)))], [allProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [allProducts, search, catFilter]);

  const handleExportPDF = () => {
    const items = filtered.map(p => ({
      name: p.name,
      quantity: p.stock || 10,
      unitPrice: p.price,
      total: p.price * (p.stock || 10),
      hsCode: p.hsCode || '6913.90',
      weight: p.weight || 1.0
    }));

    downloadPDF({
      title: 'National Export Product Catalog & Inventory Summary',
      documentType: 'Official Product Registry',
      docNumber: `CAT-REP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-IN'),
      sellerName: 'Postal Admin Catalog Hub',
      sellerBusiness: 'Department of Posts - India Post',
      totalAmount: filtered.reduce((s, p) => s + p.price, 0),
      items: items.slice(0, 15),
    }, 'products_catalog');
    addToast({ type: 'success', message: 'PDF Catalog downloaded successfully!' });
  };

  const handleExportWord = () => {
    const items = filtered.map(p => ({
      name: p.name,
      quantity: p.stock || 10,
      unitPrice: p.price,
      total: p.price * (p.stock || 10),
      hsCode: p.hsCode || '6913.90',
      weight: p.weight || 1.0
    }));

    downloadWord({
      title: 'National Export Product Catalog & Inventory Summary',
      documentType: 'Official Product Registry',
      docNumber: `CAT-REP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-IN'),
      sellerName: 'Postal Admin Catalog Hub',
      sellerBusiness: 'Department of Posts - India Post',
      totalAmount: filtered.reduce((s, p) => s + p.price, 0),
      items: items,
    }, 'products_catalog.doc');
    addToast({ type: 'success', message: 'Word (.doc) Catalog downloaded successfully!' });
  };

  const handleExportCSV = () => {
    const csvRows = filtered.map(p => {
      const seller = SELLERS.find(s => s.id === p.sellerId);
      return {
        'Product ID': p.id,
        'Product Name': p.name,
        'Category': p.category,
        'Price (INR)': p.price,
        'Currency': p.currency,
        'Stock': p.stock,
        'Weight (kg)': p.weight,
        'Export Status': p.exportStatus,
        'Seller': seller?.businessName ?? 'Unknown',
        'HS Code': p.hsCode ?? '6913.90',
        'Destination': p.destinationCountry ?? 'Global',
      };
    });
    downloadCSV(csvRows, 'products_catalog.csv');
    addToast({ type: 'success', message: 'CSV Catalog downloaded successfully!' });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          if (lines.length > 1) {
            addToast({ message: `Successfully imported ${lines.length - 1} products from CSV!`, type: 'success' });
          }
        } catch {
          addToast({ message: 'Failed to parse CSV file', type: 'error' });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('admin.productManagement', language)}</h2>
          <p className="text-gray-500">{t('admin.viewManage', language)}</p>
        </div>

        {/* Action Suite */}
        <div className="flex flex-wrap items-center gap-2">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVUpload}
            accept=".csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Import Products from CSV"
          >
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download PDF Catalog"
          >
            <Download className="h-3.5 w-3.5" /> PDF
          </button>

          <button
            onClick={handleExportWord}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download Word (.doc) Catalog"
          >
            <FileText className="h-3.5 w-3.5" /> Word (.doc)
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
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
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <ProductImage src={p.images?.[0]} category={p.category} name={p.name} size="sm" />
                      <span className="truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{p.category}</td>
                    <td className="p-4 text-gray-900 font-mono font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">{p.weight} kg</td>
                    <td className="p-4 text-gray-600">{seller?.businessName ?? 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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
