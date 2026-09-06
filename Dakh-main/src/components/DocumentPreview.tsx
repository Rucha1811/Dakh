import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { downloadPDF, downloadWord, downloadCSV, type ExportDocData } from '../utils/documentExporter';

interface Props {
  documentName: string;
  documentType: string;
  sellerName?: string;
  sellerBusiness?: string;
  sellerAddress?: string;
  sellerGST?: string;
  sellerIEC?: string;
  buyerName?: string;
  buyerCountry?: string;
  buyerAddress?: string;
  product?: string;
  destination?: string;
  orderId?: string;
  amount?: number;
  weight?: number;
  hsCode?: string;
  onClose: () => void;
}

export default function DocumentPreview({
  documentName,
  documentType,
  sellerName = 'Meera Patel Exports',
  sellerBusiness = 'Kutch Handicrafts & Textile MSME',
  sellerAddress = 'Bhuj, Kutch, Gujarat 370001, India',
  sellerGST = '24AAACP1234A1Z5',
  sellerIEC = '0812345678',
  buyerName = 'International Buyer',
  buyerCountry = 'Germany (EU)',
  buyerAddress = 'Schwanthalerstrasse 45, 80336 Munich, Germany',
  product = 'Terracotta Handicraft Pot',
  destination = 'Germany',
  orderId = 'ORD-89214',
  amount = 2400,
  weight = 1.2,
  hsCode = '6913.90',
  onClose,
}: Props) {
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'word' | 'csv'>('pdf');

  const docData: ExportDocData = {
    title: documentName || documentType,
    documentType: documentType,
    docNumber: `NS-DOC-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    sellerName,
    sellerBusiness,
    sellerAddress,
    sellerGST,
    sellerIEC,
    buyerName,
    buyerCountry: destination || buyerCountry,
    buyerAddress,
    orderId,
    trackingNumber: 'IN948271034',
    productName: product,
    quantity: 2,
    unitPrice: amount ? amount / 2 : 1200,
    totalAmount: amount || 2400,
    currency: 'INR',
    weight: weight || 1.2,
    grossWeight: (weight || 1.2) * 1.2,
    hsCode: hsCode || '6913.90',
    packagingType: 'Cardboard Box (Standard Export)',
    items: [
      {
        name: product,
        quantity: 2,
        unitPrice: amount ? amount / 2 : 1200,
        total: amount || 2400,
        hsCode: hsCode || '6913.90',
        weight: weight || 1.2,
      },
    ],
  };

  const handleDownload = (format: 'pdf' | 'word' | 'csv') => {
    const filename = `${documentName.replace(/\s+/g, '_')}`;
    if (format === 'pdf') {
      downloadPDF(docData, filename);
    } else if (format === 'word') {
      downloadWord(docData, `${filename}.doc`);
    } else if (format === 'csv') {
      downloadCSV(
        [
          {
            'Document Name': documentName,
            'Document Type': documentType,
            'Doc Ref': docData.docNumber || '',
            'Date': docData.date || '',
            'Seller': sellerName,
            'GSTIN': sellerGST,
            'IEC Code': sellerIEC,
            'Buyer': buyerName,
            'Destination': destination,
            'Product': product,
            'HS Code': hsCode,
            'Total Value (INR)': amount,
            'Weight (kg)': weight,
          },
        ],
        `${filename}.csv`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Action Header */}
        <div className="flex flex-wrap items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{documentName}</h3>
              <p className="text-xs text-slate-400">Postal Customs & Export Certificate Studio</p>
            </div>
          </div>

          {/* Multi-Format Download Suite */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('pdf')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-sm transition-colors"
              title="Save / Print PDF"
            >
              <Printer className="h-3.5 w-3.5" /> PDF / Print
            </button>

            <button
              onClick={() => handleDownload('word')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors"
              title="Download Microsoft Word .doc Document"
            >
              <FileText className="h-3.5 w-3.5" /> Word (.doc)
            </button>

            <button
              onClick={() => handleDownload('csv')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors"
              title="Download CSV Spreadsheet"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto max-h-[75vh] space-y-6 text-slate-800 bg-slate-50 font-sans" id="document-preview-container">
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            {/* Government & DNK Header */}
            <div className="text-center border-b-2 border-rose-800 pb-6 mb-6">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Government of India • Department of Posts • Dak Ghar Niryat Kendra
              </p>
              <h1 className="text-2xl font-black text-rose-900 mt-1 uppercase tracking-tight">
                {documentName.toUpperCase()}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Official Postal Export Consignment & Compliance Certificate (PBE-III)
              </p>
              <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-dashed border-gray-200 text-xs text-slate-500">
                <span>Ref: <strong className="font-mono text-rose-900">{docData.docNumber}</strong></span>
                <span>Issue Date: <strong className="text-slate-800">{docData.date}</strong></span>
                <span>Postal Hub: <strong>Ahmedabad GPO DNK</strong></span>
              </div>
            </div>

            {/* Shipper & Consignee Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                  1. Exporter / Shipper (Seller)
                </div>
                <div className="font-bold text-sm text-slate-900">{sellerName}</div>
                <div className="text-slate-600">{sellerBusiness}</div>
                <div className="text-slate-600">{sellerAddress}</div>
                <div className="pt-2 text-[11px] text-slate-700">
                  GSTIN: <strong className="font-mono">{sellerGST}</strong> | IEC: <strong className="font-mono">{sellerIEC}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                  2. Consignee / Destination
                </div>
                <div className="font-bold text-sm text-slate-900">{buyerName}</div>
                <div className="text-slate-600">Country: <strong>{destination}</strong></div>
                <div className="text-slate-600">{buyerAddress}</div>
                <div className="pt-2 text-[11px] text-slate-700">
                  Order ID: <strong className="font-mono">{orderId}</strong> | Barcode: <strong className="font-mono text-indigo-700">IN948271034</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">HS Code</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price (INR)</th>
                    <th className="p-3 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="p-3 font-medium">
                      <div className="font-bold text-slate-900">{product}</div>
                      <div className="text-[10px] text-slate-500">Weight: {weight} kg • Origin: India</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{hsCode}</td>
                    <td className="p-3 text-center font-bold">2</td>
                    <td className="p-3 text-right font-mono">₹{((amount || 2400) / 2).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">₹{(amount || 2400).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-rose-50/70 font-bold text-rose-950">
                    <td colSpan={3} className="p-3 uppercase">Total Export Declared Value</td>
                    <td colSpan={2} className="p-3 text-right text-sm font-mono text-rose-900">
                      ₹{(amount || 2400).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Weight and Shipment Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-100/70 rounded-lg text-xs mb-6 text-slate-700">
              <div><span className="text-slate-500">Gross Weight:</span> <strong>{((weight || 1.2) * 1.2).toFixed(2)} kg</strong></div>
              <div><span className="text-slate-500">Net Weight:</span> <strong>{weight} kg</strong></div>
              <div><span className="text-slate-500">Packaging:</span> <strong>Cardboard Box</strong></div>
              <div><span className="text-slate-500">Dispatch:</span> <strong>India Post Air Parcel</strong></div>
            </div>

            {/* Legal Declaration */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-600 leading-relaxed mb-6">
              <strong>EXPORTER'S LEGAL DECLARATION:</strong><br />
              I hereby declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. The consignment contains no prohibited or restricted items under India Post or international postal customs regulations.
            </div>

            {/* Stamps and Signatures */}
            <div className="flex flex-wrap items-end justify-between pt-4 gap-4">
              <div className="p-3 border-2 border-dashed border-slate-400 rounded-lg text-center text-[10px] text-slate-500 font-bold leading-tight">
                🇮🇳 DAK GHAR NIRYAT KENDRA<br />
                Postal Customs Verification Seal<br />
                Accepted for Dispatch
              </div>

              <div className="text-center">
                <div className="text-xs text-slate-500 mb-6">For <strong>{sellerName}</strong></div>
                <div className="border-t border-slate-600 pt-1 text-xs font-bold text-slate-800 w-44">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-100 border-t border-gray-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>Supported Formats: <strong>Word (.doc)</strong>, <strong>PDF</strong>, <strong>CSV</strong>, <strong>JSON</strong></span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
