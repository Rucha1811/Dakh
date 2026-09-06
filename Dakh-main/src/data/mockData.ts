// ============================================================
// NIRYAT SAATHI — Complete Mock Data Layer
// ============================================================

// --- TYPES ---

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'seller' | 'operator' | 'admin' | 'buyer';
  language: string;
  location: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  address: string;
  state: string;
  district: string;
  pinCode: string;
  verificationStatus: 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIVE';
  exportReadiness: number;
}

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
  exportStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY' | 'SUBMITTED' | 'PROCESSING' | 'COMPLETED';
  destinationCountry?: string;
  hsCode?: string;
  material?: string;
  intendedUse?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
  amount: number;
  currency: string;
  destination: string;
  status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  estimatedDelivery: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  dnkId: string;
  currentStatus: 'CREATED' | 'DNK_RECEIVED' | 'EXPORT_PROCESSING' | 'CUSTOMS' | 'DISPATCHED' | 'IN_TRANSIT' | 'DESTINATION_PROCESSING' | 'DELIVERED' | 'DELAYED';
  events: ShipmentEvent[];
  estimatedDelivery: string;
  createdAt: string;
  lastUpdated: string;
}

export interface ShipmentEvent {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

export interface DocRecord {
  id: string;
  sellerId: string;
  orderId?: string;
  type: string;
  name: string;
  status: 'DRAFT' | 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED';
  fileName?: string;
  uploadedAt: string;
  verifiedAt?: string;
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
  lat?: number;
  lng?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface ComplianceRule {
  id: string;
  productCategory: string;
  destination: string;
  requirement: string;
  document: string;
  status: 'Active' | 'Inactive';
}

export interface ExportJourneyStep {
  step: number;
  title: string;
  description: string;
  responsible: string;
}

export interface AssistantQA {
  question: string;
  answer: string;
  nextSteps: string[];
  requiredDocuments: string[];
  actionButton?: string;
  actionLink?: string;
}

// Runtime object fallbacks for bundlers
export const User = {};
export const Seller = {};
export const Product = {};
export const Order = {};
export const Shipment = {};
export const DocRecord = {};
export const DNK = {};
export const Notification = {};
export const SupportTicket = {};
export const ComplianceRule = {};
export const CountryCompliance = {};
export const HSCodeItem = {};
export const ExportJourneyStep = {};
export const AssistantQA = {};

// --- USERS ---

export const USERS: User[] = [
  { id: 'USR001', name: 'Meera Patel', email: 'seller@demo.com', phone: '+91 98765 43210', role: 'seller', language: 'en', location: 'Ahmedabad, Gujarat', createdAt: '2025-08-15' },
  { id: 'USR002', name: 'Rajesh Kumar', email: 'operator@demo.com', phone: '+91 98765 43211', role: 'operator', language: 'en', location: 'Ahmedabad, Gujarat', createdAt: '2025-06-10' },
  { id: 'USR003', name: 'Priya Sharma', email: 'admin@demo.com', phone: '+91 98765 43212', role: 'admin', language: 'en', location: 'New Delhi', createdAt: '2025-01-01' },
  { id: 'USR004', name: 'Hans Mueller', email: 'buyer@demo.com', phone: '+49 176 12345678', role: 'buyer', language: 'en', location: 'Munich, Germany', createdAt: '2025-09-20' },
];

export const DEMO_CREDENTIALS = {
  seller: { email: 'seller@demo.com', password: 'demo123' },
  operator: { email: 'operator@demo.com', password: 'demo123' },
  admin: { email: 'admin@demo.com', password: 'demo123' },
  buyer: { email: 'buyer@demo.com', password: 'demo123' },
};

// --- SELLERS ---

export const SELLERS: Seller[] = [
  { id: 'SEL001', userId: 'USR001', businessName: 'Meera Handicrafts', businessType: 'Individual Artisan', address: '12, Nehru Nagar, Bopal', state: 'Gujarat', district: 'Ahmedabad', pinCode: '380058', verificationStatus: 'ACTIVE', exportReadiness: 92 },
  { id: 'SEL002', userId: 'USR005', businessName: 'Kutch Craft Collective', businessType: 'SHG / Cooperative', address: '45, Railway Road', state: 'Gujarat', district: 'Bhuj', pinCode: '370001', verificationStatus: 'ACTIVE', exportReadiness: 78 },
  { id: 'SEL003', userId: 'USR006', businessName: 'Surat Textile Works', businessType: 'MSME', address: '78, Ring Road, Athwa', state: 'Gujarat', district: 'Surat', pinCode: '395001', verificationStatus: 'ACTIVE', exportReadiness: 85 },
  { id: 'SEL004', userId: 'USR007', businessName: 'Jaipur Artisan Studio', businessType: 'Individual Artisan', address: '23, Johari Bazaar', state: 'Rajasthan', district: 'Jaipur', pinCode: '302003', verificationStatus: 'VERIFIED', exportReadiness: 70 },
  { id: 'SEL005', userId: 'USR008', businessName: 'Bengal Terracotta Collective', businessType: 'SHG / Cooperative', address: '56, Shyambazar', state: 'West Bengal', district: 'Kolkata', pinCode: '700004', verificationStatus: 'ACTIVE', exportReadiness: 65 },
  { id: 'SEL006', userId: 'USR009', businessName: 'Kerala Spice Traders', businessType: 'MSME', address: '90, Mattancherry', state: 'Kerala', district: 'Kochi', pinCode: '682002', verificationStatus: 'ACTIVE', exportReadiness: 88 },
  { id: 'SEL007', userId: 'USR010', businessName: 'Varanasi Silk House', businessType: 'Small Enterprise', address: '12, Godowlia Market', state: 'Uttar Pradesh', district: 'Varanasi', pinCode: '221001', verificationStatus: 'VERIFIED', exportReadiness: 72 },
  { id: 'SEL008', userId: 'USR011', businessName: 'Chennai Brass Works', businessType: 'MSME', address: '34, T Nagar', state: 'Tamil Nadu', district: 'Chennai', pinCode: '600017', verificationStatus: 'ACTIVE', exportReadiness: 80 },
  { id: 'SEL009', userId: 'USR012', businessName: 'Mysore Sandalwood Crafts', businessType: 'Individual Artisan', address: '67, Devaraja Mohalla', state: 'Karnataka', district: 'Mysore', pinCode: '570001', verificationStatus: 'PENDING_VERIFICATION', exportReadiness: 55 },
  { id: 'SEL010', userId: 'USR013', businessName: 'Mumbai Leather Goods', businessType: 'Small Enterprise', address: '89, Dharavi', state: 'Maharashtra', district: 'Mumbai', pinCode: '400069', verificationStatus: 'ACTIVE', exportReadiness: 90 },
];

// --- PRODUCTS ---

export const PRODUCTS: Product[] = [
  {
    id: 'PRD001', sellerId: 'SEL001', name: 'Handcrafted Gujarati Wooden Decorative Box',
    description: 'A beautifully hand-carved wooden decorative box featuring traditional Gujarati motifs. Made from sustainable teak wood with intricate inlay work. Perfect for home decor or gifting.',
    category: 'Handicrafts', price: 2000, currency: 'INR', weight: 0.8,
    dimensions: { length: 20, width: 15, height: 10 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 45,
    exportStatus: 'READY', destinationCountry: 'Germany', hsCode: '442090', material: 'Teak Wood', intendedUse: 'Home Decor',
    createdAt: '2025-09-01'
  },
  {
    id: 'PRD002', sellerId: 'SEL001', name: 'Kutch Embroidery Sling Bag',
    description: 'Hand-embroidered cotton sling bag featuring traditional Kutch mirror work and colorful thread patterns. Each bag is unique.',
    category: 'Textiles', price: 1500, currency: 'INR', weight: 0.3,
    dimensions: { length: 25, width: 20, height: 5 }, packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 120,
    exportStatus: 'IN_PROGRESS', material: 'Cotton', intendedUse: 'Fashion Accessory',
    createdAt: '2025-09-15'
  },
  {
    id: 'PRD003', sellerId: 'SEL001', name: 'Brass Ganesh Idol — Miniature',
    description: 'Handcrafted miniature brass Ganesh idol, perfect for car dashboard, office desk, or home temple.',
    category: 'Handicrafts', price: 800, currency: 'INR', weight: 0.4,
    dimensions: { length: 8, width: 6, height: 10 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1567591414240-e22137cf91c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 200,
    exportStatus: 'NOT_STARTED', material: 'Brass', intendedUse: 'Religious/Decorative',
    createdAt: '2025-10-01'
  },
  {
    id: 'PRD004', sellerId: 'SEL002', name: 'Kutch Ajrakh Block Print Stole',
    description: 'Traditional Ajrakh hand-block printed cotton stole using natural dyes. Eco-friendly and sustainable.',
    category: 'Textiles', price: 1200, currency: 'INR', weight: 0.2,
    dimensions: { length: 180, width: 70, height: 0.5 }, packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 80,
    exportStatus: 'READY', destinationCountry: 'UK', material: 'Cotton', intendedUse: 'Fashion',
    createdAt: '2025-08-20'
  },
  {
    id: 'PRD005', sellerId: 'SEL003', name: 'Banarasi Silk Scarf',
    description: 'Pure Banarasi silk scarf with gold zari border. Handwoven by master artisans in Surat.',
    category: 'Textiles', price: 3500, currency: 'INR', weight: 0.15,
    dimensions: { length: 200, width: 80, height: 0.3 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    exportStatus: 'READY', destinationCountry: 'USA', material: 'Silk', intendedUse: 'Fashion',
    createdAt: '2025-09-10'
  },
  {
    id: 'PRD006', sellerId: 'SEL004', name: 'Blue Pottery Flower Vase',
    description: 'Traditional Jaipur blue pottery flower vase with hand-painted floral design. Lead-free and food safe.',
    category: 'Home Decor', price: 2800, currency: 'INR', weight: 1.2,
    dimensions: { length: 12, width: 12, height: 25 }, packagingType: 'Wooden Crate',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    exportStatus: 'IN_PROGRESS', destinationCountry: 'France', material: 'Quartz Stone Powder', intendedUse: 'Home Decor',
    createdAt: '2025-08-25'
  },
  {
    id: 'PRD007', sellerId: 'SEL005', name: 'Bengal Terracotta Horse',
    description: 'Traditional Bankura terracotta horse, an iconic folk art piece from Bengal. Handmade and kiln-fired.',
    category: 'Handicrafts', price: 1800, currency: 'INR', weight: 1.5,
    dimensions: { length: 15, width: 10, height: 22 }, packagingType: 'Wooden Crate',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    exportStatus: 'NOT_STARTED', material: 'Terracotta Clay', intendedUse: 'Art/Collectible',
    createdAt: '2025-10-05'
  },
  {
    id: 'PRD008', sellerId: 'SEL006', name: 'Malabar Black Pepper — 500g',
    description: 'Premium single-origin Malabar black pepper from Kerala spice gardens. Sun-dried and hand-sorted.',
    category: 'Food Products', price: 600, currency: 'INR', weight: 0.55,
    dimensions: { length: 15, width: 10, height: 8 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 500,
    exportStatus: 'READY', destinationCountry: 'UAE', material: 'Natural Spice', intendedUse: 'Cooking',
    createdAt: '2025-09-20'
  },
  {
    id: 'PRD009', sellerId: 'SEL007', name: 'Varanasi Banarasi Dupatta',
    description: 'Pure silk Banarasi dupatta with intricate meenakari work. A timeless piece of Indian textile heritage.',
    category: 'Textiles', price: 5000, currency: 'INR', weight: 0.25,
    dimensions: { length: 250, width: 100, height: 0.3 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    exportStatus: 'IN_PROGRESS', destinationCountry: 'USA', material: 'Silk', intendedUse: 'Fashion',
    createdAt: '2025-08-10'
  },
  {
    id: 'PRD010', sellerId: 'SEL008', name: 'Chennai Brass Lamp — Traditional',
    description: 'Traditional South Indian brass kuthu vilakku (standing lamp). Used in pooja and home decor.',
    category: 'Handicrafts', price: 2200, currency: 'INR', weight: 1.8,
    dimensions: { length: 10, width: 10, height: 35 }, packagingType: 'Wooden Crate',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567591414240-e22137cf91c0?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 20,
    exportStatus: 'READY', destinationCountry: 'Singapore', material: 'Brass', intendedUse: 'Religious/Decorative',
    createdAt: '2025-09-05'
  },
  {
    id: 'PRD011', sellerId: 'SEL010', name: 'Mumbai Hand-stitched Leather Journal',
    description: 'Genuine leather journal with handmade cotton pages. Perfect for artists and writers.',
    category: 'Eco-Friendly Products', price: 1800, currency: 'INR', weight: 0.45,
    dimensions: { length: 22, width: 16, height: 3 }, packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e37278?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 60,
    exportStatus: 'READY', destinationCountry: 'Canada', material: 'Leather & Cotton', intendedUse: 'Stationery',
    createdAt: '2025-09-25'
  },
  {
    id: 'PRD012', sellerId: 'SEL002', name: 'Kutch Lippan Art Wall Mirror',
    description: 'Traditional Lippan (mud and mirror) art piece from Kutch. Embedded with real mirrors and clay work.',
    category: 'Home Decor', price: 3200, currency: 'INR', weight: 2.0,
    dimensions: { length: 40, width: 40, height: 3 }, packagingType: 'Wooden Crate',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 8,
    exportStatus: 'NOT_STARTED', material: 'Clay & Mirror', intendedUse: 'Home Decor',
    createdAt: '2025-10-10'
  },
  {
    id: 'PRD013', sellerId: 'SEL006', name: 'Kerala Cardamom — 250g',
    description: 'Premium grade-A cardamom pods from the spice gardens of Idukki, Kerala.',
    category: 'Food Products', price: 450, currency: 'INR', weight: 0.28,
    dimensions: { length: 12, width: 8, height: 6 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 300,
    exportStatus: 'READY', destinationCountry: 'Germany', material: 'Natural Spice', intendedUse: 'Cooking',
    createdAt: '2025-10-01'
  },
  {
    id: 'PRD014', sellerId: 'SEL004', name: 'Jaipur Lac Bangles Set (12)',
    description: 'Set of 12 traditional Rajasthani lac bangles with mirror and stone work. Assorted colors.',
    category: 'Jewellery', price: 900, currency: 'INR', weight: 0.35,
    dimensions: { length: 15, width: 15, height: 5 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1611591475155-426c623c2807?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 150,
    exportStatus: 'IN_PROGRESS', destinationCountry: 'UK', material: 'Lac & Glass', intendedUse: 'Fashion',
    createdAt: '2025-09-18'
  },
  {
    id: 'PRD015', sellerId: 'SEL005', name: 'Dokra Metal Craft Elephant',
    description: 'Lost-wax casting (Dokra) metal elephant figurine. Ancient tribal craft from Bengal.',
    category: 'Handicrafts', price: 2500, currency: 'INR', weight: 0.9,
    dimensions: { length: 12, width: 8, height: 15 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1567591414240-e22137cf91c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    exportStatus: 'NOT_STARTED', material: 'Brass Alloy', intendedUse: 'Art/Collectible',
    createdAt: '2025-10-15'
  },
  {
    id: 'PRD016', sellerId: 'SEL003', name: 'Patola Silk Stole',
    description: 'Double ikat Patola silk stole. One of the most complex weaving techniques in the world.',
    category: 'Textiles', price: 8000, currency: 'INR', weight: 0.2,
    dimensions: { length: 200, width: 70, height: 0.3 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 5,
    exportStatus: 'READY', destinationCountry: 'Japan', material: 'Silk', intendedUse: 'Luxury Fashion',
    createdAt: '2025-08-15'
  },
  {
    id: 'PRD017', sellerId: 'SEL008', name: 'Tanjore Painting — Krishna',
    description: 'Traditional Tanjore (Thanjavur) painting with gold foil and semi-precious stones.',
    category: 'Art', price: 12000, currency: 'INR', weight: 1.0,
    dimensions: { length: 30, width: 25, height: 2 }, packagingType: 'Wooden Crate',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 3,
    exportStatus: 'NOT_STARTED', material: 'Gold Foil & Stones', intendedUse: 'Art/Collectible',
    createdAt: '2025-10-20'
  },
  {
    id: 'PRD018', sellerId: 'SEL010', name: 'Eco Jute Tote Bag',
    description: 'Handwoven jute tote bag with block print design. 100% biodegradable.',
    category: 'Eco-Friendly Products', price: 350, currency: 'INR', weight: 0.15,
    dimensions: { length: 35, width: 30, height: 15 }, packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 200,
    exportStatus: 'READY', destinationCountry: 'Australia', material: 'Jute', intendedUse: 'Shopping Bag',
    createdAt: '2025-10-08'
  },
  {
    id: 'PRD019', sellerId: 'SEL007', name: 'Chikankari Cotton Kurta',
    description: 'Elegant Lucknowi Chikankari hand-embroidered cotton kurta. Delicate shadow work.',
    category: 'Textiles', price: 2200, currency: 'INR', weight: 0.3,
    dimensions: { length: 70, width: 50, height: 2 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 35,
    exportStatus: 'READY', destinationCountry: 'UAE', material: 'Cotton', intendedUse: 'Fashion',
    createdAt: '2025-09-28'
  },
  {
    id: 'PRD020', sellerId: 'SEL009', name: 'Mysore Sandalwood Soap Set (6)',
    description: 'Set of 6 pure Mysore sandalwood soaps. Ayurvedic, natural fragrance.',
    category: 'Traditional Products', price: 750, currency: 'INR', weight: 0.5,
    dimensions: { length: 15, width: 10, height: 5 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1607006314144-4828b8cf4505?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 100,
    exportStatus: 'NOT_STARTED', material: 'Sandalwood Oil', intendedUse: 'Personal Care',
    createdAt: '2025-10-12'
  },
  {
    id: 'PRD021', sellerId: 'SEL006', name: 'Kerala Banana Chips — 300g',
    description: 'Traditional Kerala banana chips fried in coconut oil. Crispy and golden.',
    category: 'Food Products', price: 200, currency: 'INR', weight: 0.35,
    dimensions: { length: 20, width: 15, height: 5 }, packagingType: 'Cardboard Box',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 400,
    exportStatus: 'NOT_STARTED', material: 'Banana & Coconut Oil', intendedUse: 'Snack',
    createdAt: '2025-10-18'
  },
  {
    id: 'PRD022', sellerId: 'SEL001', name: 'Gujarati Bandhani Dupatta',
    description: 'Traditional tie-dye Bandhani dupatta from Gujarat. Vibrant red and gold pattern.',
    category: 'Textiles', price: 1800, currency: 'INR', weight: 0.18,
    dimensions: { length: 220, width: 80, height: 0.3 }, packagingType: 'Bubble Wrap Only',
    countryOfOrigin: 'India',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 40,
    exportStatus: 'IN_PROGRESS', material: 'Silk Blend', intendedUse: 'Fashion',
    createdAt: '2025-09-12'
  },
];

// --- ORDERS ---

export const ORDERS: Order[] = [
  { id: 'DNK10234', buyerId: 'USR004', sellerId: 'SEL001', productId: 'PRD001', quantity: 2, amount: 4000, currency: 'INR', destination: 'Germany', status: 'SHIPPED', createdAt: '2026-01-15', estimatedDelivery: '2026-02-05' },
  { id: 'DNK10235', buyerId: 'USR004', sellerId: 'SEL006', productId: 'PRD008', quantity: 5, amount: 3000, currency: 'INR', destination: 'Germany', status: 'PROCESSING', createdAt: '2026-01-18', estimatedDelivery: '2026-02-10' },
  { id: 'DNK10236', buyerId: 'USR014', sellerId: 'SEL003', productId: 'PRD005', quantity: 3, amount: 10500, currency: 'INR', destination: 'USA', status: 'CONFIRMED', createdAt: '2026-01-20', estimatedDelivery: '2026-02-15' },
  { id: 'DNK10237', buyerId: 'USR015', sellerId: 'SEL002', productId: 'PRD004', quantity: 10, amount: 12000, currency: 'INR', destination: 'UK', status: 'IN_TRANSIT', createdAt: '2026-01-10', estimatedDelivery: '2026-01-30' },
  { id: 'DNK10238', buyerId: 'USR016', sellerId: 'SEL008', productId: 'PRD010', quantity: 1, amount: 2200, currency: 'INR', destination: 'Singapore', status: 'DELIVERED', createdAt: '2025-12-20', estimatedDelivery: '2026-01-10' },
  { id: 'DNK10239', buyerId: 'USR017', sellerId: 'SEL004', productId: 'PRD006', quantity: 2, amount: 5600, currency: 'INR', destination: 'France', status: 'SHIPPED', createdAt: '2026-01-12', estimatedDelivery: '2026-02-01' },
  { id: 'DNK10240', buyerId: 'USR004', sellerId: 'SEL010', productId: 'PRD011', quantity: 4, amount: 7200, currency: 'INR', destination: 'Canada', status: 'SHIPPED', createdAt: '2026-01-14', estimatedDelivery: '2026-02-08' },
  { id: 'DNK10241', buyerId: 'USR018', sellerId: 'SEL006', productId: 'PRD013', quantity: 10, amount: 4500, currency: 'INR', destination: 'Germany', status: 'CONFIRMED', createdAt: '2026-01-22', estimatedDelivery: '2026-02-18' },
  { id: 'DNK10242', buyerId: 'USR019', sellerId: 'SEL004', productId: 'PRD014', quantity: 8, amount: 7200, currency: 'INR', destination: 'UK', status: 'PROCESSING', createdAt: '2026-01-19', estimatedDelivery: '2026-02-12' },
  { id: 'DNK10243', buyerId: 'USR020', sellerId: 'SEL003', productId: 'PRD016', quantity: 1, amount: 8000, currency: 'INR', destination: 'Japan', status: 'CONFIRMED', createdAt: '2026-01-25', estimatedDelivery: '2026-02-20' },
  { id: 'DNK10244', buyerId: 'USR014', sellerId: 'SEL010', productId: 'PRD018', quantity: 20, amount: 7000, currency: 'INR', destination: 'USA', status: 'SHIPPED', createdAt: '2026-01-08', estimatedDelivery: '2026-01-28' },
  { id: 'DNK10245', buyerId: 'USR015', sellerId: 'SEL007', productId: 'PRD009', quantity: 2, amount: 10000, currency: 'INR', destination: 'UK', status: 'IN_TRANSIT', createdAt: '2026-01-05', estimatedDelivery: '2026-01-25' },
  { id: 'DNK10246', buyerId: 'USR016', sellerId: 'SEL001', productId: 'PRD022', quantity: 3, amount: 5400, currency: 'INR', destination: 'UAE', status: 'CONFIRMED', createdAt: '2026-01-28', estimatedDelivery: '2026-02-22' },
  { id: 'DNK10247', buyerId: 'USR017', sellerId: 'SEL005', productId: 'PRD007', quantity: 5, amount: 9000, currency: 'INR', destination: 'Australia', status: 'PROCESSING', createdAt: '2026-01-21', estimatedDelivery: '2026-02-14' },
  { id: 'DNK10248', buyerId: 'USR018', sellerId: 'SEL008', productId: 'PRD017', quantity: 1, amount: 12000, currency: 'INR', destination: 'USA', status: 'CONFIRMED', createdAt: '2026-01-26', estimatedDelivery: '2026-02-25' },
  { id: 'DNK10249', buyerId: 'USR019', sellerId: 'SEL007', productId: 'PRD019', quantity: 6, amount: 13200, currency: 'INR', destination: 'UAE', status: 'DELIVERED', createdAt: '2025-12-15', estimatedDelivery: '2026-01-05' },
  { id: 'DNK10250', buyerId: 'USR020', sellerId: 'SEL002', productId: 'PRD012', quantity: 2, amount: 6400, currency: 'INR', destination: 'Germany', status: 'SHIPPED', createdAt: '2026-01-11', estimatedDelivery: '2026-02-02' },
  { id: 'DNK10251', buyerId: 'USR004', sellerId: 'SEL009', productId: 'PRD020', quantity: 15, amount: 11250, currency: 'INR', destination: 'Germany', status: 'CONFIRMED', createdAt: '2026-01-27', estimatedDelivery: '2026-02-24' },
  { id: 'DNK10252', buyerId: 'USR014', sellerId: 'SEL006', productId: 'PRD021', quantity: 50, amount: 10000, currency: 'INR', destination: 'USA', status: 'CONFIRMED', createdAt: '2026-01-29', estimatedDelivery: '2026-02-28' },
  { id: 'DNK10253', buyerId: 'USR015', sellerId: 'SEL001', productId: 'PRD003', quantity: 10, amount: 8000, currency: 'INR', destination: 'UK', status: 'IN_TRANSIT', createdAt: '2026-01-07', estimatedDelivery: '2026-01-27' },
];

// --- SHIPMENTS ---

export const SHIPMENTS: Shipment[] = [
  {
    id: 'SHP001', orderId: 'DNK10234', trackingNumber: 'DNK-DE-2026-00124', dnkId: 'DNK001',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-02-05', createdAt: '2026-01-17', lastUpdated: '2026-01-25',
    events: [
      { status: 'CREATED', timestamp: '2026-01-17T09:00:00Z', location: 'Ahmedabad', description: 'Shipment created by seller' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-18T14:30:00Z', location: 'Ahmedabad Head Post Office DNK', description: 'Package received at DNK' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-19T10:00:00Z', location: 'Ahmedabad', description: 'Export documentation processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-20T16:45:00Z', location: 'Ahmedabad Customs', description: 'Customs clearance in progress' },
      { status: 'DISPATCHED', timestamp: '2026-01-22T08:00:00Z', location: 'Ahmedabad', description: 'Dispatched via India Post International' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-25T12:00:00Z', location: 'Mumbai Sorting Center', description: 'Package in international transit' },
    ]
  },
  {
    id: 'SHP002', orderId: 'DNK10235', trackingNumber: 'DNK-DE-2026-00125', dnkId: 'DNK006',
    currentStatus: 'CUSTOMS', estimatedDelivery: '2026-02-10', createdAt: '2026-01-20', lastUpdated: '2026-01-26',
    events: [
      { status: 'CREATED', timestamp: '2026-01-20T10:00:00Z', location: 'Kochi', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-21T11:00:00Z', location: 'Kochi Head Post Office DNK', description: 'Package received at DNK' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-22T09:00:00Z', location: 'Kochi', description: 'Processing export documents' },
      { status: 'CUSTOMS', timestamp: '2026-01-24T14:00:00Z', location: 'Kochi Customs', description: 'Awaiting customs clearance' },
    ]
  },
  {
    id: 'SHP003', orderId: 'DNK10237', trackingNumber: 'DNK-UK-2026-00118', dnkId: 'DNK002',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-01-30', createdAt: '2026-01-12', lastUpdated: '2026-01-24',
    events: [
      { status: 'CREATED', timestamp: '2026-01-12T08:00:00Z', location: 'Bhuj', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-13T10:00:00Z', location: 'Bhuj Post Office DNK', description: 'Package received at DNK' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-14T11:00:00Z', location: 'Bhuj', description: 'Documents processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-15T15:00:00Z', location: 'Ahmedabad Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2026-01-17T09:00:00Z', location: 'Mumbai', description: 'Dispatched internationally' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-20T14:00:00Z', location: 'Mumbai Hub', description: 'In international transit to UK' },
    ]
  },
  {
    id: 'SHP004', orderId: 'DNK10238', trackingNumber: 'DNK-SG-2026-00108', dnkId: 'DNK008',
    currentStatus: 'DELIVERED', estimatedDelivery: '2026-01-10', createdAt: '2025-12-22', lastUpdated: '2026-01-08',
    events: [
      { status: 'CREATED', timestamp: '2025-12-22T09:00:00Z', location: 'Chennai', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2025-12-23T11:00:00Z', location: 'Chennai Head Post Office DNK', description: 'Package received at DNK' },
      { status: 'EXPORT_PROCESSING', timestamp: '2025-12-26T10:00:00Z', location: 'Chennai', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2025-12-28T14:00:00Z', location: 'Chennai Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2025-12-30T08:00:00Z', location: 'Chennai', description: 'Dispatched to Singapore' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-02T10:00:00Z', location: 'Singapore Hub', description: 'Arrived in Singapore' },
      { status: 'DESTINATION_PROCESSING', timestamp: '2026-01-05T12:00:00Z', location: 'Singapore', description: 'Out for delivery' },
      { status: 'DELIVERED', timestamp: '2026-01-08T14:30:00Z', location: 'Singapore', description: 'Successfully delivered' },
    ]
  },
  {
    id: 'SHP005', orderId: 'DNK10239', trackingNumber: 'DNK-FR-2026-00120', dnkId: 'DNK004',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-02-01', createdAt: '2026-01-14', lastUpdated: '2026-01-24',
    events: [
      { status: 'CREATED', timestamp: '2026-01-14T09:00:00Z', location: 'Jaipur', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-15T10:00:00Z', location: 'Jaipur Head Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-16T11:00:00Z', location: 'Jaipur', description: 'Export processing completed' },
      { status: 'CUSTOMS', timestamp: '2026-01-18T14:00:00Z', location: 'Jaipur Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2026-01-20T08:00:00Z', location: 'Mumbai', description: 'Dispatched to France' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-24T12:00:00Z', location: 'Mumbai Hub', description: 'In transit' },
    ]
  },
  {
    id: 'SHP006', orderId: 'DNK10240', trackingNumber: 'DNK-CA-2026-00122', dnkId: 'DNK010',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-02-08', createdAt: '2026-01-16', lastUpdated: '2026-01-25',
    events: [
      { status: 'CREATED', timestamp: '2026-01-16T09:00:00Z', location: 'Mumbai', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-17T11:00:00Z', location: 'Mumbai Head Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-19T10:00:00Z', location: 'Mumbai', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-20T15:00:00Z', location: 'Mumbai Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2026-01-22T09:00:00Z', location: 'Mumbai', description: 'Dispatched to Canada' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-25T14:00:00Z', location: 'International Hub', description: 'In transit to Canada' },
    ]
  },
  {
    id: 'SHP007', orderId: 'DNK10244', trackingNumber: 'DNK-US-2026-00115', dnkId: 'DNK010',
    currentStatus: 'DELAYED', estimatedDelivery: '2026-01-28', createdAt: '2026-01-10', lastUpdated: '2026-01-22',
    events: [
      { status: 'CREATED', timestamp: '2026-01-10T09:00:00Z', location: 'Mumbai', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-11T11:00:00Z', location: 'Mumbai Head Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-13T10:00:00Z', location: 'Mumbai', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-15T16:00:00Z', location: 'Mumbai Customs', description: 'Customs cleared' },
      { status: 'DELAYED', timestamp: '2026-01-22T08:00:00Z', location: 'Mumbai Hub', description: 'Shipment delayed due to weather conditions' },
    ]
  },
  {
    id: 'SHP008', orderId: 'DNK10245', trackingNumber: 'DNK-UK-2026-00112', dnkId: 'DNK007',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-01-25', createdAt: '2026-01-07', lastUpdated: '2026-01-23',
    events: [
      { status: 'CREATED', timestamp: '2026-01-07T09:00:00Z', location: 'Varanasi', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-08T10:00:00Z', location: 'Varanasi Head Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-09T11:00:00Z', location: 'Varanasi', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-11T14:00:00Z', location: 'Delhi Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2026-01-13T09:00:00Z', location: 'Delhi', description: 'Dispatched to UK' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-18T12:00:00Z', location: 'International Hub', description: 'In transit' },
    ]
  },
  {
    id: 'SHP009', orderId: 'DNK10250', trackingNumber: 'DNK-DE-2026-00119', dnkId: 'DNK002',
    currentStatus: 'CUSTOMS', estimatedDelivery: '2026-02-02', createdAt: '2026-01-13', lastUpdated: '2026-01-25',
    events: [
      { status: 'CREATED', timestamp: '2026-01-13T09:00:00Z', location: 'Bhuj', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-14T10:00:00Z', location: 'Bhuj Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-16T11:00:00Z', location: 'Bhuj', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-25T14:00:00Z', location: 'Ahmedabad Customs', description: 'Customs review in progress' },
    ]
  },
  {
    id: 'SHP010', orderId: 'DNK10253', trackingNumber: 'DNK-UK-2026-00116', dnkId: 'DNK001',
    currentStatus: 'IN_TRANSIT', estimatedDelivery: '2026-01-27', createdAt: '2026-01-09', lastUpdated: '2026-01-24',
    events: [
      { status: 'CREATED', timestamp: '2026-01-09T09:00:00Z', location: 'Ahmedabad', description: 'Shipment created' },
      { status: 'DNK_RECEIVED', timestamp: '2026-01-10T10:00:00Z', location: 'Ahmedabad Head Post Office DNK', description: 'Package received' },
      { status: 'EXPORT_PROCESSING', timestamp: '2026-01-11T11:00:00Z', location: 'Ahmedabad', description: 'Export processed' },
      { status: 'CUSTOMS', timestamp: '2026-01-13T14:00:00Z', location: 'Ahmedabad Customs', description: 'Customs cleared' },
      { status: 'DISPATCHED', timestamp: '2026-01-15T09:00:00Z', location: 'Mumbai', description: 'Dispatched' },
      { status: 'IN_TRANSIT', timestamp: '2026-01-20T12:00:00Z', location: 'International Hub', description: 'In transit to UK' },
    ]
  },
];

// --- DOCUMENTS ---

export const DOCUMENTS: DocRecord[] = [
  { id: 'DOC001', sellerId: 'SEL001', orderId: 'DNK10234', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10234', status: 'VERIFIED', uploadedAt: '2026-01-15', verifiedAt: '2026-01-16' },
  { id: 'DOC002', sellerId: 'SEL001', orderId: 'DNK10234', type: 'Export Document', name: 'Packing List - Order #DNK10234', status: 'UNDER_REVIEW', uploadedAt: '2026-01-15' },
  { id: 'DOC003', sellerId: 'SEL001', type: 'Product Document', name: 'Certificate of Origin', status: 'CORRECTION_REQUIRED', uploadedAt: '2026-01-14' },
  { id: 'DOC004', sellerId: 'SEL001', type: 'Seller Document', name: 'IEC Certificate', status: 'VERIFIED', uploadedAt: '2025-10-01', verifiedAt: '2025-10-03' },
  { id: 'DOC005', sellerId: 'SEL001', orderId: 'DNK10234', type: 'Shipment Document', name: 'Shipping Label - DNK-DE-2026-00124', status: 'VERIFIED', uploadedAt: '2026-01-17', verifiedAt: '2026-01-17' },
  { id: 'DOC006', sellerId: 'SEL001', type: 'Seller Document', name: 'Aadhaar Card Copy', status: 'VERIFIED', uploadedAt: '2025-09-01', verifiedAt: '2025-09-02' },
  { id: 'DOC007', sellerId: 'SEL001', type: 'Seller Document', name: 'PAN Card Copy', status: 'VERIFIED', uploadedAt: '2025-09-01', verifiedAt: '2025-09-02' },
  { id: 'DOC008', sellerId: 'SEL001', type: 'Product Document', name: 'Product Quality Certificate', status: 'UPLOADED', uploadedAt: '2026-01-10' },
  { id: 'DOC009', sellerId: 'SEL002', orderId: 'DNK10237', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10237', status: 'VERIFIED', uploadedAt: '2026-01-12', verifiedAt: '2026-01-13' },
  { id: 'DOC010', sellerId: 'SEL002', orderId: 'DNK10237', type: 'Export Document', name: 'Packing List - Order #DNK10237', status: 'VERIFIED', uploadedAt: '2026-01-12', verifiedAt: '2026-01-13' },
  { id: 'DOC011', sellerId: 'SEL003', orderId: 'DNK10236', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10236', status: 'UPLOADED', uploadedAt: '2026-01-20' },
  { id: 'DOC012', sellerId: 'SEL004', orderId: 'DNK10239', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10239', status: 'VERIFIED', uploadedAt: '2026-01-14', verifiedAt: '2026-01-15' },
  { id: 'DOC013', sellerId: 'SEL005', type: 'Seller Document', name: 'Business Registration', status: 'UNDER_REVIEW', uploadedAt: '2026-01-20' },
  { id: 'DOC014', sellerId: 'SEL006', type: 'Seller Document', name: 'FSSAI License', status: 'VERIFIED', uploadedAt: '2025-11-15', verifiedAt: '2025-11-17' },
  { id: 'DOC015', sellerId: 'SEL006', orderId: 'DNK10235', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10235', status: 'UNDER_REVIEW', uploadedAt: '2026-01-20' },
  { id: 'DOC016', sellerId: 'SEL006', orderId: 'DNK10235', type: 'Product Document', name: 'Food Safety Certificate', status: 'VERIFIED', uploadedAt: '2026-01-18', verifiedAt: '2026-01-19' },
  { id: 'DOC017', sellerId: 'SEL007', orderId: 'DNK10245', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10245', status: 'VERIFIED', uploadedAt: '2026-01-05', verifiedAt: '2026-01-06' },
  { id: 'DOC018', sellerId: 'SEL008', orderId: 'DNK10238', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10238', status: 'VERIFIED', uploadedAt: '2025-12-20', verifiedAt: '2025-12-21' },
  { id: 'DOC019', sellerId: 'SEL010', orderId: 'DNK10240', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10240', status: 'VERIFIED', uploadedAt: '2026-01-14', verifiedAt: '2026-01-15' },
  { id: 'DOC020', sellerId: 'SEL010', orderId: 'DNK10240', type: 'Export Document', name: 'Packing List - Order #DNK10240', status: 'VERIFIED', uploadedAt: '2026-01-14', verifiedAt: '2026-01-15' },
  { id: 'DOC021', sellerId: 'SEL001', orderId: 'DNK10246', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10246', status: 'DRAFT', uploadedAt: '2026-01-28' },
  { id: 'DOC022', sellerId: 'SEL002', type: 'Product Document', name: 'Textile Quality Certificate', status: 'VERIFIED', uploadedAt: '2025-12-01', verifiedAt: '2025-12-03' },
  { id: 'DOC023', sellerId: 'SEL003', type: 'Seller Document', name: 'GST Registration', status: 'VERIFIED', uploadedAt: '2025-08-15', verifiedAt: '2025-08-16' },
  { id: 'DOC024', sellerId: 'SEL004', type: 'Seller Document', name: 'Artisan Registration Certificate', status: 'VERIFIED', uploadedAt: '2025-09-10', verifiedAt: '2025-09-12' },
  { id: 'DOC025', sellerId: 'SEL009', type: 'Seller Document', name: 'Business License', status: 'UNDER_REVIEW', uploadedAt: '2026-01-25' },
  { id: 'DOC026', sellerId: 'SEL001', orderId: 'DNK10246', type: 'Export Document', name: 'Packing List - Order #DNK10246', status: 'DRAFT', uploadedAt: '2026-01-28' },
  { id: 'DOC027', sellerId: 'SEL006', orderId: 'DNK10241', type: 'Export Document', name: 'Commercial Invoice - Order #DNK10241', status: 'DRAFT', uploadedAt: '2026-01-22' },
  { id: 'DOC028', sellerId: 'SEL008', orderId: 'DNK10248', type: 'Export Document', name: 'Art Export Certificate', status: 'UPLOADED', uploadedAt: '2026-01-26' },
  { id: 'DOC029', sellerId: 'SEL001', type: 'Export Document', name: 'Export Compliance Declaration', status: 'VERIFIED', uploadedAt: '2025-10-01', verifiedAt: '2025-10-02' },
  { id: 'DOC030', sellerId: 'SEL010', type: 'Seller Document', name: 'Leather Export License', status: 'VERIFIED', uploadedAt: '2025-11-20', verifiedAt: '2025-11-22' },
];

// --- DNKs ---

export const DNKS: DNK[] = [
  { id: 'DNK001', name: 'Ahmedabad Head Post Office GPO DNK', state: 'Gujarat', district: 'Ahmedabad', address: 'Bhadra, Near Lal Darwaja, Ahmedabad, Gujarat 380001', pinCode: '380001', services: ['Export Assistance', 'Customs Packaging', 'PBE Documentation', 'International EMS Booking'], status: 'Open', contactPhone: '+91 79 2657 1234', operatingHours: '9:00 AM – 6:00 PM', lat: 23.0258, lng: 72.5857 },
  { id: 'DNK002', name: 'Bhuj Head Post Office DNK', state: 'Gujarat', district: 'Bhuj', address: 'Station Road, Near Jubilee Ground, Bhuj, Gujarat 370001', pinCode: '370001', services: ['Handicraft Export Support', 'PBE-III Filing', 'Customs Packing', 'Shipment Booking'], status: 'Open', contactPhone: '+91 2832 234567', operatingHours: '9:00 AM – 5:30 PM', lat: 23.2420, lng: 69.6669 },
  { id: 'DNK003', name: 'Surat Head Post Office DNK', state: 'Gujarat', district: 'Surat', address: '78, Ring Road, Athwagate, Surat, Gujarat 395001', pinCode: '395001', services: ['Textile & Diamond Export', 'Packaging Assistance', 'Commercial Invoicing', 'EMS International'], status: 'Open', contactPhone: '+91 261 2345678', operatingHours: '9:00 AM – 6:00 PM', lat: 21.1702, lng: 72.8311 },
  { id: 'DNK011', name: 'Navrangpura Post Office DNK', state: 'Gujarat', district: 'Ahmedabad', address: 'Near CG Road, Navrangpura, Ahmedabad, Gujarat 380009', pinCode: '380009', services: ['MSME Export Counter', 'Shipment Booking', 'Documentation Support'], status: 'Open', contactPhone: '+91 79 2630 1234', operatingHours: '9:00 AM – 5:00 PM', lat: 23.0365, lng: 72.5611 },
  { id: 'DNK012', name: 'Gandhinagar Sector 16 Head Post Office DNK', state: 'Gujarat', district: 'Gandhinagar', address: 'Sector 16, Shopping Complex, Gandhinagar, Gujarat 382016', pinCode: '382016', services: ['Export Assistance', 'Packaging Service', 'Shipment Booking'], status: 'Open', contactPhone: '+91 79 2320 1234', operatingHours: '9:30 AM – 5:30 PM', lat: 23.2156, lng: 72.6369 },
  { id: 'DNK013', name: 'Vadodara Raopura Head Post Office DNK', state: 'Gujarat', district: 'Vadodara', address: 'Raopura Road, Mandvi, Vadodara, Gujarat 390001', pinCode: '390001', services: ['Artisan Assistance', 'Packaging & Seal', 'Postal Bill of Export', 'Express Dispatch'], status: 'Open', contactPhone: '+91 265 2412345', operatingHours: '9:00 AM – 6:00 PM', lat: 22.3072, lng: 73.1812 },
  { id: 'DNK014', name: 'Rajkot Head Post Office DNK', state: 'Gujarat', district: 'Rajkot', address: 'MG Road, Sadar Bazar, Rajkot, Gujarat 360001', pinCode: '360001', services: ['Silverware & Handicraft Export', 'Packaging Labelling', 'DNK Express'], status: 'Open', contactPhone: '+91 281 2223344', operatingHours: '9:00 AM – 6:00 PM', lat: 22.3039, lng: 70.8022 },
  { id: 'DNK015', name: 'Jamnagar Head Post Office DNK', state: 'Gujarat', district: 'Jamnagar', address: 'Chandi Bazaar, Jamnagar, Gujarat 361001', pinCode: '361001', services: ['Brass Part & Bandhani Export', 'Documentation', 'Postal Clearance'], status: 'Open', contactPhone: '+91 288 2551234', operatingHours: '9:30 AM – 5:30 PM', lat: 22.4707, lng: 70.0577 },
  { id: 'DNK016', name: 'Bhavnagar Head Post Office DNK', state: 'Gujarat', district: 'Bhavnagar', address: 'High Court Road, Bhavnagar, Gujarat 364001', pinCode: '364001', services: ['Export Shipment', 'Packing Box Provision', 'Customs Bill Support'], status: 'Open', contactPhone: '+91 278 2421234', operatingHours: '9:00 AM – 5:00 PM', lat: 21.7645, lng: 72.1519 },
  { id: 'DNK017', name: 'Anand Head Post Office DNK', state: 'Gujarat', district: 'Anand', address: 'Amul Dairy Road, Anand, Gujarat 388001', pinCode: '388001', services: ['Agro & Dairy Craft Export', 'Packaging Support', 'Shipment Dispatch'], status: 'Open', contactPhone: '+91 2692 245678', operatingHours: '9:00 AM – 5:30 PM', lat: 22.5645, lng: 72.9289 },
  { id: 'DNK018', name: 'Junagadh Head Post Office DNK', state: 'Gujarat', district: 'Junagadh', address: 'Azad Chowk, Junagadh, Gujarat 362001', pinCode: '362001', services: ['Artisan Guidance', 'Packaging', 'Postal Export Booking'], status: 'Open', contactPhone: '+91 285 2623456', operatingHours: '9:30 AM – 5:00 PM', lat: 21.5222, lng: 70.4579 },
  { id: 'DNK019', name: 'Mehsana Head Post Office DNK', state: 'Gujarat', district: 'Mehsana', address: 'Radhanpur Road, Mehsana, Gujarat 384002', pinCode: '384002', services: ['Handloom Export Counter', 'Customs Verification', 'Booking'], status: 'Open', contactPhone: '+91 2762 251234', operatingHours: '9:00 AM – 5:00 PM', lat: 23.5880, lng: 72.3693 },
  { id: 'DNK020', name: 'Bharuch Station Road DNK', state: 'Gujarat', district: 'Bharuch', address: 'Station Road, Bharuch, Gujarat 392001', pinCode: '392001', services: ['Industrial & Craft Export', 'Packaging Assistance', 'PBE-IV'], status: 'Open', contactPhone: '+91 2642 261234', operatingHours: '9:30 AM – 5:30 PM', lat: 21.7051, lng: 72.9959 },
  { id: 'DNK004', name: 'Jaipur Head Post Office DNK', state: 'Rajasthan', district: 'Jaipur', address: '23, Nehru Bazaar, Jaipur, Rajasthan 302001', pinCode: '302001', services: ['Export Assistance', 'Packaging', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 141 2345678', operatingHours: '9:00 AM – 6:00 PM', lat: 26.9124, lng: 75.7873 },
  { id: 'DNK005', name: 'Kolkata GPO DNK', state: 'West Bengal', district: 'Kolkata', address: '19, Netaji Subhash Road, Kolkata, West Bengal 700001', pinCode: '700001', services: ['Export Assistance', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 33 22345678', operatingHours: '10:00 AM – 5:00 PM', lat: 22.5726, lng: 88.3639 },
  { id: 'DNK006', name: 'Kochi Head Post Office DNK', state: 'Kerala', district: 'Kochi', address: '90, Mattancherry, Kochi, Kerala 682002', pinCode: '682002', services: ['Export Assistance', 'Packaging', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 484 2345678', operatingHours: '9:00 AM – 5:00 PM', lat: 9.9312, lng: 76.2673 },
  { id: 'DNK007', name: 'Varanasi Head Post Office DNK', state: 'Uttar Pradesh', district: 'Varanasi', address: '12, Godowlia, Varanasi, Uttar Pradesh 221001', pinCode: '221001', services: ['Export Assistance', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 542 2345678', operatingHours: '9:00 AM – 5:00 PM', lat: 25.3176, lng: 82.9739 },
  { id: 'DNK008', name: 'Chennai Head Post Office DNK', state: 'Tamil Nadu', district: 'Chennai', address: '34, T Nagar, Chennai, Tamil Nadu 600017', pinCode: '600017', services: ['Export Assistance', 'Packaging', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 44 23456789', operatingHours: '9:00 AM – 6:00 PM', lat: 13.0827, lng: 80.2707 },
  { id: 'DNK009', name: 'Mysore Head Post Office DNK', state: 'Karnataka', district: 'Mysore', address: '67, Devaraja Mohalla, Mysore, Karnataka 570001', pinCode: '570001', services: ['Export Assistance', 'Shipment Booking'], status: 'Closed', contactPhone: '+91 821 2345678', operatingHours: '10:00 AM – 5:00 PM', lat: 12.2958, lng: 76.6394 },
  { id: 'DNK010', name: 'Mumbai GPO DNK', state: 'Maharashtra', district: 'Mumbai', address: '89, Fort Area, Mumbai, Maharashtra 400001', pinCode: '400001', services: ['Export Assistance', 'Packaging', 'Documentation Support', 'Shipment Booking'], status: 'Open', contactPhone: '+91 22 23456789', operatingHours: '9:00 AM – 6:00 PM', lat: 18.9388, lng: 72.8354 },
];

// --- NOTIFICATIONS ---

export const NOTIFICATIONS: Notification[] = [
  { id: 'NTF001', userId: 'USR001', title: 'Document Required', message: 'Upload commercial invoice for Order #DNK10234', type: 'warning', read: false, createdAt: '2026-01-25T10:00:00Z' },
  { id: 'NTF002', userId: 'USR001', title: 'Shipment Update', message: 'Your shipment DNK-DE-2026-00124 is now in international transit', type: 'info', read: false, createdAt: '2026-01-25T12:00:00Z' },
  { id: 'NTF003', userId: 'USR001', title: 'Export Readiness Improved', message: 'Your export readiness score increased from 82% to 92%', type: 'success', read: true, createdAt: '2026-01-20T09:00:00Z' },
  { id: 'NTF004', userId: 'USR001', title: 'DNK Verification Complete', message: 'Your documents for Order #DNK10234 have been verified', type: 'success', read: true, createdAt: '2026-01-18T14:00:00Z' },
  { id: 'NTF005', userId: 'USR001', title: 'Order Received', message: 'New order #DNK10246 received from buyer', type: 'info', read: false, createdAt: '2026-01-28T11:00:00Z' },
  { id: 'NTF006', userId: 'USR001', title: 'Payment Confirmed', message: 'Payment of ₹4,000 confirmed for Order #DNK10234', type: 'success', read: true, createdAt: '2026-01-16T10:00:00Z' },
  { id: 'NTF007', userId: 'USR001', title: 'Certificate Correction', message: 'Certificate of Origin requires correction. Please review.', type: 'error', read: false, createdAt: '2026-01-22T15:00:00Z' },
  { id: 'NTF008', userId: 'USR002', title: 'New Assistance Request', message: 'Meera Handicrafts has requested DNK assistance', type: 'info', read: false, createdAt: '2026-01-25T11:00:00Z' },
  { id: 'NTF009', userId: 'USR002', title: 'Document Pending Review', message: 'Packing List for Order #DNK10234 needs review', type: 'warning', read: false, createdAt: '2026-01-25T13:00:00Z' },
  { id: 'NTF010', userId: 'USR002', title: 'Shipment Delayed', message: 'Shipment DNK-US-2026-00115 may require attention', type: 'error', read: true, createdAt: '2026-01-22T08:30:00Z' },
  { id: 'NTF011', userId: 'USR004', title: 'Order Shipped', message: 'Your order #DNK10234 has been shipped', type: 'info', read: true, createdAt: '2026-01-22T09:00:00Z' },
  { id: 'NTF012', userId: 'USR004', title: 'Tracking Update', message: 'Order #DNK10234 is now in international transit', type: 'info', read: false, createdAt: '2026-01-25T12:30:00Z' },
  { id: 'NTF013', userId: 'USR003', title: 'System Alert', message: '7 delayed shipments detected across platform', type: 'warning', read: false, createdAt: '2026-01-25T08:00:00Z' },
  { id: 'NTF014', userId: 'USR003', title: 'New Seller Registration', message: 'Mysore Sandalwood Crafts has applied for verification', type: 'info', read: true, createdAt: '2026-01-24T10:00:00Z' },
  { id: 'NTF015', userId: 'USR001', title: 'Low Bandwidth Reminder', message: 'You have 2 draft exports saved locally', type: 'info', read: true, createdAt: '2026-01-24T16:00:00Z' },
  { id: 'NTF016', userId: 'USR004', title: 'Invoice Reminder', message: 'Please upload invoice for Order #DNK10251', type: 'warning', read: false, createdAt: '2026-01-27T10:00:00Z' },
  { id: 'NTF017', userId: 'USR001', title: 'Export Cost Estimate', message: 'Updated shipping rates available for Germany', type: 'info', read: true, createdAt: '2026-01-23T09:00:00Z' },
  { id: 'NTF018', userId: 'USR002', title: 'Shipment Ready', message: 'Shipment DNK-FR-2026-00120 is ready for dispatch', type: 'success', read: false, createdAt: '2026-01-20T10:00:00Z' },
  { id: 'NTF019', userId: 'USR003', title: 'Monthly Report', message: 'January analytics report is ready for review', type: 'info', read: true, createdAt: '2026-01-31T08:00:00Z' },
  { id: 'NTF020', userId: 'USR004', title: 'Delivery Update', message: 'Order #DNK10238 has been delivered successfully', type: 'success', read: true, createdAt: '2026-01-08T15:00:00Z' },
];

// --- SUPPORT TICKETS ---

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TKT001', userId: 'USR001', orderId: 'DNK10234', category: 'Shipment Delay', description: 'My shipment has been in transit for over 7 days. Need status update.', priority: 'High', status: 'In Progress', createdAt: '2026-01-24T10:00:00Z' },
  { id: 'TKT002', userId: 'USR001', category: 'Document Issue', description: 'Certificate of Origin correction - what specific changes are needed?', priority: 'Medium', status: 'Assigned', createdAt: '2026-01-22T16:00:00Z' },
  { id: 'TKT003', userId: 'USR005', category: 'Registration Help', description: 'Need help completing seller verification for Kutch Craft Collective.', priority: 'Medium', status: 'Open', createdAt: '2026-01-20T09:00:00Z' },
  { id: 'TKT004', userId: 'USR006', orderId: 'DNK10235', category: 'Export Compliance', description: 'Confused about FSSAI requirements for food product export to Germany.', priority: 'High', status: 'Resolved', createdAt: '2026-01-15T11:00:00Z' },
  { id: 'TKT005', userId: 'USR008', category: 'Platform Feedback', description: 'Would be great to have Hindi support in the document upload section.', priority: 'Low', status: 'Open', createdAt: '2026-01-18T14:00:00Z' },
  { id: 'TKT006', userId: 'USR012', category: 'Account Issue', description: 'Cannot upload documents larger than 5MB. Need higher limit for certificate scans.', priority: 'Medium', status: 'In Progress', createdAt: '2026-01-19T08:00:00Z' },
];

// --- COMPLIANCE RULES ---

export const COMPLIANCE_RULES: ComplianceRule[] = [
  { id: 'CR001', productCategory: 'Handicrafts', destination: 'Germany', requirement: 'Product description and country of origin declaration', document: 'Commercial Invoice', status: 'Active' },
  { id: 'CR002', productCategory: 'Handicrafts', destination: 'Germany', requirement: 'Wood treatment certificate for natural materials', document: 'Phytosanitary Certificate', status: 'Active' },
  { id: 'CR003', productCategory: 'Textiles', destination: 'USA', requirement: 'Fabric composition label and care instructions', document: 'Product Label Certificate', status: 'Active' },
  { id: 'CR004', productCategory: 'Textiles', destination: 'UK', requirement: 'Textile fiber identification', document: 'Textile Composition Certificate', status: 'Active' },
  { id: 'CR005', productCategory: 'Food Products', destination: 'Germany', requirement: 'FSSAI certification and food safety compliance', document: 'FSSAI License', status: 'Active' },
  { id: 'CR006', productCategory: 'Food Products', destination: 'USA', requirement: 'FDA registration for food imports', document: 'FDA Registration', status: 'Active' },
  { id: 'CR007', productCategory: 'Jewellery', destination: 'UAE', requirement: 'Precious metal hallmarking certificate', document: 'Hallmark Certificate', status: 'Active' },
  { id: 'CR008', productCategory: 'Home Decor', destination: 'France', requirement: 'CE marking for decorative items', document: 'CE Compliance Certificate', status: 'Active' },
  { id: 'CR009', productCategory: 'Eco-Friendly Products', destination: 'Australia', requirement: 'Environmental compliance declaration', document: 'Eco Compliance Certificate', status: 'Active' },
  { id: 'CR010', productCategory: 'Handicrafts', destination: 'Japan', requirement: 'Japanese import declaration form', document: 'Japan Import Declaration', status: 'Active' },
  { id: 'CR011', productCategory: 'Art', destination: 'USA', requirement: 'Cultural artifact export clearance', document: 'Antiquity Export License', status: 'Active' },
  { id: 'CR012', productCategory: 'Traditional Products', destination: 'Germany', requirement: 'Cosmetic product safety report', document: 'CPSR Certificate', status: 'Active' },
];

// --- EXPORT JOURNEY STEPS ---

export const EXPORT_JOURNEY_STEPS: ExportJourneyStep[] = [
  { step: 1, title: 'Seller Registration', description: 'Create your seller profile and complete basic information', responsible: 'Seller / DNK Operator' },
  { step: 2, title: 'Product Information', description: 'Add product details, images, and physical specifications', responsible: 'Seller' },
  { step: 3, title: 'Export Readiness', description: 'Check and improve your export readiness score', responsible: 'Platform' },
  { step: 4, title: 'Documentation', description: 'Prepare and upload required export documents', responsible: 'Seller / DNK Operator' },
  { step: 5, title: 'DNK Verification', description: 'Get your documents and products verified at nearest DNK', responsible: 'DNK Operator' },
  { step: 6, title: 'Shipment Booking', description: 'Book your shipment through India Post', responsible: 'DNK Operator' },
  { step: 7, title: 'Customs Processing', description: 'Export customs clearance at origin', responsible: 'Customs / India Post' },
  { step: 8, title: 'International Transit', description: 'Package in transit to destination country', responsible: 'India Post / International Partners' },
  { step: 9, title: 'Delivery', description: 'Package delivered to international customer', responsible: 'Local Postal Service' },
];

// --- ASSISTANT KNOWLEDGE BASE ---

export const ASSISTANT_QA: AssistantQA[] = [
  {
    question: 'How do I start exporting?',
    answer: 'To start exporting, you need to: 1) Complete your seller profile, 2) Add your product with details, 3) Check your export readiness score, 4) Prepare required documents, 5) Connect with your nearest DNK for assistance.',
    nextSteps: ['Complete seller profile', 'Add your first product', 'Check export readiness'],
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Registration'],
    actionButton: 'Start Export Journey',
    actionLink: '/seller/readiness'
  },
  {
    question: 'What should I prepare before visiting DNK?',
    answer: 'Before visiting DNK, prepare: Product samples, Product photos, Business documents (GST, PAN), Packing materials, Any destination-specific documents. Make sure your export readiness score is above 75%.',
    nextSteps: ['Upload documents online first', 'Check export readiness', 'Find nearest DNK'],
    requiredDocuments: ['GST Certificate', 'Product photos', 'Packing details'],
    actionButton: 'Find Nearest DNK',
    actionLink: '/seller/dnk'
  },
  {
    question: 'What documents are needed?',
    answer: 'Common export documents include: Commercial Invoice, Packing List, Certificate of Origin, Shipping Bill, Bill of Lading/Airway Bill, and destination-specific certifications. The exact requirements depend on your product category and destination.',
    nextSteps: ['Check destination requirements', 'Upload documents to Document Center'],
    requiredDocuments: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'],
    actionButton: 'Go to Documents',
    actionLink: '/seller/documents'
  },
  {
    question: 'How can I estimate shipping cost?',
    answer: 'Use our Export Cost Calculator to get an estimate. Enter your product value, weight, dimensions, and destination country. The calculator will show estimated shipping, packaging, and additional charges.',
    nextSteps: ['Enter product details', 'Select destination', 'Calculate estimate'],
    requiredDocuments: [],
    actionButton: 'Open Cost Calculator',
    actionLink: '/seller/cost-calculator'
  },
  {
    question: 'Where is my nearest DNK?',
    answer: 'You can find the nearest Dak Ghar Niryat Kendra using our DNK Locator. Simply enter your PIN code, city, or state to see nearby DNKs with their services and operating hours.',
    nextSteps: ['Search by PIN code or city', 'Check DNK services', 'Plan your visit'],
    requiredDocuments: [],
    actionButton: 'Find DNK',
    actionLink: '/seller/dnk'
  },
  {
    question: 'What should I do if my shipment is delayed?',
    answer: 'If your shipment is delayed: 1) Check the tracking page for latest updates, 2) Contact your DNK operator for assistance, 3) Raise a support ticket if delay exceeds 7 days, 4) Check if there are any customs issues.',
    nextSteps: ['Check tracking status', 'Contact DNK support', 'Raise support ticket'],
    requiredDocuments: ['Tracking number', 'Order details'],
    actionButton: 'Track Shipment',
    actionLink: '/seller/shipments'
  },
  {
    question: 'I want to export a handicraft to Germany.',
    answer: 'Great choice! For handicrafts to Germany, you\'ll need: 1) Product details with origin, 2) Commercial invoice, 3) Certificate of origin, 4) Wood treatment certificate (if applicable), 5) Packaging details. Estimated delivery is 7-12 business days.',
    nextSteps: ['Add product details', 'Select Germany as destination', 'Check export requirements', 'Prepare documents'],
    requiredDocuments: ['Commercial Invoice', 'Certificate of Origin', 'Product Description'],
    actionButton: 'Check Export Readiness',
    actionLink: '/seller/readiness'
  },
  {
    question: 'What is DNK?',
    answer: 'DNK stands for Dak Ghar Niryat Kendra — Export centers set up at Post Offices across India. They help small exporters with documentation, packaging, compliance verification, and shipment booking. Think of them as your local export support center.',
    nextSteps: ['Find your nearest DNK', 'Understand DNK services'],
    requiredDocuments: [],
    actionButton: 'Explore DNKs',
    actionLink: '/seller/dnk'
  },
];

// --- COUNTRIES ---

export const COUNTRIES = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

export const PRODUCT_CATEGORIES = [
  'Handicrafts', 'Textiles', 'Home Decor', 'Jewellery', 'Food Products',
  'Traditional Products', 'Eco-Friendly Products', 'Art', 'Fashion Accessories'
];

// --- ADMIN ANALYTICS DATA ---

export const ADMIN_ANALYTICS = {
  totalSellers: 248,
  activeDNKs: 18,
  activeExports: 96,
  totalOrders: 312,
  totalShipments: 280,
  deliveredShipments: 261,
  delayedShipments: 7,
  totalExportValue: 4850000,
  exportsByMonth: [
    { month: 'Aug', value: 180000 },
    { month: 'Sep', value: 250000 },
    { month: 'Oct', value: 320000 },
    { month: 'Nov', value: 410000 },
    { month: 'Dec', value: 380000 },
    { month: 'Jan', value: 450000 },
  ],
  topCategories: [
    { name: 'Handicrafts', count: 95 },
    { name: 'Textiles', count: 78 },
    { name: 'Home Decor', count: 42 },
    { name: 'Food Products', count: 35 },
    { name: 'Jewellery', count: 28 },
  ],
  exportsByDestination: [
    { name: 'Germany', value: 68 },
    { name: 'USA', value: 52 },
    { name: 'UK', value: 45 },
    { name: 'UAE', value: 38 },
    { name: 'France', value: 22 },
    { name: 'Others', value: 23 },
  ],
  dnkActivity: [
    { name: 'Ahmedabad', assisted: 45 },
    { name: 'Mumbai', assisted: 38 },
    { name: 'Jaipur', assisted: 32 },
    { name: 'Kochi', assisted: 28 },
    { name: 'Kolkata', assisted: 25 },
  ],
  shipmentStatus: [
    { name: 'Delivered', value: 261 },
    { name: 'In Transit', value: 8 },
    { name: 'Processing', value: 4 },
    { name: 'Delayed', value: 7 },
  ],
  failurePoints: [
    { reason: 'Missing Documents', percentage: 42 },
    { reason: 'Product Information', percentage: 25 },
    { reason: 'Packaging Issues', percentage: 18 },
    { reason: 'Destination Details', percentage: 10 },
    { reason: 'Other', percentage: 5 },
  ],
  userJourneyFunnel: [
    { stage: 'Registered', count: 100 },
    { stage: 'Products Added', count: 82 },
    { stage: 'Readiness Checked', count: 70 },
    { stage: 'Documents Complete', count: 62 },
    { stage: 'Shipments Created', count: 55 },
    { stage: 'Delivered', count: 49 },
  ],
};
