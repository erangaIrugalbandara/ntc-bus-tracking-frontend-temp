import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    console.log('Initializing socket connection to:', API_BASE_URL);
    socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToAllBuses = () => {
  const socket = getSocket();
  console.log('Emitting: subscribe-all-buses');
  socket.emit('subscribe-all-buses');
};

export const subscribeToBus = (busNumber) => {
  const socket = getSocket();
  console.log('Emitting: subscribe-bus', busNumber);
  socket.emit('subscribe-bus', busNumber);
};

export const subscribeToRoute = (routeId) => {
  const socket = getSocket();
  console.log('Emitting: subscribe-route', routeId);
  socket.emit('subscribe-route', routeId);
};

export const onLocationUpdate = (callback) => {
  const socket = getSocket();
  socket.on('location-update', callback);
};

export const offLocationUpdate = () => {
  const socket = getSocket();
  socket.off('location-update');
};