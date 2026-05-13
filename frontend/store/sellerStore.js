import { create } from 'zustand';

const useSellerStore = create((set) => ({
  token: null,
  seller: null,
  wallet: null,
  isAuthenticated: false,

  setAuth: (token, seller) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('seller_token', token);
      localStorage.setItem('seller_info', JSON.stringify(seller));
    }
    set({ token, seller, isAuthenticated: true });
  },

  setWallet: (wallet) => set({ wallet }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('seller_token');
      localStorage.removeItem('seller_info');
    }
    set({ token: null, seller: null, wallet: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('seller_token');
    const sellerRaw = localStorage.getItem('seller_info');
    if (token && sellerRaw) {
      try {
        const seller = JSON.parse(sellerRaw);
        set({ token, seller, isAuthenticated: true });
      } catch {
        localStorage.removeItem('seller_token');
        localStorage.removeItem('seller_info');
      }
    }
  },
}));

export default useSellerStore;
