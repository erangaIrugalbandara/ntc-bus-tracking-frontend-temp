import { useState, useEffect } from 'react';
import { routeAPI } from '../services/api';

export const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await routeAPI.getAll();
        setRoutes(response.data.data.routes);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, loading, error };
};