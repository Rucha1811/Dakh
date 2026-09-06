export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  packagingType: string;
  countryOfOrigin: string;
  images: string[];
  stock: number;
  exportStatus: 'READY' | 'IN_PROGRESS' | 'NOT_STARTED';
  hsCode?: string;
  material?: string;
  intendedUse?: string;
}

export interface DNK {
  id: string;
  name: string;
  state: string;
  district: string;
  address: string;
  pinCode: string;
  services: string[];
  status: 'Open' | 'Closed';
  contactPhone: string;
  operatingHours: string;
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer' | 'admin' | 'operator';
  phone: string;
  location: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  buyerName: string;
  destination: string;
  itemDescription: string;
  carrier: string;
  status: 'Booked' | 'Customs Cleared' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  progress: number;
  estimatedDelivery: string;
  dnkCenter: string;
  timeline: { title: string; date: string; location: string; done: boolean }[];
}

export interface ExportDocument {
  id: string;
  title: string;
  type: string;
  status: 'Ready' | 'Pending' | 'Draft';
  description: string;
  issuedBy: string;
  validity: string;
  mandatory: boolean;
}

export const USERS: UserProfile[] = [
  { id: 'USR001', name: 'Meera Patel', email: 'seller@demo.com', role: 'seller', phone: '+91 98765 43210', location: 'Ahmedabad, Gujarat' },
  { id: 'USR002', name: 'Rajesh Kumar', email: 'operator@demo.com', role: 'operator', phone: '+91 98765 43211', location: 'Ahmedabad DNK Hub' },
  { id: 'USR003', name: 'Priya Sharma', email: 'admin@demo.com', role: 'admin', phone: '+91 98765 43212', location: 'India Post HQ' },
  { id: 'USR004', name: 'Hans Mueller', email: 'buyer@demo.com', role: 'buyer', phone: '+49 176 12345678', location: 'Munich, Germany' },
];

