import { useEffect } from 'react';
import { initSocket, subscribeToAllBuses, subscribeToRoute, onLocationUpdate, offLocationUpdate, disconnectSocket } from '../services/socket';

export const useWebSocket = (setLocations, selectedRoute) => {
  useEffect(() => {
    const socket = initSocket();

    socket.on('connect', () => {
      console.log('WebSocket connected');
      if (selectedRoute) {
        subscribeToRoute(selectedRoute._id);
      } else {
        subscribeToAllBuses();
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    onLocationUpdate((data) => {
      console.log('Location update received:', data);
      
      // Update locations state
      setLocations(prevLocations => {
        // Check if we should filter by route
        if (selectedRoute && data.trip && data.trip.route) {
          if (data.trip.route._id !== selectedRoute._id) {
            return prevLocations; // Ignore updates from other routes
          }
        }

        // Find if bus already exists
        const existingIndex = prevLocations.findIndex(
          loc => loc.bus._id === data.bus._id
        );

        if (existingIndex >= 0) {
          // Update existing location
          const updated = [...prevLocations];
          updated[existingIndex] = data;
          return updated;
        } else {
          // Add new location
          return [...prevLocations, data];
        }
      });
    });

    return () => {
      offLocationUpdate();
      disconnectSocket();
    };
  }, [setLocations, selectedRoute]);
};