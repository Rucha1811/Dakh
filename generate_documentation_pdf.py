import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas for adding dynamic page numbers, running headers and footers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Niryat Saathi (निर्यात् साथी) — End-to-End System Flow & Technical Reference")
            self.drawRightString(558, 750, "SIH 2026")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer (all pages)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 34, page_str)
        self.drawString(54, 34, "Niryat Saathi • Digital Export Enablement via Dak Ghar Niryat Kendra (DNK) • India Post")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        
        self.restoreState()

def build_pdf(filename="Niryat_Saathi_Technical_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Palette
    primary_color = colors.HexColor("#0F2942")     # India Post Deep Blue
    secondary_color = colors.HexColor("#1E40AF")   # Royal Blue
    accent_red = colors.HexColor("#DC2626")        # India Post Red
    accent_teal = colors.HexColor("#0D9488")       # Teal
    dark_text = colors.HexColor("#0F172A")         # Dark Slate
    body_text = colors.HexColor("#334155")         # Slate Body
    bg_light = colors.HexColor("#F8FAFC")          # Light Grey Background
    border_color = colors.HexColor("#CBD5E1")      # Border Grey
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceAfter=12
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=body_text,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=body_text,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=3
    )
    
    table_text = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=body_text
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=primary_color
    )

    code_style = ParagraphStyle(
        'CodeText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0F172A")
    )

    code_bold = ParagraphStyle(
        'CodeBold',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # Title & Header
    story.append(Paragraph("NIRYAT SAATHI (निर्यात् साथी)", title_style))
    story.append(Paragraph("<b>Digital Export Enablement Platform via Dak Ghar Niryat Kendra (DNK) • India Post</b><br/><font color='#64748B' size=9>Smart India Hackathon (SIH 2026) | Complete Architecture, Live Endpoints, User Credentials & System Workflow</font>", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_red, spaceBefore=0, spaceAfter=8))

    # Executive Overview
    overview_html = """
    <b>Executive Mission:</b> <b>Niryat Saathi</b> empowers India's rural artisans, weavers, SHGs, and MSMEs to access international trade directly through their local <b>Dak Ghar Niryat Kendra (DNK)</b> post office. The platform automates the entire export lifecycle: from multilingual AI compliance advisory and automated Postal Bill of Export (PBE-III/IV) generation to counter verification, digital customs dispatch via India Post EMS, and global parcel tracking.
    """
    callout_table = Table([[Paragraph(overview_html, body_style)]], colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93C5FD")),
        ('PADDING', (0,0), (-1,-1), 7),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 8))

    # SECTION 1: LIVE PLATFORM URLS & PORTS
    story.append(Paragraph("1. Live Service URLs, Dashboards & Connection Strings", h1_style))
    story.append(Paragraph("All services run synchronously and connect through real-time REST and WebSocket telemetry:", body_style))

    url_data = [
        [Paragraph("<b>Component / Service</b>", table_header), Paragraph("<b>Status / Port</b>", table_header), Paragraph("<b>Live URL / URI</b>", table_header), Paragraph("<b>Key Responsibilities</b>", table_header)],
        [
            Paragraph("<b>Web Frontend</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (5173)</b></font>", table_text),
            Paragraph("<code>http://127.0.0.1:5173</code>", code_style),
            Paragraph("Vite + React 19 + Tailwind CSS v4 portal suite (Seller, Operator, Admin, Buyer).", table_text)
        ],
        [
            Paragraph("<b>Mobile App (Expo)</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (8081)</b></font>", table_text),
            Paragraph("<code>http://localhost:8081</code>", code_style),
            Paragraph("React Native + Expo Metro Bundler & Cross-Platform Web Preview.", table_text)
        ],
        [
            Paragraph("<b>Backend Console</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (8000)</b></font>", table_text),
            Paragraph("<code>http://127.0.0.1:8000/</code>", code_style),
            Paragraph("Single-Page Enterprise Developer Console: Telemetry, AI Daksh, Data Explorer, DB Backup.", table_text)
        ],
        [
            Paragraph("<b>Backend REST API</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (8000)</b></font>", table_text),
            Paragraph("<code>http://127.0.0.1:8000/api/</code>", code_style),
            Paragraph("Django REST Framework root endpoint powering all web & mobile clients.", table_text)
        ],
        [
            Paragraph("<b>Health Monitor</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (8000)</b></font>", table_text),
            Paragraph("<code>http://127.0.0.1:8000/api/health/</code>", code_style),
            Paragraph("System diagnostic JSON endpoint reporting DB latency, collection count & AI engine status.", table_text)
        ],
        [
            Paragraph("<b>MongoDB Database</b>", table_text),
            Paragraph("<font color='#059669'><b>Active (27017)</b></font>", table_text),
            Paragraph("<code>mongodb://localhost:27017/<br/>sih_dakghar_db</code>", code_style),
            Paragraph("14 authoritative collections with 173 seeded records and dynamic schema support.", table_text)
        ],
    ]
    url_table = Table(url_data, colWidths=[110, 75, 175, 144])
    url_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(url_table)
    story.append(Spacer(1, 8))

    # SECTION 2: DEMO USERS, PASSWORDS & ACCESS
    story.append(Paragraph("2. User Credentials & Role-Based Access Portals", h1_style))
    story.append(Paragraph("Pre-configured 1-click accounts seeded directly in MongoDB for instant evaluation:", body_style))

    acc_data = [
        [Paragraph("<b>Role Persona</b>", table_header), Paragraph("<b>User Name</b>", table_header), Paragraph("<b>Login Email</b>", table_header), Paragraph("<b>Password</b>", table_header), Paragraph("<b>Access Portal URL & Scope</b>", table_header)],
        [
            Paragraph("<b>Rural Seller</b><br/>(MSME Artisan)", table_text),
            Paragraph("Meera Patel", table_text),
            Paragraph("<code>seller@demo.com</code>", code_style),
            Paragraph("<code>demo123</code>", code_bold),
            Paragraph("<b>/seller</b> — Export Hub, Catalog Manager, Readiness Score, Cost Calculator, PBE Filing.", table_text)
        ],
        [
            Paragraph("<b>DNK Operator</b><br/>(Post Master)", table_text),
            Paragraph("Rajesh Kumar", table_text),
            Paragraph("<code>operator@demo.com</code>", code_style),
            Paragraph("<code>demo123</code>", code_bold),
            Paragraph("<b>/operator</b> — Post Office Counter Queue, Barcode Scanning, Parcel Acceptance & Weighing.", table_text)
        ],
        [
            Paragraph("<b>Postal Admin</b><br/>(HQ Director)", table_text),
            Paragraph("Priya Sharma", table_text),
            Paragraph("<code>admin@demo.com</code>", code_style),
            Paragraph("<code>demo123</code>", code_bold),
            Paragraph("<b>/admin</b> — National Postal Analytics, Volume Tracking, Compliance Hub, DNK Center Map.", table_text)
        ],
        [
            Paragraph("<b>Global Buyer</b><br/>(Import Partner)", table_text),
            Paragraph("Hans Mueller", table_text),
            Paragraph("<code>buyer@demo.com</code>", code_style),
            Paragraph("<code>demo123</code>", code_bold),
            Paragraph("<b>/buyer</b> — International Marketplace, RFQ Submission, Multi-currency Invoicing, EMS Tracking.", table_text)
        ],
    ]
    acc_table = Table(acc_data, colWidths=[85, 80, 115, 64, 160])
    acc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(acc_table)
    story.append(Spacer(1, 10))

    # SECTION 3: COMPLETE END-TO-END PROJECT FLOW
    story.append(Paragraph("3. Complete End-to-End System Project Flow", h1_style))
    story.append(Paragraph("The platform connects local rural production with international global delivery across 8 distinct stages:", body_style))

    flow_steps = [
        ("Phase 1: Seller Onboarding & Export Readiness Scoring", 
         "Artisans and SHGs register on the Seller Portal. The system analyzes business registration (Udyam / GST), product photos, and material declarations, calculating a dynamic <b>Export Readiness Score (0-100%)</b> with actionable recommendations to unlock international trade."),
        ("Phase 2: Daksh Multilingual AI Export Consultation", 
         "Sellers consult <b>Daksh</b>, an AI assistant powered by Groq LLM. Daksh speaks <b>English, Hindi, and Gujarati</b>, advising on destination import duties, HS Codes, mandatory certificates (Phytosanitary, CoO, IEC exemptions for postal exports), and packaging standards."),
        ("Phase 3: Product Cataloging & Global Marketplace Exposure", 
         "Sellers upload handicrafts, textiles, and organic goods with volumetric weight, dimensions, and HS codes. The products immediately appear on the <b>Global Buyer Marketplace</b> with real-time currency conversion (INR to USD/EUR) and Request-for-Quote (RFQ) triggers."),
        ("Phase 4: Order Placement & Automated Customs Documentation", 
         "When an international buyer confirms an order, Niryat Saathi's backend compliance engine automatically drafts the required customs documentation: <b>Commercial Invoice</b>, <b>Packing List</b>, and <b>Certificate of Origin (CoO)</b>."),
        ("Phase 5: Digital Postal Bill of Export (PBE) Generation", 
         "In compliance with CBIC and India Post regulations, the platform auto-generates either <b>PBE-III (Postal Export for gifts/samples)</b> or <b>PBE-IV (Commercial Postal Export)</b> complete with unique tracking barcodes, HS code manifests, and consignment values."),
        ("Phase 6: DNK Counter Verification & Acceptance", 
         "The seller brings the pre-booked parcel to their nearest <b>Dak Ghar Niryat Kendra (DNK)</b>. The postal operator logs into <b>/operator</b>, scans the parcel's digital barcode, verifies physical dimensions/weight, approves the customs declaration, and generates the India Post EMS receipt."),
        ("Phase 7: India Post International EMS Dispatch & Tracking", 
         "The parcel is handed over to India Post's International EMS network. Both buyer and seller receive live status updates via automated notifications and visual timeline tracking."),
        ("Phase 8: National Postal Admin Intelligence & Diagnostics", 
         "Postal authorities on <b>/admin</b> view real-time macro analytics: total export volume (₹), top exported categories (Textiles, Handicrafts, Spices), active DNK performance rankings, and live MongoDB telemetry.")
    ]

    for title, desc in flow_steps:
        p_text = f"<b>• {title}:</b> {desc}"
        story.append(Paragraph(p_text, bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))

    # SECTION 4: ARCHITECTURAL BREAKDOWN & TECH STACK
    story.append(Paragraph("4. Full-Stack Architecture & Technology Components", h1_style))
    
    arch_data = [
        [Paragraph("<b>Technology Layer</b>", table_header), Paragraph("<b>Frameworks & Tools</b>", table_header), Paragraph("<b>Key Architectural Value</b>", table_header)],
        [
            Paragraph("<b>Web Frontend</b>", table_text),
            Paragraph("React 19, TypeScript, Vite 8, Tailwind CSS v4, Zustand 5, Lucide Icons, Recharts", table_text),
            Paragraph("Role-based navigation, zero-latency state sync, interactive charts, printable PDF/HTML exports, multilingual localization (EN, HI, GU).", table_text)
        ],
        [
            Paragraph("<b>Mobile Application</b>", table_text),
            Paragraph("React Native, Expo 54, Expo Metro Bundler, Vector Icons, Safe Area Context", table_text),
            Paragraph("Cross-platform accessibility designed for field sellers and DNK counter operators on Android/iOS/Web.", table_text)
        ],
        [
            Paragraph("<b>Backend API Gateway</b>", table_text),
            Paragraph("Python 3.14, Django 6, Django REST Framework (DRF), PyMongo, StatReloader", table_text),
            Paragraph("High-throughput RESTful endpoints, CORS security headers, token-based authentication, and automated backup daemon.", table_text)
        ],
        [
            Paragraph("<b>Database Engine</b>", table_text),
            Paragraph("MongoDB 8.x (NoSQL Document Store), PyMongo Singleton Pool", table_text),
            Paragraph("High-flexibility JSON documents allowing schema evolution for international postal regulations without database locks.", table_text)
        ],
        [
            Paragraph("<b>Generative AI Engine</b>", table_text),
            Paragraph("Groq Cloud API, OpenAI/Llama Model, Prompt Heuristics", table_text),
            Paragraph("Sub-second AI inference advising rural exporters in regional Indian vernacular languages with regulatory accuracy.", table_text)
        ],
    ]
    arch_table = Table(arch_data, colWidths=[95, 145, 264])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 8))

    # SECTION 5: MONGODB DATABASE MODEL
    story.append(Paragraph("5. MongoDB Database Collections Schema (sih_dakghar_db)", h1_style))
    story.append(Paragraph("14 dedicated collections containing 173 seeded documents for zero-mock, end-to-end functionality:", body_style))

    db_data = [
        [Paragraph("<b>Collection Name</b>", table_header), Paragraph("<b>Docs</b>", table_header), Paragraph("<b>Core Schema Attributes</b>", table_header), Paragraph("<b>System Role / Relationship</b>", table_header)],
        [Paragraph("<code>users</code>", code_bold), Paragraph("4", table_text), Paragraph("id, name, email, password, role, phone", code_style), Paragraph("Auth credentials for Seller, Operator, Admin, Buyer", table_text)],
        [Paragraph("<code>sellers</code>", code_bold), Paragraph("10", table_text), Paragraph("id, userId, businessName, businessType, readiness", code_style), Paragraph("MSME profile, state, pincode, export score", table_text)],
        [Paragraph("<code>products</code>", code_bold), Paragraph("22", table_text), Paragraph("id, sellerId, name, price, hsCode, weight, stock", code_style), Paragraph("Export catalog items with dimensions & materials", table_text)],
        [Paragraph("<code>orders</code>", code_bold), Paragraph("20", table_text), Paragraph("id, buyerId, sellerId, productId, amount, status", code_style), Paragraph("International buyer orders and purchase lifecycles", table_text)],
        [Paragraph("<code>shipments</code>", code_bold), Paragraph("10", table_text), Paragraph("id, orderId, trackingNumber, dnkId, destination", code_style), Paragraph("India Post EMS tracking records & logistics stages", table_text)],
        [Paragraph("<code>dnks</code>", code_bold), Paragraph("20", table_text), Paragraph("id, name, postOfficeCode, address, city, state", code_style), Paragraph("Physical Dak Ghar Niryat Kendra post offices", table_text)],
        [Paragraph("<code>documents</code>", code_bold), Paragraph("30", table_text), Paragraph("id, sellerId, orderId, type, docNumber, status", code_style), Paragraph("PBE-III, PBE-IV, Invoices, Certificates of Origin", table_text)],
        [Paragraph("<code>compliance_rules</code>", code_bold), Paragraph("12", table_text), Paragraph("id, productCategory, destination, requirement", code_style), Paragraph("Country-specific tariffs, duties, and restrictions", table_text)],
        [Paragraph("<code>assistant_qa</code>", code_bold), Paragraph("8", table_text), Paragraph("question, answer, nextSteps, requiredDocuments", code_style), Paragraph("Pre-indexed knowledge base for export queries", table_text)],
        [Paragraph("<code>export_journey_steps</code>", code_bold), Paragraph("9", table_text), Paragraph("step, title, description, responsibleParty", code_style), Paragraph("Configurable 9-step export progression timeline", table_text)],
        [Paragraph("<code>notifications</code>", code_bold), Paragraph("20", table_text), Paragraph("id, userId, title, message, type, readStatus", code_style), Paragraph("Cross-role operational alerts & order status pings", table_text)],
        [Paragraph("<code>support_tickets</code>", code_bold), Paragraph("6", table_text), Paragraph("id, userId, orderId, category, priority, status", code_style), Paragraph("Helpdesk tickets for customs clearance & logistics", table_text)],
        [Paragraph("<code>feedback</code>", code_bold), Paragraph("2", table_text), Paragraph("userName, userEmail, rating, category, message", code_style), Paragraph("User ratings, satisfaction scores & UI suggestions", table_text)],
    ]
    db_table = Table(db_data, colWidths=[90, 32, 222, 160])
    db_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(db_table)
    story.append(Spacer(1, 8))

    # SECTION 6: HOW TO LAUNCH EVERYTHING
    story.append(Paragraph("6. Project Execution & 1-Click Launch Guide", h1_style))
    story.append(Paragraph(
        "The entire platform can be launched in a single command using the pre-configured Windows batch script or individually:",
        body_style
    ))
    
    cmd_data = [
        [Paragraph("<b>Execution Mode</b>", table_header), Paragraph("<b>Terminal Command</b>", table_header), Paragraph("<b>What it Does</b>", table_header)],
        [
            Paragraph("<b>1-Click Master Launch</b><br/>(Recommended)", table_text),
            Paragraph("<code>.\\run_project.bat</code>", code_bold),
            Paragraph("Checks MongoDB, seeds all 173 records, launches Django Backend (8000), Vite Frontend (5173), and Expo Mobile (8081) in dedicated consoles.", table_text)
        ],
        [
            Paragraph("<b>Backend API & Console</b>", table_text),
            Paragraph("<code>cd backend<br/>.\\venv\\Scripts\\python.exe manage.py runserver 127.0.0.1:8000</code>", code_style),
            Paragraph("Starts Django REST Framework server and single-page developer console.", table_text)
        ],
        [
            Paragraph("<b>Web Frontend (Vite)</b>", table_text),
            Paragraph("<code>cd Dakh-main<br/>npm run dev -- --host 127.0.0.1 --port 5173</code>", code_style),
            Paragraph("Starts Vite development server for Seller, Operator, Admin, and Buyer portals.", table_text)
        ],
        [
            Paragraph("<b>Mobile App (Expo)</b>", table_text),
            Paragraph("<code>cd mobile<br/>npx expo start --web --port 8081</code>", code_style),
            Paragraph("Starts Expo Metro Bundler and cross-platform web simulator on port 8081.", table_text)
        ],
        [
            Paragraph("<b>Test & Seed DB (CLI)</b>", table_text),
            Paragraph("<code>cd backend<br/>.\\venv\\Scripts\\python.exe test_backend_and_mongo.py</code>", code_style),
            Paragraph("Executes automated health checks against MongoDB and all 16 REST endpoints.", table_text)
        ],
    ]
    cmd_table = Table(cmd_data, colWidths=[110, 210, 184])
    cmd_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E2E8F0")),
        ('BOX', (0,0), (-1,-1), 0.5, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(cmd_table)
    story.append(Spacer(1, 8))

    # Conclusion Block
    conclusion_html = """
    <b>Summary & SIH 2026 Impact:</b> Niryat Saathi delivers an institutional-grade, production-ready solution that bridges local Indian rural production with global buyers. By integrating India Post's unmatched postal footprint with intelligent software, the platform turns every local post office into a global export gateway.
    """
    conclusion_table = Table([[Paragraph(conclusion_html, body_style)]], colWidths=[504])
    conclusion_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86EFAC")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(conclusion_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    out_file1 = os.path.abspath("Niryat_Saathi_Technical_Documentation.pdf")
    out_file2 = os.path.abspath("Niryat_Saathi_Project_Flow_Documentation.pdf")
    build_pdf(out_file1)
    build_pdf(out_file2)
