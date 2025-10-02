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
        const response = await locationAPI.getActive();
        let allLocations = response.data.data.locations;

        // Filter by route if selected
        if (selectedRoute) {
          allLocations = allLocations.filter(
            loc => loc.trip && loc.trip.route && loc.trip.route._id === selectedRoute._id
          );
        }

        setLocations(allLocations);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 30000); // Fallback polling

    return () => clearInterval(interval);
  }, [selectedRoute]);

  return { locations, setLocations, loading, error };
};