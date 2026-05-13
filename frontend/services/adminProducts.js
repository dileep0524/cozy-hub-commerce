import api from './api';

export const getProducts = (params) =>
  api.get('/api/v1/admin/products', { params });

export const getProduct = (id) =>
  api.get(`/api/v1/admin/products/${id}`);

export const createProduct = (data) =>
  api.post('/api/v1/admin/products', data);

export const updateProduct = (id, data) =>
  api.put(`/api/v1/admin/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/api/v1/admin/products/${id}`);

export const uploadProductImage = (id, formData) =>
  api.post(`/api/v1/admin/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProductImage = (productId, imageId) =>
  api.delete(`/api/v1/admin/products/${productId}/images/${imageId}`);

export const addVariant = (productId, data) =>
  api.post(`/api/v1/admin/products/${productId}/variants`, data);

export const updateVariant = (productId, variantId, data) =>
  api.put(`/api/v1/admin/products/${productId}/variants/${variantId}`, data);

export const deleteVariant = (productId, variantId) =>
  api.delete(`/api/v1/admin/products/${productId}/variants/${variantId}`);

// Seller management
export const getSellers = (params) =>
  api.get('/api/v1/admin/sellers', { params });

export const getSeller = (id) =>
  api.get(`/api/v1/admin/sellers/${id}`);

export const createSeller = (data) =>
  api.post('/api/v1/admin/sellers', data);

export const updateSellerStatus = (id, status) =>
  api.patch(`/api/v1/admin/sellers/${id}/status`, { status });

// Admin orders
export const getAdminOrders = (params) =>
  api.get('/api/v1/admin/orders', { params });

export const getAdminOrder = (id) =>
  api.get(`/api/v1/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  api.patch(`/api/v1/admin/orders/${id}/status`, { status });
