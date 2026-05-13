import sellerApi from './sellerApi';

export const sellerLogin = (credentials) =>
  sellerApi.post('/api/v1/seller/login', credentials);

export const getSellerMe = () =>
  sellerApi.get('/api/v1/seller/me');

// Products
export const getSellerProducts = (params) =>
  sellerApi.get('/api/v1/seller/products', { params });

export const getSellerProduct = (id) =>
  sellerApi.get(`/api/v1/seller/products/${id}`);

// Orders
export const placeOrder = (data) =>
  sellerApi.post('/api/v1/seller/orders', data);

export const getSellerOrders = (params) =>
  sellerApi.get('/api/v1/seller/orders', { params });

export const getSellerOrder = (id) =>
  sellerApi.get(`/api/v1/seller/orders/${id}`);

export const cancelOrder = (id) =>
  sellerApi.patch(`/api/v1/seller/orders/${id}/cancel`);

// Wallet
export const getWallet = () =>
  sellerApi.get('/api/v1/seller/wallet');

export const getWalletTransactions = (params) =>
  sellerApi.get('/api/v1/seller/wallet/transactions', { params });

export const initiateTopup = (amount) =>
  sellerApi.post('/api/v1/seller/wallet/topup/initiate', { amount });

export const verifyTopup = (data) =>
  sellerApi.post('/api/v1/seller/wallet/topup/verify', data);
