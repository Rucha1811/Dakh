import { useState, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import {
  FileText, Download, CheckCircle, AlertCircle, Clock, Upload,
  Eye, Plus, FileSpreadsheet, Printer, X, Check, ShieldCheck
} from 'lucide-react';
import { t } from '../../i18n/translations';
import DocumentPreview from '../../components/DocumentPreview';
import { getSellerForUser } from '../../utils/sellerHelper';
import { downloadPDF, downloadWord, downloadCSV, type ExportDocData } from '../../utils/documentExporter';

export default function Documents() {
  const user = useAuthStore(s => s.user);
  const { documents: storeDocs, products: storeProducts, orders: storeOrders, addDocument, addToast, language } = useAppStore();
  const [filter, setFilter] = useState<string>('All');
  
  // Document Preview Modal State
  const [docPreviewOpen, setDocPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    name: string;
    type: string;
    product?: string;
    destination?: string;
    amount?: number;
    weight?: number;
    hsCode?: string;
    orderId?: string;
  }>({ name: '', type: '' });

  // Upload Document Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Regulatory');
  const [uploadOrderId, setUploadOrderId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const seller = getSellerForUser(user);
  const sellerId = seller.id;

  const sellerDocs = storeDocs.filter(d => d.sellerId === sellerId);
  const filteredDocs = filter === 'All' ? sellerDocs : sellerDocs.filter(d => d.status === filter.replace(' ', '_').toUpperCase() as typeof d.status);

  const sellerProducts = storeProducts.filter(p => p.sellerId === sellerId);
  const primaryProduct = sellerProducts[0];
  const primaryOrder = storeOrders.find(o => o.sellerId === sellerId);

  // Helper to build ExportDocData
  const buildDocData = (title: string, type: string): ExportDocData => {
    const amount = primaryOrder?.amount ?? primaryProduct?.price ?? 2400;
    const weight = primaryProduct?.weight ?? 1.2;
    const prodName = primaryProduct?.name ?? 'Artisan Handicraft Item';

    return {
      title,
      documentType: type,
      docNumber: `NS-DOC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      sellerName: seller?.businessName || 'Meera Patel Exports',
      sellerBusiness: seller?.businessType || 'Handicrafts MSME',
      sellerAddress: 'Bhuj, Kutch, Gujarat 370001, India',
      sellerGST: '24AAACP1234A1Z5',
      sellerIEC: '0812345678',
      buyerName: primaryOrder ? `Buyer (${primaryOrder.buyerId})` : 'International Buyer',
      buyerCountry: primaryOrder?.destination || 'Germany',
      orderId: primaryOrder?.id || 'DNK-98231',
      trackingNumber: 'IN948271034',
      productName: prodName,
      quantity: 2,
      unitPrice: amount / 2,
      totalAmount: amount,
      currency: 'INR',
      weight: weight,
      grossWeight: weight * 1.2,
      packagingType: 'Cardboard Box (Export Standard)',
      hsCode: primaryProduct?.hsCode || '6913.90',
      items: [
        {
          name: prodName,
          quantity: 2,
          unitPrice: amount / 2,
          total: amount,
          hsCode: primaryProduct?.hsCode || '6913.90',
          weight: weight,
        }
      ]
    };
  };

  const handleQuickDownload = (docName: string, docType: string, format: 'pdf' | 'word' | 'csv') => {
    const data = buildDocData(docName, docType);
    const filename = docName.replace(/\s+/g, '_');

    if (format === 'pdf') {
      downloadPDF(data, filename);
      addToast({ message: `${docName} PDF generated`, type: 'success' });
    } else if (format === 'word') {
      downloadWord(data, `${filename}.doc`);
      addToast({ message: `${docName} downloaded as Microsoft Word (.doc)`, type: 'success' });
    } else if (format === 'csv') {
      downloadCSV([
        {
          'Document Name': docName,
          'Category': docType,
          'Doc Number': data.docNumber || '',
          'Date': data.date || '',
          'Exporter': data.sellerName || '',
          'GSTIN': data.sellerGST || '',
          'Buyer': data.buyerName || '',
          'Destination': data.buyerCountry || '',
          'Product': data.productName || '',
          'HS Code': data.hsCode || '',
          'Value (INR)': data.totalAmount || 0,
        }
      ], `${filename}.csv`);
      addToast({ message: `${docName} downloaded as CSV spreadsheet`, type: 'success' });
    }
  };

  const handlePreview = (docName: string, docType: string) => {
    setPreviewData({
      name: docName,
      type: docType,
      product: primaryProduct?.name,
      destination: primaryOrder?.destination,
      amount: primaryOrder?.amount ?? primaryProduct?.price,
      weight: primaryProduct?.weight,
      hsCode: primaryProduct?.hsCode,
      orderId: primaryOrder?.id,
    });
    setDocPreviewOpen(true);
  };

  // Upload Document Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      addToast({ message: 'Please enter a document title', type: 'warning' });
      return;
    }

    setIsUploading(true);

    try {
      const newDoc = {
        id: `DOC${Date.now().toString().slice(-6)}`,
        sellerId: sellerId,
        orderId: uploadOrderId || undefined,
        name: uploadTitle.trim(),
        type: uploadCategory,
        status: 'UPLOADED' as const,
        uploadedAt: new Date().toISOString().split('T')[0],
      };

      await addDocument(newDoc);
      addToast({ message: `"${uploadTitle}" uploaded successfully to MongoDB!`, type: 'success' });
      setUploadModalOpen(false);
      setUploadTitle('');
      setSelectedFile(null);
      setUploadOrderId('');
    } catch {
      addToast({ message: 'Failed to upload document', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="h-4 w-4 text-green-500 mr-2 shrink-0" />;
      case 'UNDER_REVIEW': return <Clock className="h-4 w-4 text-amber-500 mr-2 shrink-0" />;
      case 'CORRECTION_REQUIRED': return <AlertCircle className="h-4 w-4 text-red-500 mr-2 shrink-0" />;
      default: return <FileText className="h-4 w-4 text-gray-500 mr-2 shrink-0" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">Verified</span>;
      case 'UNDER_REVIEW': return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">Under Review</span>;
      case 'CORRECTION_REQUIRED': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">Correction Required</span>;
      case 'UPLOADED': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">Uploaded</span>;
      case 'DRAFT': return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">Draft</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">{status}</span>;
    }
  };

  const filters = ['All', 'Verified', 'Under Review', 'Uploaded', 'Draft', 'Correction Required'];

  return (
    <div className="space-y-6">
      
      {/* Page Header & Upload Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[var(--color-primary)]">
            {t('seller.documents.title', language)}
          </h2>
          <p className="text-gray-500 text-sm">
            Generate, preview, upload, and download official export papers in Word (.doc), PDF, and CSV.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-brand-red)] hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* 1-Click Document Generator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Commercial Invoice */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">PBE-III Standard</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Commercial Invoice</h3>
            <p className="text-xs text-gray-500 mt-1">Official invoice itemizing goods, values, HS codes, and seller declaration for customs clearance.</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleQuickDownload('Commercial Invoice', 'Customs', 'pdf')}
              className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition text-center"
            >
              📄 PDF
            </button>
            <button
              onClick={() => handleQuickDownload('Commercial Invoice', 'Customs', 'word')}
              className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition text-center"
            >
              📝 Word
            </button>
            <button
              onClick={() => handleQuickDownload('Commercial Invoice', 'Customs', 'csv')}
              className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition"
            >
              📊 CSV
            </button>
            <button
              onClick={() => handlePreview('Commercial Invoice', 'Customs')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              title="Preview & Print"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Packing List */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">Logistics</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Packing List</h3>
            <p className="text-xs text-gray-500 mt-1">Detailed breakdown of package weights, box dimensions, shipping marks, and quantities.</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleQuickDownload('Packing List', 'Logistics', 'pdf')}
              className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition text-center"
            >
              📄 PDF
            </button>
            <button
              onClick={() => handleQuickDownload('Packing List', 'Logistics', 'word')}
              className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition text-center"
            >
              📝 Word
            </button>
            <button
              onClick={() => handleQuickDownload('Packing List', 'Logistics', 'csv')}
              className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition"
            >
              📊 CSV
            </button>
            <button
              onClick={() => handlePreview('Packing List', 'Logistics')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              title="Preview & Print"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Certificate of Origin / CN22 */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">Certificate</span>
            </div>
            <h3 className="font-bold text-gray-900 text-base">Certificate of Origin (CoO)</h3>
            <p className="text-xs text-gray-500 mt-1">Official certification that goods are 100% manufactured in India for preferential tariff access.</p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleQuickDownload('Certificate of Origin', 'Origin', 'pdf')}
              className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition text-center"
            >
              📄 PDF
            </button>
            <button
              onClick={() => handleQuickDownload('Certificate of Origin', 'Origin', 'word')}
              className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition text-center"
            >
              📝 Word
            </button>
            <button
              onClick={() => handleQuickDownload('Certificate of Origin', 'Origin', 'csv')}
              className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition"
            >
              📊 CSV
            </button>
            <button
              onClick={() => handlePreview('Certificate of Origin', 'Origin')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              title="Preview & Print"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === f
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="p-4">Document Title</th>
                <th className="p-4 hidden sm:table-cell">Category</th>
                <th className="p-4 hidden md:table-cell">Uploaded Date</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-right">Download & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-medium text-gray-900 flex items-center">
                    {getStatusIcon(doc.status)}
                    <span className="truncate max-w-[220px] font-semibold">{doc.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-xs hidden sm:table-cell">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-medium">{doc.type}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-xs font-mono hidden md:table-cell">{doc.uploadedAt}</td>
                  <td className="p-4">{getStatusBadge(doc.status)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Preview Button */}
                      <button
                        onClick={() => handlePreview(doc.name, doc.type)}
                        className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                        title="Interactive Preview & Print"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Download PDF */}
                      <button
                        onClick={() => handleQuickDownload(doc.name, doc.type, 'pdf')}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>PDF</span>
                      </button>

                      {/* Download Word (.doc) */}
                      <button
                        onClick={() => handleQuickDownload(doc.name, doc.type, 'word')}
                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                        title="Download Microsoft Word .doc"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Word</span>
                      </button>

                      {/* Download CSV */}
                      <button
                        onClick={() => handleQuickDownload(doc.name, doc.type, 'csv')}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                        title="Download CSV"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <FileText className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    No documents found matching the "{filter}" filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setUploadModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Upload Export Document</h3>
                  <p className="text-xs text-slate-400">Upload certificates, licenses, or invoices to MongoDB</p>
                </div>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-sm">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Import Export Code (IEC) Registration"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  >
                    <option value="Regulatory">Regulatory</option>
                    <option value="Customs">Customs</option>
                    <option value="Origin">Origin</option>
                    <option value="Identity">Identity</option>
                    <option value="Tax">Tax</option>
                    <option value="Quality">Quality / Lab Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Related Order (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadOrderId}
                    onChange={(e) => setUploadOrderId(e.target.value)}
                    placeholder="e.g. ORD-98231"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Attach File (PDF, Word, PNG, JPG)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-rose-500 rounded-2xl p-6 text-center hover:bg-rose-50/30 transition-all cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  {selectedFile ? (
                    <div>
                      <p className="font-bold text-sm text-slate-800">{selectedFile.name}</p>
                      <p className="text-xs text-emerald-600 font-bold mt-0.5">
                        ✓ {(selectedFile.size / 1024).toFixed(1)} KB Ready to Upload
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-xs text-slate-700">Click to choose a file or drag and drop here</p>
                      <p className="text-[11px] text-slate-400 mt-1">PDF, DOC, DOCX, PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  {isUploading ? 'Uploading...' : 'Save & Upload Document'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {docPreviewOpen && (
        <DocumentPreview
          documentName={previewData.name}
          documentType={previewData.type}
          sellerName={seller?.businessName}
          sellerBusiness={seller?.businessType}
          product={previewData.product}
          destination={previewData.destination}
          amount={previewData.amount}
          weight={previewData.weight}
          hsCode={previewData.hsCode}
          orderId={previewData.orderId}
          onClose={() => setDocPreviewOpen(false)}
        />
      )}

    </div>
  );
}
