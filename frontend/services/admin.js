import api from './api';

export const login = (credentials) =>
  api.post('/api/v1/admin/login', credentials);

export const getEnquiries = (params) =>
  api.get('/api/v1/admin/enquiries', { params });

export const updateEnquiryStatus = (id, status) =>
  api.patch(`/api/v1/admin/enquiries/${id}`, { status });

export const getAnalytics = () =>
  api.get('/api/v1/admin/analytics');
