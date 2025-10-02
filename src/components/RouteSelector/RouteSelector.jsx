import React, { useState, useMemo } from 'react';
import { MapPin, X, Filter } from 'lucide-react';

const RouteSelector = ({ routes, selectedRoute, onSelectRoute, loading }) => {
  const [originFilter, setOriginFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');

  // Get unique cities
  const cities = useMemo(() => {
    const allCities = new Set();
    routes.forEach(route => {
      allCities.add(route.origin);
      allCities.add(route.destination);
    });
    return Array.from(allCities).sort();
  }, [routes]);

  // Filter routes based on selected cities
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      const matchOrigin = !originFilter || route.origin === originFilter;
      const matchDestination = !destinationFilter || route.destination === destinationFilter;
      return matchOrigin && matchDestination;
    });
  }, [routes, originFilter, destinationFilter]);

  const clearFilters = () => {
    setOriginFilter('');
    setDestinationFilter('');
    onSelectRoute(null);
  };

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
          Find Your Bus Route
        </h2>
        {(selectedRoute || originFilter || destinationFilter) && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* City Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            <MapPin size={16} style={{ color: '#10b981' }} />
            From (Origin)
          </label>
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            <MapPin size={16} style={{ color: '#ef4444' }} />
            To (Destination)
          </label>
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Loading routes...
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#6b7280',
          background: '#f9fafb',
          borderRadius: '8px'
        }}>
          <Filter size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No routes found</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Try different cities or clear filters
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
            Found {filteredRoutes.length} route{filteredRoutes.length !== 1 ? 's' : ''}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filteredRoutes.map(route => (
              <div
                key={route._id}
                onClick={() => onSelectRoute(route)}
                style={{
                  padding: '16px',
                  background: selectedRoute?._id === route._id ? '#e0e7ff' : 'white',
                  border: selectedRoute?._id === route._id ? '2px solid #667eea' : '1px solid #e5e7eb',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  {route.name}
                </h3>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>From:</strong> {route.origin}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>To:</strong> {route.destination}
                  </div>
                  <div>
                    <strong>Distance:</strong> {route.distance} km
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RouteSelector;