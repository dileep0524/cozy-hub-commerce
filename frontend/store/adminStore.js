import { create } from 'zustand';

const useAdminStore = create((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,

  setAuth: (token, admin) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_info', JSON.stringify(admin));
    }
    set({ token, admin, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
    }
    set({ token: null, admin: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_token');
    const adminRaw = localStorage.getItem('admin_info');
    if (token && adminRaw) {
      try {
        const admin = JSON.parse(adminRaw);
        set({ token, admin, isAuthenticated: true });
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
      }
    }
  },
}));

export default useAdminStore;
