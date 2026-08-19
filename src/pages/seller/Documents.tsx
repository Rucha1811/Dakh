import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import { SELLERS } from '../../data/mockData';
import {
  FileText, Download, CheckCircle, AlertCircle, Clock, Upload,
  Eye
} from 'lucide-react';
import { t } from '../../i18n/translations';
import DocumentPreview from '../../components/DocumentPreview';

function generateDocumentContent(type: string, sellerName: string, productName: string, orderId: string, amount: number, weight: number) {
  const date = new Date().toLocaleDateString('en-IN');
  const border = '═'.repeat(60);
  const thinBorder = '─'.repeat(60);

  if (type === 'invoice') {
    return `
╔══════════════════════════════════════════════════════════════╗
║              SAMPLE / PROTOTYPE DOCUMENT                     ║
║          NOT LEGALLY BINDING — DEMONSTRATION ONLY            ║
╚══════════════════════════════════════════════════════════════╝

                    COMMERCIAL INVOICE

${border}
Seller:        ${sellerName}
Buyer:         International Buyer
Order ID:      ${orderId}
Date:          ${date}
${border}

ITEM DETAILS:
${thinBorder}
Product:       ${productName}
Quantity:      2
Unit Price:    ₹${amount.toLocaleString('en-IN')}
Total Value:   ₹${(amount * 2).toLocaleString('en-IN')}
${thinBorder}

WEIGHT & PACKAGING:
Gross Weight:  ${weight} kg
Packaging:     Cardboard Box
${thinBorder}

Country of Origin: India
Currency:          INR (Indian Rupees)
${thinBorder}

DECLARATION:
I hereby certify that the above information is true and correct.

Signature: ________________________
Date: ${date}

---
NIRYAT SAATHI — Digital Export Enablement Platform
SIH Prototype — Prototype Document
`;
  }

  if (type === 'packing') {
    return `
╔══════════════════════════════════════════════════════════════╗
║              SAMPLE / PROTOTYPE DOCUMENT                     ║
║          NOT LEGALLY BINDING — DEMONSTRATION ONLY            ║
╚══════════════════════════════════════════════════════════════╝

                     PACKING LIST

${border}
Seller:        ${sellerName}
Order ID:      ${orderId}
Date:          ${date}
${border}

PACKING DETAILS:
${thinBorder}
Item:          ${productName}
Quantity:      2
Net Weight:    ${weight} kg
Gross Weight:  ${(weight * 1.2).toFixed(1)} kg (with packaging)
${thinBorder}

Package Dimensions:
Length: 20 cm | Width: 15 cm | Height: 10 cm
${thinBorder}

Shipping Marks:
  ${orderId}
  DESTINATION: INTERNATIONAL
  HANDLE WITH CARE
  THIS SIDE UP
${thinBorder}

Total Packages: 1
Total Weight: ${(weight * 1.2).toFixed(1)} kg

---
NIRYAT SAATHI — Digital Export Enablement Platform
SIH Prototype — Prototype Document
`;
  }

  return `
╔══════════════════════════════════════════════════════════════╗
║              SAMPLE / PROTOTYPE DOCUMENT                     ║
║          NOT LEGALLY BINDING — DEMONSTRATION ONLY            ║
╚══════════════════════════════════════════════════════════════╝

                  SHIPMENT SUMMARY

${border}
Order ID:      ${orderId}
Date:          ${date}
${border}

SHIPPER:
  ${sellerName}

PRODUCTS:
${thinBorder}
  ${productName}
  Qty: 2 | Weight: ${weight} kg
${thinBorder}

SHIPPING DETAILS:
  Origin:      Ahmedabad, Gujarat, India
  Destination: International
  Mode:        Air Mail (India Post International)
  Estimated:   7-12 business days
${thinBorder}

WEIGHT SUMMARY:
  Net Weight:   ${weight} kg
  Gross Weight: ${(weight * 1.2).toFixed(1)} kg
  Volumetric:   0.6 kg

TOTAL: ${(weight * 1.2 + 0.6).toFixed(1)} kg

---
NIRYAT SAATHI — Digital Export Enablement Platform
SIH Prototype — Prototype Document
`;
}

