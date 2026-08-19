import { create } from 'zustand';
import { USERS, DEMO_CREDENTIALS } from '../data/mockData';

export type Role = 'seller' | 'operator' | 'admin' | 'buyer' | null;

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: NonNullable<Role>;
    phone: string;
    location: string;
  } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<{ name: string; phone: string; location: string }, 'name' | 'phone' | 'location'>>) => void;
  initFromStorage: () => void;
}

const savedUser = (() => {
  try {
    const raw = localStorage.getItem('ns_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  login: (email: string, password: string) => {
    const found = USERS.find((u) => u.email === email);
    if (!found) return false;

    const credentials = Object.values(DEMO_CREDENTIALS).find((c) => c.email === email);
    if (!credentials || credentials.password !== password) return false;
    const userData = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      location: found.location,
    };
    localStorage.setItem('ns_auth', JSON.stringify(userData));
    set({ user: userData });
    return true;
  },
  logout: () => {
    localStorage.removeItem('ns_auth');
    set({ user: null });
  },
  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('ns_auth', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
  initFromStorage: () => {
    try {
      const raw = localStorage.getItem('ns_auth');
      if (raw) set({ user: JSON.parse(raw) });
    } catch {
      // ignore
    }
  },
}));
