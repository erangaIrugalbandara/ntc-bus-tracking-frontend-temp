export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const DEFAULT_CENTER = {
  lat: 6.9271,
  lng: 79.8612
};

export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%'
};

export const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true
};

export const BUS_ICON_COLORS = {
  'Normal': '#3b82f6',
  'Semi-Luxury': '#8b5cf6',
  'AC': '#10b981',
  'Luxury': '#f59e0b'
};