import api from './api';

export const submitEnquiry = (data) => api.post('/api/v1/enquiries', data);