export const GUJARAT_DNKS: DNK[] = [
  {
    id: 'DNK001',
    name: 'Ahmedabad Head Post Office GPO DNK',
    state: 'Gujarat',
    district: 'Ahmedabad',
    address: 'Bhadra, Near Lal Darwaja, Ahmedabad, Gujarat 380001',
    pinCode: '380001',
    services: ['Export Assistance', 'Customs Packaging', 'PBE Documentation', 'International EMS Booking'],
    status: 'Open',
    contactPhone: '+91 79 2657 1234',
    operatingHours: '9:00 AM – 6:00 PM',
    lat: 23.0258,
    lng: 72.5857,
  },
  {
    id: 'DNK002',
    name: 'Bhuj Head Post Office DNK',
    state: 'Gujarat',
    district: 'Bhuj',
    address: 'Station Road, Near Jubilee Ground, Bhuj, Gujarat 370001',
    pinCode: '370001',
    services: ['Handicraft Export Support', 'PBE-III Filing', 'Customs Packing', 'Shipment Booking'],
    status: 'Open',
    contactPhone: '+91 2832 234567',
    operatingHours: '9:00 AM – 5:30 PM',
    lat: 23.2420,
    lng: 69.6669,
  },
  {
    id: 'DNK003',
    name: 'Surat Head Post Office DNK',
    state: 'Gujarat',
    district: 'Surat',
    address: '78, Ring Road, Athwagate, Surat, Gujarat 395001',
    pinCode: '395001',
    services: ['Textile & Diamond Export', 'Packaging Assistance', 'Commercial Invoicing', 'EMS International'],
    status: 'Open',
    contactPhone: '+91 261 2345678',
    operatingHours: '9:00 AM – 6:00 PM',
    lat: 21.1702,
    lng: 72.8311,
  },
  {
    id: 'DNK011',
    name: 'Navrangpura Post Office DNK',
    state: 'Gujarat',
    district: 'Ahmedabad',
    address: 'Near CG Road, Navrangpura, Ahmedabad, Gujarat 380009',
    pinCode: '380009',
    services: ['MSME Export Counter', 'Shipment Booking', 'Documentation Support'],
    status: 'Open',
    contactPhone: '+91 79 2630 1234',
    operatingHours: '9:00 AM – 5:00 PM',
    lat: 23.0365,
    lng: 72.5611,
  },
  {
    id: 'DNK012',
    name: 'Gandhinagar Sector 16 HPO DNK',
    state: 'Gujarat',
    district: 'Gandhinagar',
    address: 'Sector 16, Shopping Complex, Gandhinagar, Gujarat 382016',
    pinCode: '382016',
    services: ['Export Assistance', 'Packaging Service', 'Shipment Booking'],
    status: 'Open',
    contactPhone: '+91 79 2320 1234',
    operatingHours: '9:30 AM – 5:30 PM',
    lat: 23.2156,
    lng: 72.6369,
  },
  {
    id: 'DNK013',
    name: 'Vadodara Raopura HPO DNK',
    state: 'Gujarat',
    district: 'Vadodara',
    address: 'Raopura Road, Mandvi, Vadodara, Gujarat 390001',
    pinCode: '390001',
    services: ['Artisan Assistance', 'Packaging & Seal', 'Postal Bill of Export', 'Express Dispatch'],
    status: 'Open',
    contactPhone: '+91 265 2412345',
    operatingHours: '9:00 AM – 6:00 PM',
    lat: 22.3072,
    lng: 73.1812,
  },
  {
    id: 'DNK014',
    name: 'Rajkot Head Post Office DNK',
    state: 'Gujarat',
    district: 'Rajkot',
    address: 'MG Road, Sadar Bazar, Rajkot, Gujarat 360001',
    pinCode: '360001',
    services: ['Silverware & Handicraft Export', 'Packaging Labelling', 'DNK Express'],
    status: 'Open',
    contactPhone: '+91 281 2223344',
    operatingHours: '9:00 AM – 6:00 PM',
    lat: 22.3039,
    lng: 70.8022,
  },
  {
    id: 'DNK015',
    name: 'Jamnagar Head Post Office DNK',
    state: 'Gujarat',
    district: 'Jamnagar',
    address: 'Chandi Bazaar, Jamnagar, Gujarat 361001',
    pinCode: '361001',
    services: ['Brass Part & Bandhani Export', 'Documentation', 'Postal Clearance'],
    status: 'Open',
    contactPhone: '+91 288 2551234',
    operatingHours: '9:30 AM – 5:30 PM',
    lat: 22.4707,
    lng: 70.0577,
  },
  {
    id: 'DNK016',
    name: 'Bhavnagar Head Post Office DNK',
    state: 'Gujarat',
    district: 'Bhavnagar',
    address: 'High Court Road, Bhavnagar, Gujarat 364001',
    pinCode: '364001',
    services: ['Export Shipment', 'Packing Box Provision', 'Customs Bill Support'],
    status: 'Open',
    contactPhone: '+91 278 2421234',
    operatingHours: '9:00 AM – 5:00 PM',
    lat: 21.7645,
    lng: 72.1519,
  },
  {
    id: 'DNK017',
    name: 'Anand Head Post Office DNK',
    state: 'Gujarat',
    district: 'Anand',
    address: 'Amul Dairy Road, Anand, Gujarat 388001',
    pinCode: '388001',
    services: ['Agro & Dairy Craft Export', 'Packaging Support', 'Shipment Dispatch'],
    status: 'Open',
    contactPhone: '+91 2692 245678',
    operatingHours: '9:00 AM – 5:30 PM',
    lat: 22.5645,
    lng: 72.9289,
  },
  {
    id: 'DNK018',
    name: 'Junagadh Head Post Office DNK',
    state: 'Gujarat',
    district: 'Junagadh',
    address: 'Azad Chowk, Junagadh, Gujarat 362001',
    pinCode: '362001',
    services: ['Artisan Guidance', 'Packaging', 'Postal Export Booking'],
    status: 'Open',
    contactPhone: '+91 285 2623456',
    operatingHours: '9:30 AM – 5:00 PM',
    lat: 21.5222,
    lng: 70.4579,
  },
  {
    id: 'DNK019',
    name: 'Mehsana Head Post Office DNK',
    state: 'Gujarat',
    district: 'Mehsana',
    address: 'Radhanpur Road, Mehsana, Gujarat 384002',
    pinCode: '384002',
    services: ['Handloom Export Counter', 'Customs Verification', 'Booking'],
    status: 'Open',
    contactPhone: '+91 2762 251234',
    operatingHours: '9:00 AM – 5:00 PM',
    lat: 23.5880,
    lng: 72.3693,
  },
  {
    id: 'DNK020',
    name: 'Bharuch Station Road DNK',
    state: 'Gujarat',
    district: 'Bharuch',
    address: 'Station Road, Bharuch, Gujarat 392001',
    pinCode: '392001',
    services: ['Industrial & Craft Export', 'Packaging Assistance', 'PBE-IV'],
    status: 'Open',
    contactPhone: '+91 2642 261234',
    operatingHours: '9:30 AM – 5:30 PM',
    lat: 21.7051,
    lng: 72.9959,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'PRD001',
    sellerId: 'SEL001',
    name: 'Handcrafted Gujarati Wooden Decorative Box',
    description: 'A beautifully hand-carved wooden decorative box featuring traditional Gujarati motifs. Made from sustainable teak wood with intricate inlay work.',
    category: 'Handicrafts',
    price: 2000,
    currency: 'INR',
    weight: 0.8,
    dimensions: { length: 20, width: 15, height: 10 },
    packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 45,
    exportStatus: 'READY',
    hsCode: '442090',
    material: 'Teak Wood',
    intendedUse: 'Home Decor',
  },
  {
    id: 'PRD002',
    sellerId: 'SEL001',
    name: 'Kutch Embroidery Sling Bag',
    description: 'Hand-embroidered cotton sling bag featuring traditional Kutch mirror work and colorful thread patterns.',
    category: 'Textiles',
    price: 1500,
    currency: 'INR',
    weight: 0.3,
    dimensions: { length: 25, width: 20, height: 5 },
    packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 120,
    exportStatus: 'IN_PROGRESS',
    hsCode: '420222',
    material: 'Cotton & Glass Mirrors',
    intendedUse: 'Fashion Accessory',
  },
  {
    id: 'PRD003',
    sellerId: 'SEL001',
    name: 'Brass Ganesh Idol — Miniature',
    description: 'Handcrafted miniature brass Ganesh idol, perfect for home decor, gifting, or temple.',
    category: 'Handicrafts',
    price: 800,
    currency: 'INR',
    weight: 0.4,
    dimensions: { length: 8, width: 6, height: 10 },
    packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1567591414240-e22137cf91c0?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 200,
    exportStatus: 'NOT_STARTED',
    hsCode: '741980',
    material: 'Brass',
    intendedUse: 'Religious/Decorative',
  },
  {
    id: 'PRD004',
    sellerId: 'SEL002',
    name: 'Kutch Ajrakh Block Print Stole',
    description: 'Traditional Ajrakh hand-block printed cotton stole using natural dyes from Bhuj.',
    category: 'Textiles',
    price: 1200,
    currency: 'INR',
    weight: 0.2,
    dimensions: { length: 180, width: 70, height: 0.5 },
    packagingType: 'Bubble Wrap',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 80,
    exportStatus: 'READY',
    hsCode: '621490',
    material: 'Organic Cotton',
    intendedUse: 'Apparel',
  },
];

