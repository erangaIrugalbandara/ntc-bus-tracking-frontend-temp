import { useEffect, useRef } from 'react';
import { initSocket, subscribeToAllBuses, subscribeToRoute, onLocationUpdate, offLocationUpdate, disconnectSocket } from '../services/socket';

export const useWebSocket = (setLocations, selectedRoute) => {
  const socketRef = useRef(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✓ WebSocket connected');
      
      // Subscribe based on selected route
      if (selectedRoute) {
        console.log('Subscribing to route:', selectedRoute._id);
        subscribeToRoute(selectedRoute._id);
      } else {
        console.log('Subscribing to all buses');
        subscribeToAllBuses();
      }
      isSubscribedRef.current = true;
    };

    const handleDisconnect = () => {
      console.log('⚠ WebSocket disconnected');
      isSubscribedRef.current = false;
    };

    const handleReconnect = () => {
      console.log('✓ WebSocket reconnected');
      // Re-subscribe on reconnect
      if (isSubscribedRef.current) {
        if (selectedRoute) {
          subscribeToRoute(selectedRoute._id);
        } else {
          subscribeToAllBuses();
        }
      }
    };

    const handleLocationUpdate = (data) => {
      console.log('📍 Location update:', data.bus.busNumber);
      
      setLocations(prevLocations => {
        // Filter by route if selected
        if (selectedRoute) {
          // Check if this update is for our selected route
          if (!data.trip || !data.trip.route || data.trip.route._id !== selectedRoute._id) {
            return prevLocations; // Ignore updates from other routes
          }
        }

        // Find if bus already exists in locations
        const existingIndex = prevLocations.findIndex(
          loc => loc.bus._id === data.bus._id
        );

        if (existingIndex >= 0) {
          // Update existing location
          const updated = [...prevLocations];
          updated[existingIndex] = data;
          return updated;
        } else {
          // Add new location only if it matches our filter
          if (!selectedRoute || (data.trip && data.trip.route && data.trip.route._id === selectedRoute._id)) {
            return [...prevLocations, data];
          }
          return prevLocations;
        }
      });
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    onLocationUpdate(handleLocationUpdate);

    // Initial subscription if already connected
    if (socket.connected) {
      handleConnect();
    }

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      offLocationUpdate();
      isSubscribedRef.current = false;
    };
  }, [setLocations, selectedRoute]);

  // Re-subscribe when route changes
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('Route changed, re-subscribing...');
      if (selectedRoute) {
        subscribeToRoute(selectedRoute._id);
      } else {
        subscribeToAllBuses();
      }
    }
  }, [selectedRoute]);
};