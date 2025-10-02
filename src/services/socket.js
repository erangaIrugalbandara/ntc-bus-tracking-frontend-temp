import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/constants';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
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
  socket.emit('subscribe-all-buses');
};

export const subscribeToBus = (busNumber) => {
  const socket = getSocket();
  socket.emit('subscribe-bus', busNumber);
};

export const subscribeToRoute = (routeId) => {
  const socket = getSocket();
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