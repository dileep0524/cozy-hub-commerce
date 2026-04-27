import api from './api';

export const trackVisit = (page) =>
  api.post('/api/v1/visitors', { page }).catch(() => {});
