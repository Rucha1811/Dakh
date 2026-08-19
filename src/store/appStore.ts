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

  resetDemoData: () => void;
}

const STORAGE_KEY = 'ns_app_data';

const loadPersisted = (): Partial<AppState> | null => {
  try {
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

const initial = loadPersisted();

let toastCounter = 0;

export const useAppStore = create<AppState>((set, get) => ({
  products: initial?.products ?? INIT_PRODUCTS,
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

  addProduct: (product) => {
    set((s) => {
      const next = { products: [...s.products, product] };
      persist({ ...s, ...next });
      return next;
    });
  },

  updateProduct: (id, updates) => {
    set((s) => {
      const next = {
        products: s.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      };
      persist({ ...s, ...next });
      return next;
    });
  },

  deleteProduct: (id) => {
    set((s) => {
      const next = { products: s.products.filter((p) => p.id !== id) };
      persist({ ...s, ...next });
      return next;
    });
  },

  addShipment: (shipment) => {
    set((s) => {
      const next = { shipments: [...s.shipments, shipment] };
      persist({ ...s, ...next });
      return next;
    });
  },

  addDocument: (doc) => {
    set((s) => {
      const next = { documents: [...s.documents, doc] };
      persist({ ...s, ...next });
      return next;
    });
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
