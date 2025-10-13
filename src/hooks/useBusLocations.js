import { useState, useEffect } from 'react';
import { locationAPI } from '../services/api';

export const useBusLocations = (selectedRoute) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        console.log('Fetching active locations...');
        const response = await locationAPI.getActive();
        
        let allLocations = response.data.data.locations || [];
        console.log(`Received ${allLocations.length} locations from API`);

        // Filter by route if selected
        if (selectedRoute) {
          allLocations = allLocations.filter(
            loc => loc.trip && loc.trip.route && loc.trip.route._id === selectedRoute._id
          );
          console.log(`Filtered to ${allLocations.length} locations for route ${selectedRoute.name}`);
        }

        setLocations(allLocations);
        setError(null);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err.message);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    
    // Fallback polling every 30 seconds
    const interval = setInterval(fetchLocations, 30000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  return { locations, setLocations, loading, error };
};