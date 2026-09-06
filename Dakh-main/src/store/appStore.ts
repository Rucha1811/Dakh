import { create } from 'zustand';
import type {
  Product,
  Order,
  Shipment,
  ShipmentEvent,
  DocRecord,
  Notification,
  SupportTicket,
} from '../data/mockData';
import {
  PRODUCTS as INIT_PRODUCTS,
  ORDERS as INIT_ORDERS,
  SHIPMENTS as INIT_SHIPMENTS,
  DOCUMENTS as INIT_DOCUMENTS,
  NOTIFICATIONS as INIT_NOTIFICATIONS,
  SUPPORT_TICKETS as INIT_TICKETS,
} from '../data/mockData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  products: Product[];
  orders: Order[];
  shipments: Shipment[];
  documents: DocRecord[];
  notifications: Notification[];
  supportTickets: SupportTicket[];
  language: 'en' | 'hi' | 'gu';
  lowBandwidth: boolean;
  darkMode: boolean;
  demoMode: boolean;
  toasts: Toast[];
  sidebarOpen: boolean;

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addShipment: (shipment: Shipment) => void;
  addDocument: (doc: DocRecord) => void;
  updateDocumentStatus: (id: string, status: DocRecord['status']) => void;

  updateShipmentStatus: (
    shipmentId: string,
    event: ShipmentEvent,
    status: Shipment['currentStatus']
  ) => void;

  markNotificationRead: (id: string) => void;
  toggleNotificationRead: (id: string) => void;

  addSupportTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (
    id: string,
    status: SupportTicket['status']
  ) => void;

  setLanguage: (lang: 'en' | 'hi' | 'gu') => void;
  toggleLowBandwidth: () => void;
  toggleDarkMode: () => void;
  toggleDemoMode: () => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  initFromBackend: () => Promise<void>;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'ns_app_data_v4';
const API_BASE_URL = 'http://localhost:8000/api';

const clearLegacyStorage = () => {
  try {
    ['ns_app_data', 'ns_app_data_v1', 'ns_app_data_v2', 'ns_app_data_v3'].forEach((k) =>
      localStorage.removeItem(k)
    );
  } catch {
    // ignore
  }
};