export default function Documents() {
  const user = useAuthStore(s => s.user);
  const { documents: storeDocs, products: storeProducts, orders: storeOrders, addToast, language } = useAppStore();
  const [filter, setFilter] = useState<string>('All');
  const [docPreviewOpen, setDocPreviewOpen] = useState(false);
  const [docPreviewData, setDocPreviewData] = useState<{ name: string; type: string }>({ name: '', type: '' });

  const seller = SELLERS.find(s => s.userId === user?.id);
  const sellerId = seller?.id ?? '';

  const sellerDocs = storeDocs.filter(d => d.sellerId === sellerId);
  const filteredDocs = filter === 'All' ? sellerDocs : sellerDocs.filter(d => d.status === filter.replace(' ', '_').toUpperCase() as typeof d.status);

  const sellerProducts = storeProducts.filter(p => p.sellerId === sellerId);
  const primaryProduct = sellerProducts[0];
  const primaryOrder = storeOrders.find(o => o.sellerId === sellerId);

  const handleGenerate = (type: string) => {
    if (!seller || !primaryProduct) {
      addToast({ message: 'Add a product first before generating documents', type: 'warning' });
      return;
    }
    const content = generateDocumentContent(
      type,
      seller.businessName,
      primaryProduct.name,
      primaryOrder?.id ?? 'DNK-XXXXX',
      primaryOrder?.amount ?? primaryProduct.price,
      primaryProduct.weight
    );

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = type === 'invoice' ? 'Commercial_Invoice.txt' : type === 'packing' ? 'Packing_List.txt' : 'Shipment_Summary.txt';
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    addToast({ message: `${filename} downloaded successfully`, type: 'success' });
  };

  const handlePreview = (docName: string, type: string) => {
    setDocPreviewData({ name: docName, type });
    setDocPreviewOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="h-4 w-4 text-green-500 mr-2" />;
      case 'UNDER_REVIEW': return <Clock className="h-4 w-4 text-amber-500 mr-2" />;
      case 'CORRECTION_REQUIRED': return <AlertCircle className="h-4 w-4 text-red-500 mr-2" />;
      default: return <FileText className="h-4 w-4 text-gray-500 mr-2" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Verified</span>;
      case 'UNDER_REVIEW': return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Under Review</span>;
      case 'CORRECTION_REQUIRED': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Correction Required</span>;
      case 'UPLOADED': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Uploaded</span>;
      case 'DRAFT': return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Draft</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  const filters = ['All', 'Verified', 'Under Review', 'Uploaded', 'Draft', 'Correction Required'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">{t('seller.documents.title', language)}</h2>
          <p className="text-gray-500">{t('seller.documents.subtitle', language)}</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Upload className="h-5 w-5 mr-2" />
          {t('seller.documents.upload', language)}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleGenerate('invoice')}
          className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-blue-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
        >
          <FileText className="h-5 w-5 mr-2" />
          {t('seller.documents.generate', language)} Invoice
        </button>
        <button
          onClick={() => handleGenerate('packing')}
          className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-blue-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
        >
          <FileText className="h-5 w-5 mr-2" />
          {t('seller.documents.generate', language)} Packing List
        </button>
        <button
          onClick={() => handleGenerate('summary')}
          className="flex items-center justify-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-blue-50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
        >
          <FileText className="h-5 w-5 mr-2" />
          {t('seller.documents.generate', language)} Shipment Summary
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Document Name</th>
                <th className="p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="p-4 font-medium hidden md:table-cell">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 flex items-center">
                    {getStatusIcon(doc.status)}
                    <span className="truncate max-w-[200px]">{doc.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 hidden sm:table-cell">{doc.type}</td>
                  <td className="p-4 text-gray-600 hidden md:table-cell">{doc.uploadedAt}</td>
                  <td className="p-4">{getStatusBadge(doc.status)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handlePreview(doc.name, doc.type)}
                        className="p-2 text-gray-500 hover:text-[var(--color-primary)] rounded-full hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          addToast({ message: 'Document download simulated', type: 'info' });
                        }}
                        className="p-2 text-gray-500 hover:text-[var(--color-primary)] rounded-full hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    No documents found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400">
        * {t('seller.documents.prototype', language)}
      </div>

      {docPreviewOpen && (
        <DocumentPreview
          documentName={docPreviewData.name}
          documentType={docPreviewData.type}
          sellerName={seller?.businessName}
          sellerBusiness={seller?.businessType}
          product={primaryProduct?.name}
          destination={primaryOrder?.destination}
          onClose={() => setDocPreviewOpen(false)}
        />
      )}
    </div>
  );
}
