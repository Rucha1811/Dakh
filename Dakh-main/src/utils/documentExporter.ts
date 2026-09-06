/**
 * Niryat Saathi - Universal Document Exporter & Generator
 * Supports Word (.doc/.docx), PDF, CSV, and JSON downloads
 */

export interface ExportDocData {
  title: string;
  documentType?: string;
  docNumber?: string;
  date?: string;
  sellerName?: string;
  sellerBusiness?: string;
  sellerAddress?: string;
  sellerGST?: string;
  sellerIEC?: string;
  buyerName?: string;
  buyerCountry?: string;
  buyerAddress?: string;
  orderId?: string;
  trackingNumber?: string;
  productName?: string;
  category?: string;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  currency?: string;
  weight?: number;
  grossWeight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  packagingType?: string;
  hsCode?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  items?: Array<{ name: string; quantity: number; unitPrice: number; total: number; hsCode?: string; weight?: number }>;
  declaration?: string;
}

/**
 * Downloads formatted CSV file
 */
export function downloadCSV(data: Record<string, string | number | boolean>[], filename: string) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const escape = (val: string | number | boolean | undefined) => {
    if (val === undefined || val === null) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => escape(row[h])).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Downloads formatted JSON file
 */
export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

/**
 * Downloads a Microsoft Word-compatible (.doc) document with full styling & tables
 */