const loadPersisted = (): Partial<AppState> | null => {
  try {
    clearLegacyStorage();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persist = (state: AppState) => {
  try {
    const serializable = {
      products: state.products,
      orders: state.orders,
      shipments: state.shipments,
      documents: state.documents,
      notifications: state.notifications,
      supportTickets: state.supportTickets,
      language: state.language,
      lowBandwidth: state.lowBandwidth,
      darkMode: state.darkMode,
      demoMode: state.demoMode,
      sidebarOpen: state.sidebarOpen,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // ignore
  }
};

const sanitizeProducts = (products?: Product[]): Product[] => {
  if (!products || !products.length) return INIT_PRODUCTS;
  const persistedMap = new Map(products.map((p) => [p.id, p]));
  const merged = INIT_PRODUCTS.map((initP) => {
    const persistedP = persistedMap.get(initP.id);
    if (!persistedP) return initP;
    const hasValidImg = persistedP.images && persistedP.images.some((img) => img && img.startsWith('http'));
    return {
      ...initP,
      ...persistedP,
      images: hasValidImg ? persistedP.images : initP.images,
    };
  });
  const customProducts = products.filter((p) => !INIT_PRODUCTS.some((ip) => ip.id === p.id));
  return [...merged, ...customProducts];
};

const initial = loadPersisted();

let toastCounter = 0;

export const useAppStore = create<AppState>((set, get) => ({
  products: sanitizeProducts(initial?.products),
  orders: initial?.orders ?? INIT_ORDERS,
  shipments: initial?.shipments ?? INIT_SHIPMENTS,
  documents: initial?.documents ?? INIT_DOCUMENTS,
  notifications: initial?.notifications ?? INIT_NOTIFICATIONS,
  supportTickets: initial?.supportTickets ?? INIT_TICKETS,
  language: initial?.language ?? 'en',
  lowBandwidth: initial?.lowBandwidth ?? false,
  darkMode: initial?.darkMode ?? false,
  demoMode: initial?.demoMode ?? false,
  toasts: [],
  sidebarOpen: false,

  initFromBackend: async () => {
    try {
      const [pRes, oRes, sRes, dRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/products/`),
        fetch(`${API_BASE_URL}/orders/`),
        fetch(`${API_BASE_URL}/shipments/`),
        fetch(`${API_BASE_URL}/documents/`),
      ]);

      const updates: Partial<AppState> = {};

      if (pRes.status === 'fulfilled' && pRes.value.ok) {
        const pData = await pRes.value.json();
        if (Array.isArray(pData) && pData.length > 0) {
          updates.products = sanitizeProducts(pData);
        }
      }

      if (oRes.status === 'fulfilled' && oRes.value.ok) {
        const oData = await oRes.value.json();
        if (Array.isArray(oData) && oData.length > 0) {
          updates.orders = oData;
        }
      }

      if (sRes.status === 'fulfilled' && sRes.value.ok) {
        const sData = await sRes.value.json();
        if (Array.isArray(sData) && sData.length > 0) {
          updates.shipments = sData;
        }
      }

      if (dRes.status === 'fulfilled' && dRes.value.ok) {
        const dData = await dRes.value.json();
        if (Array.isArray(dData) && dData.length > 0) {
          updates.documents = dData;
        }
      }

      if (Object.keys(updates).length > 0) {
        set((s) => {
          const next = { ...s, ...updates };
          persist(next);
          return updates;
        });
      }
    } catch {
      // Backend not running, use local state seamlessly
    }
  },

  addProduct: async (product) => {
    set((s) => {
      const next = { products: [...s.products, product] };
      persist({ ...s, ...next });
      return next;
    });
    try {
      await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch {
      // Offline fallback preserved in local store
    }
  },

  updateProduct: async (id, updates) => {
    set((s) => {
      const next = {
        products: s.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
    try {
      await fetch(`${API_BASE_URL}/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Offline fallback
    }
  },

  deleteProduct: async (id) => {
    set((s) => {
      const next = { products: s.products.filter((p) => p.id !== id) };
      persist({ ...s, ...next });
      return next;
    });
    try {
      await fetch(`${API_BASE_URL}/products/${id}/`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
  },

  addShipment: (shipment) => {
    set((s) => {
      const next = { shipments: [...s.shipments, shipment] };
      persist({ ...s, ...next });
      return next;
    });
  },

  addDocument: async (doc) => {
    set((s) => {
      const next = { documents: [...s.documents, doc] };
      persist({ ...s, ...next });
      return next;
    });
    try {
      await fetch(`${API_BASE_URL}/documents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
    } catch {
      // Offline fallback
    }
  },

  updateDocumentStatus: (id, status) => {
    set((s) => {
      const next = {
        documents: s.documents.map((d) =>
          d.id === id
            ? {
                ...d,
                status,
                ...(status === 'VERIFIED'
                  ? { verifiedAt: new Date().toISOString().split('T')[0] }
                  : {}),
              }
            : d
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  updateShipmentStatus: (shipmentId, event, status) => {
    set((s) => {
      const now = new Date().toISOString();
      const next = {
        shipments: s.shipments.map((sh) =>
          sh.id === shipmentId
            ? {
                ...sh,
                currentStatus: status,
                lastUpdated: now,
                events: [...sh.events, event],
              }
            : sh
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  markNotificationRead: (id) => {
    set((s) => {
      const next = {
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  toggleNotificationRead: (id) => {
    set((s) => {
      const next = {
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: !n.read } : n
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  addSupportTicket: (ticket) => {
    set((s) => {
      const next = { supportTickets: [...s.supportTickets, ticket] };
      persist({ ...s, ...next });
      return next;
    });
  },

  updateTicketStatus: (id, status) => {
    set((s) => {
      const next = {
        supportTickets: s.supportTickets.map((t) =>
          t.id === id ? { ...t, status } : t
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  setLanguage: (lang) => {
    set((s) => {
      const next = { language: lang };
      persist({ ...s, ...next });
      return next;
    });
  },

  toggleLowBandwidth: () => {
    set((s) => {
      const next = { lowBandwidth: !s.lowBandwidth };
      persist({ ...s, ...next });
      return next;
    });
  },

  toggleDarkMode: () => {
    set((s) => {
      const next = { darkMode: !s.darkMode };
      persist({ ...s, ...next });
      return next;
    });
  },

  toggleDemoMode: () => {
    set((s) => {
      const next = { demoMode: !s.demoMode };
      persist({ ...s, ...next });
      return next;
    });
  },

  toggleSidebar: () => {
    set((s) => ({ sidebarOpen: !s.sidebarOpen }));
  },

  closeSidebar: () => {
    set(() => ({ sidebarOpen: false }));
  },

  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    }));
  },

  resetDemoData: () => {
    clearLegacyStorage();
    localStorage.removeItem(STORAGE_KEY);
    set({
      products: INIT_PRODUCTS,
      orders: INIT_ORDERS,
      shipments: INIT_SHIPMENTS,
      documents: INIT_DOCUMENTS,
      notifications: INIT_NOTIFICATIONS,
      supportTickets: INIT_TICKETS,
      language: 'en',
      lowBandwidth: false,
      darkMode: false,
      demoMode: false,
      sidebarOpen: false,
    });
  },
}));