export const SHIPMENTS: Shipment[] = [
  {
    id: 'SHP001',
    trackingNumber: 'IN-EMS-784910234',
    orderId: 'ORD-9481',
    buyerName: 'Hans Mueller (Munich, Germany)',
    destination: 'Germany',
    itemDescription: 'Handcrafted Gujarati Wooden Decorative Box (x2)',
    carrier: 'India Post International EMS',
    status: 'In Transit',
    progress: 75,
    estimatedDelivery: '24 Aug 2026',
    dnkCenter: 'Ahmedabad GPO DNK',
    timeline: [
      { title: 'DNK Booking Confirmed', date: '18 Aug, 10:30 AM', location: 'Ahmedabad GPO DNK', done: true },
      { title: 'Customs Packaging & Verification', date: '18 Aug, 02:15 PM', location: 'Ahmedabad FPO', done: true },
      { title: 'Dispatched to Gateway', date: '19 Aug, 08:00 AM', location: 'Mumbai Air Cargo Hub', done: true },
      { title: 'In Flight Transit', date: '20 Aug, 04:30 AM', location: 'Frankfurt Airport Hub', done: true },
      { title: 'Final Mile Delivery', date: 'Est. 24 Aug', location: 'Munich, Germany', done: false },
    ],
  },
  {
    id: 'SHP002',
    trackingNumber: 'IN-EMS-992817456',
    orderId: 'ORD-9482',
    buyerName: 'Emma Watson (London, UK)',
    destination: 'United Kingdom',
    itemDescription: 'Kutch Ajrakh Block Print Stoles (x4)',
    carrier: 'India Post International EMS',
    status: 'Customs Cleared',
    progress: 50,
    estimatedDelivery: '26 Aug 2026',
    dnkCenter: 'Bhuj Head Post Office DNK',
    timeline: [
      { title: 'DNK Booking & PBE-III Filed', date: '19 Aug, 11:00 AM', location: 'Bhuj DNK Counter', done: true },
      { title: 'Export Customs Cleared', date: '20 Aug, 09:30 AM', location: 'Ahmedabad Foreign Post Office', done: true },
      { title: 'En Route to Mumbai Gateway', date: 'In Progress', location: 'Transit Mumbai', done: false },
      { title: 'International Departure', date: 'Pending', location: 'London Heathrow Hub', done: false },
    ],
  },
];

export const EXPORT_DOCUMENTS: ExportDocument[] = [
  {
    id: 'DOC001',
    title: 'Postal Bill of Export (PBE-III)',
    type: 'Customs Declaration',
    status: 'Ready',
    description: 'Mandatory declaration for commercial goods exported through India Post DNK counters.',
    issuedBy: 'India Post / CBIC',
    validity: 'Per Shipment',
    mandatory: true,
  },
  {
    id: 'DOC002',
    title: 'Importer-Exporter Code (IEC)',
    type: 'Business License',
    status: 'Ready',
    description: 'Unique 10-digit code issued by DGFT required for commercial exports from India.',
    issuedBy: 'DGFT (Ministry of Commerce)',
    validity: 'Lifetime (Annual KYC)',
    mandatory: true,
  },
  {
    id: 'DOC003',
    title: 'Letter of Undertaking (LUT) / GST',
    type: 'Tax Exemption',
    status: 'Ready',
    description: 'Filing to export goods without paying upfront IGST under zero-rated export rules.',
    issuedBy: 'GST Portal (CBIC)',
    validity: 'Financial Year 2026-27',
    mandatory: true,
  },
  {
    id: 'DOC004',
    title: 'Certificate of Origin (CoO)',
    type: 'Origin Verification',
    status: 'Pending',
    description: 'Proof that products are authentic Indian handicrafts for preferential tariff in EU/UK.',
    issuedBy: 'Export Inspection Council / EPCH',
    validity: 'Per Shipment',
    mandatory: false,
  },
];
