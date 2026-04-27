import api from './api';

export const getActiveSlides = () => api.get('/api/v1/carousel');
export const getAllSlides = () => api.get('/api/v1/admin/carousel');
export const createSlide = (data) => api.post('/api/v1/admin/carousel', data);
export const updateSlide = (id, data) => api.put(`/api/v1/admin/carousel/${id}`, data);
export const deleteSlide = (id) => api.delete(`/api/v1/admin/carousel/${id}`);