export function downloadWord(doc: ExportDocData, filename: string) {
  const dateStr = doc.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const items = doc.items && doc.items.length > 0 ? doc.items : [
    {
      name: doc.productName || 'Export Artisan Handicraft',
      quantity: doc.quantity || 2,
      unitPrice: doc.unitPrice || (doc.totalAmount ? doc.totalAmount / 2 : 1200),
      total: doc.totalAmount || 2400,
      hsCode: doc.hsCode || '6913.90',
      weight: doc.weight || 1.2
    }
  ];

  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${doc.title}</title>
  <style>
    body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; }
    h1 { color: #881337; font-size: 22pt; margin-bottom: 2px; text-align: center; }
    h2 { color: #475569; font-size: 14pt; margin-top: 0; text-align: center; font-weight: normal; }
    .header-bar { border-bottom: 2pt solid #881337; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
    .sub-tag { font-size: 10pt; color: #64748b; text-transform: uppercase; letter-spacing: 1.5pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
    th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; border: 1pt solid #cbd5e1; padding: 8px 10px; text-align: left; font-size: 10pt; }
    td { border: 1pt solid #cbd5e1; padding: 8px 10px; font-size: 10pt; vertical-align: top; }
    .info-grid { width: 100%; border: none; margin-bottom: 20px; }
    .info-grid td { border: none; padding: 4px 0; font-size: 10pt; }
    .label { color: #64748b; font-size: 9pt; text-transform: uppercase; font-weight: bold; }
    .value { font-weight: bold; color: #0f172a; font-size: 10.5pt; }
    .total-row td { background-color: #f8fafc; font-weight: bold; font-size: 11pt; color: #881337; border-top: 2pt solid #881337; }
    .declaration-box { border: 1pt solid #cbd5e1; background-color: #f8fafc; padding: 12px; margin-top: 25px; font-size: 9.5pt; color: #334155; }
    .signature-area { margin-top: 40px; width: 100%; border: none; }
    .signature-area td { border: none; }
    .stamp-box { border: 1.5pt dashed #94a3b8; padding: 15px; text-align: center; color: #64748b; font-size: 9pt; width: 180px; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="sub-tag">Government of India • Ministry of Communications • Department of Posts</div>
    <h1>${doc.title.toUpperCase()}</h1>
    <h2>Dak Ghar Niryat Kendra (DNK) Export Documentation</h2>
    <div style="font-size: 9.5pt; color: #64748b;">Doc Ref: <strong>${doc.docNumber || 'DNK-DOC-' + Date.now().toString().slice(-6)}</strong> | Issue Date: <strong>${dateStr}</strong></div>
  </div>

  <table class="info-grid">
    <tr>
      <td style="width: 50%;">
        <div class="label">Exporter / Shipper (Seller)</div>
        <div class="value">${doc.sellerName || 'Meera Patel Exports'}</div>
        <div>${doc.sellerBusiness || 'Kutch Handicrafts & Textile MSME'}</div>
        <div>${doc.sellerAddress || 'Bhuj, Kutch, Gujarat 370001, India'}</div>
        <div>GSTIN: <strong>${doc.sellerGST || '24AAACP1234A1Z5'}</strong> | IEC: <strong>${doc.sellerIEC || '0812345678'}</strong></div>
      </td>
      <td style="width: 50%;">
        <div class="label">Consignee / Buyer (Destination)</div>
        <div class="value">${doc.buyerName || 'International Buyer'}</div>
        <div>Country: <strong>${doc.buyerCountry || 'Germany (Europe)'}</strong></div>
        <div>${doc.buyerAddress || 'Schwanthalerstrasse 45, 80336 Munich, Germany'}</div>
        <div>Order Ref: <strong>${doc.orderId || 'ORD-' + Date.now().toString().slice(-5)}</strong> | Tracking: <strong>${doc.trackingNumber || 'IN948271034'}</strong></div>
      </td>
    </tr>
  </table>

  <table>
    <thead>
      <tr>
        <th style="width: 40%;">Item Description</th>
        <th style="width: 15%;">HS Code</th>
        <th style="width: 10%; text-align: center;">Qty</th>
        <th style="width: 15%; text-align: right;">Unit Price (${doc.currency || 'INR'})</th>
        <th style="width: 20%; text-align: right;">Total Amount (${doc.currency || 'INR'})</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            <div style="font-size: 8.5pt; color: #64748b;">Weight: ${item.weight || 0.5} kg | Origin: India</div>
          </td>
          <td>${item.hsCode || '6913.90'}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">₹${Number(item.unitPrice).toLocaleString('en-IN')}</td>
          <td style="text-align: right; font-weight: bold;">₹${Number(item.total).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="3"><strong>TOTAL CONSIGNMENT VALUE (FOB/CN22)</strong></td>
        <td colspan="2" style="text-align: right;"><strong>₹${items.reduce((s, i) => s + Number(i.total), 0).toLocaleString('en-IN')}</strong></td>
      </tr>
    </tbody>
  </table>

  <table class="info-grid">
    <tr>
      <td><span class="label">Gross Weight:</span> <strong>${doc.grossWeight || (doc.weight ? doc.weight * 1.2 : 1.5).toFixed(2)} kg</strong></td>
      <td><span class="label">Net Weight:</span> <strong>${doc.weight || 1.2} kg</strong></td>
      <td><span class="label">Packaging:</span> <strong>${doc.packagingType || 'Cardboard Box (Standard)'}</strong></td>
      <td><span class="label">Port of Loading:</span> <strong>${doc.portOfLoading || 'Ahmedabad Air Cargo Hub'}</strong></td>
    </tr>
  </table>

  <div class="declaration-box">
    <strong>EXPORTER'S LEGAL DECLARATION:</strong><br>
    ${doc.declaration || 'I hereby declare that the particulars given above are true and correct, and the value and quantity of goods are accurately stated. The consignment complies with the Foreign Trade (Development and Regulation) Act and India Post International Postal Parcel regulations.'}
  </div>

  <table class="signature-area">
    <tr>
      <td style="width: 50%;">
        <div class="stamp-box">
          [ DAK GHAR NIRYAT KENDRA ]<br>
          Official Customs Acceptance Stamp<br>
          India Post Counter Verified
        </div>
      </td>
      <td style="width: 50%; text-align: right; vertical-align: bottom;">
        <div style="font-weight: bold; color: #0f172a;">For ${doc.sellerName || 'Authorized Exporter'}</div>
        <div style="height: 40px;"></div>
        <div style="border-top: 1pt solid #475569; display: inline-block; width: 220px; text-align: center; padding-top: 4px; font-size: 9pt; color: #64748b;">
          Authorized Signatory & Date
        </div>
      </td>
    </tr>
  </table>

  <div style="margin-top: 30px; border-top: 1pt solid #cbd5e1; padding-top: 10px; font-size: 8pt; color: #94a3b8; text-align: center;">
    Generated by <strong>Niryat Saathi</strong> Digital Export Enablement Platform • SIH 2026<br>
    Integrated with Dak Ghar Niryat Kendra (DNK) & Postal Bill of Export (PBE-III)
  </div>
</body>
</html>
`;

  const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8;' });
  triggerDownload(blob, filename.endsWith('.doc') ? filename : `${filename}.doc`);
}

/**
 * Generates an A4 Printable PDF / Window View with high-resolution export certificate styling
 */
export function downloadPDF(doc: ExportDocData, filename: string) {
  const dateStr = doc.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const items = doc.items && doc.items.length > 0 ? doc.items : [
    {
      name: doc.productName || 'Export Artisan Handicraft',
      quantity: doc.quantity || 2,
      unitPrice: doc.unitPrice || (doc.totalAmount ? doc.totalAmount / 2 : 1200),
      total: doc.totalAmount || 2400,
      hsCode: doc.hsCode || '6913.90',
      weight: doc.weight || 1.2
    }
  ];

  const totalVal = items.reduce((s, i) => s + Number(i.total), 0);

  const printHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${doc.title} - ${filename}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 12px; }
    .doc-card { border: 2px solid #881337; padding: 24px; border-radius: 8px; position: relative; }
    .gov-header { text-align: center; border-bottom: 2px solid #881337; padding-bottom: 12px; margin-bottom: 20px; }
    .gov-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: bold; }
    .main-title { font-size: 24px; font-weight: 800; color: #881337; margin: 4px 0; }
    .sub-title { font-size: 13px; color: #334155; margin: 0; }
    .meta-row { display: flex; justify-content: space-between; font-size: 11px; margin-top: 8px; color: #64748b; }
    .meta-badge { background: #f1f5f9; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #881337; border: 1px solid #cbd5e1; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-panel { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
    .panel-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .panel-body { font-size: 12px; line-height: 1.5; }
    .strong-name { font-size: 14px; font-weight: bold; color: #0f172a; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #881337; color: #ffffff; padding: 8px 10px; text-align: left; font-weight: bold; font-size: 10px; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background-color: #f8fafc; }
    .total-row td { background: #f1f5f9; font-weight: bold; font-size: 13px; color: #881337; border-top: 2px solid #881337; }

    .details-row { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; }
    .declaration { border: 1px solid #cbd5e1; background: #fff; padding: 12px; border-radius: 6px; font-size: 10.5px; color: #334155; margin-bottom: 25px; line-height: 1.4; }

    .sign-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; }
    .stamp-box { border: 2px dashed #94a3b8; border-radius: 6px; padding: 10px 16px; text-align: center; color: #64748b; font-size: 10px; font-weight: bold; }
    .sign-box { text-align: center; width: 200px; border-top: 1px solid #475569; padding-top: 4px; font-size: 11px; font-weight: bold; color: #334155; }

    .footer-note { text-align: center; margin-top: 25px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }

    .print-bar { position: fixed; top: 10px; right: 10px; background: #0f172a; padding: 8px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100; }
    .print-btn { background: #e11d48; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; }
    @media print { .print-bar { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="doc-card">
    <div class="gov-header">
      <div class="gov-title">Government of India • Ministry of Communications • Department of Posts</div>
      <h1 class="main-title">${doc.title.toUpperCase()}</h1>
      <p class="sub-title">Dak Ghar Niryat Kendra (DNK) — Postal Bill of Export Documentation</p>
      <div class="meta-row">
        <div>Ref: <span class="meta-badge">${doc.docNumber || 'NS-' + Date.now().toString().slice(-8)}</span></div>
        <div>Date: <strong>${dateStr}</strong></div>
        <div>DNK Hub: <strong>Ahmedabad GPO (380001)</strong></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="info-panel">
        <div class="panel-title">Shipper / Exporter Details</div>
        <div class="panel-body">
          <div class="strong-name">${doc.sellerName || 'Meera Patel Exports'}</div>
          <div>${doc.sellerBusiness || 'Kutch Handicrafts & Textiles MSME'}</div>
          <div>${doc.sellerAddress || 'Bhuj, Kutch, Gujarat 370001, India'}</div>
          <div style="margin-top: 6px;">GSTIN: <strong>${doc.sellerGST || '24AAACP1234A1Z5'}</strong></div>
          <div>IEC Code: <strong>${doc.sellerIEC || '0812345678'}</strong></div>
        </div>
      </div>

      <div class="info-panel">
        <div class="panel-title">Consignee / Destination Details</div>
        <div class="panel-body">
          <div class="strong-name">${doc.buyerName || 'International Buyer'}</div>
          <div>Country: <strong>${doc.buyerCountry || 'Germany (EU)'}</strong></div>
          <div>${doc.buyerAddress || 'Schwanthalerstrasse 45, 80336 Munich, Germany'}</div>
          <div style="margin-top: 6px;">Order Ref: <strong>${doc.orderId || 'ORD-98231'}</strong></div>
          <div>Postal Barcode: <strong>${doc.trackingNumber || 'IN948271034'}</strong></div>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 45%;">Item & Specifications</th>
          <th style="width: 15%;">HS Code</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 15%; text-align: right;">Unit Price (${doc.currency || 'INR'})</th>
          <th style="width: 15%; text-align: right;">Total (${doc.currency || 'INR'})</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>
              <strong>${item.name}</strong>
              <div style="font-size: 9.5px; color: #64748b;">Weight: ${item.weight || 0.5} kg • Country of Origin: India</div>
            </td>
            <td style="font-family: monospace; font-weight: bold;">${item.hsCode || '6913.90'}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">₹${Number(item.unitPrice).toLocaleString('en-IN')}</td>
            <td style="text-align: right; font-weight: bold;">₹${Number(item.total).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3">TOTAL DECLARED EXPORT VALUE (INR)</td>
          <td colspan="2" style="text-align: right;">₹${totalVal.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div class="details-row">
      <div><strong>Gross Weight:</strong> ${(doc.grossWeight || (doc.weight ? doc.weight * 1.2 : 1.5)).toFixed(2)} kg</div>
      <div><strong>Net Weight:</strong> ${doc.weight || 1.2} kg</div>
      <div><strong>Package:</strong> ${doc.packagingType || 'Cardboard Box'}</div>
      <div><strong>Dispatch Mode:</strong> India Post Air Parcel (CN22)</div>
    </div>

    <div class="declaration">
      <strong>LEGAL COMPLIANCE DECLARATION:</strong><br>
      ${doc.declaration || 'I hereby declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. The goods contain no hazardous, prohibited, or restricted items under India Post or international postal customs.'}
    </div>

    <div class="sign-row">
      <div class="stamp-box">
        🇮🇳 DAK GHAR NIRYAT KENDRA<br>
        India Post Postal Customs Seal<br>
        Verified & Registered
      </div>

      <div style="text-align: center;">
        <div style="font-size: 11px; margin-bottom: 35px; color: #64748b;">For <strong>${doc.sellerName || 'Authorized Exporter'}</strong></div>
        <div class="sign-box">Authorized Signatory & Date</div>
      </div>
    </div>

    <div class="footer-note">
      Niryat Saathi Export Enablement Platform • SIH 2026 • Official Digital Postal Bill of Export
    </div>
  </div>

  <script>
    window.onload = function() {
      // Auto-focus print if opened in popup
      setTimeout(function() { window.print(); }, 500);
    }
  </script>
</body>
</html>
  `;

  // Open in printable popup window
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  } else {
    // Fallback: download as printable HTML file
    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8;' });
    triggerDownload(blob, filename.endsWith('.html') ? filename : `${filename}.html`);
  }
}

/**
 * Universal dispatcher for any document type & target format
 */
export function exportDocumentInFormat(
  doc: ExportDocData, 
  format: 'word' | 'pdf' | 'csv' | 'json', 
  baseFilename: string
) {
  switch (format) {
    case 'word':
      downloadWord(doc, `${baseFilename}.doc`);
      break;
    case 'pdf':
      downloadPDF(doc, `${baseFilename}`);
      break;
    case 'csv': {
      const items = doc.items || [{ name: doc.productName || 'Item', quantity: doc.quantity || 1, unitPrice: doc.unitPrice || 0, total: doc.totalAmount || 0 }];
      const rows = items.map(i => ({
        'Document Title': doc.title,
        'Doc Number': doc.docNumber || 'N/A',
        'Date': doc.date || new Date().toLocaleDateString('en-IN'),
        'Exporter': doc.sellerName || 'N/A',
        'Consignee': doc.buyerName || 'N/A',
        'Item Name': i.name,
        'HS Code': i.hsCode || doc.hsCode || 'N/A',
        'Quantity': i.quantity,
        'Unit Price': i.unitPrice,
        'Total Amount': i.total,
        'Gross Weight (kg)': doc.grossWeight || doc.weight || 0,
      }));
      downloadCSV(rows, `${baseFilename}.csv`);
      break;
    }
    case 'json':
      downloadJSON(doc, `${baseFilename}.json`);
      break;
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
