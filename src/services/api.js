import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const routeAPI = {
  getAll: () => api.get('/public/routes'),
  getById: (id) => api.get(`/public/routes/${id}`)
};

export const tripAPI = {
  getActive: () => api.get('/public/trips/active'),
  getUpcoming: (routeId) => api.get(`/public/trips/upcoming/${routeId}`)
};

export const locationAPI = {
  getActive: () => api.get('/public/locations/active'),
  getBusLocation: (busId) => api.get(`/public/buses/${busId}/location`)
};

export default api;