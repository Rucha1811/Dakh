import { create } from 'zustand';
import { USERS, DEMO_CREDENTIALS } from '../data/mockData';
import type { User } from '../data/mockData';

export type Role = 'seller' | 'operator' | 'admin' | 'buyer' | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: NonNullable<Role>;
  phone: string;
  location: string;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  role: NonNullable<Role>;
  phone: string;
  location: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  district?: string;
  pinCode?: string;
}

interface AuthState {
  user: AuthUser | null;
  registeredUsers: (User & { password?: string })[];
  login: (email: string, password?: string) => Promise<boolean> | boolean;
  signup: (data: SignupData) => Promise<boolean> | boolean;
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

const savedUsers = (() => {
  try {
    const raw = localStorage.getItem('ns_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

const API_BASE_URL = 'http://localhost:8000/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: savedUser,
  registeredUsers: savedUsers,

  login: async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    // 1. Try Backend API first if available
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const userData: AuthUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            phone: data.user.phone || '',
            location: data.user.location || '',
          };
          localStorage.setItem('ns_auth', JSON.stringify(userData));
          set({ user: userData });
          return true;
        }
      }
    } catch {
      // Backend unavailable or offline, continue with local fallback
    }

    // 2. Check in Demo Credentials & USERS
    const demoCredMatch = Object.entries(DEMO_CREDENTIALS).find(
      ([role, cred]) => cred.email === cleanEmail || cleanEmail.startsWith(role)
    );

    if (demoCredMatch) {
      const [roleName] = demoCredMatch;
      const foundUser = USERS.find((u) => u.email === cleanEmail || u.role === roleName);
      if (foundUser) {
        const userData: AuthUser = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          phone: foundUser.phone,
          location: foundUser.location,
        };
        localStorage.setItem('ns_auth', JSON.stringify(userData));
        set({ user: userData });
        return true;
      }
    }

    // 3. Check locally registered users
    const allUsers = [...get().registeredUsers, ...USERS];
    const found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      const userData: AuthUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        phone: found.phone || '',
        location: found.location || '',
      };
      localStorage.setItem('ns_auth', JSON.stringify(userData));
      set({ user: userData });
      return true;
    }

    return false;
  },

  signup: async (data: SignupData) => {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. Try Backend API Registration
    try {
      await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Ignore backend error for offline fallback
    }

    // 2. Save locally
    const userId = `USR${Date.now().toString().slice(-5)}`;
    const newUser: User & { password?: string } = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone || '+91 98765 00000',
      role: data.role,
      language: 'en',
      location: data.location || 'Ahmedabad, Gujarat',
      createdAt: new Date().toISOString().split('T')[0],
      password: data.password,
    };

    const updatedRegistered = [...get().registeredUsers, newUser];
    localStorage.setItem('ns_registered_users', JSON.stringify(updatedRegistered));

    const authData: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      location: newUser.location,
    };

    localStorage.setItem('ns_auth', JSON.stringify(authData));
    set({ user: authData, registeredUsers: updatedRegistered });
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
      const rawAuth = localStorage.getItem('ns_auth');
      const rawUsers = localStorage.getItem('ns_registered_users');
      set({
        user: rawAuth ? JSON.parse(rawAuth) : null,
        registeredUsers: rawUsers ? JSON.parse(rawUsers) : [],
      });
    } catch {
      // ignore
    }
  },
}));
