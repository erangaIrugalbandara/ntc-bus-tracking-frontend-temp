import React, { useState, useMemo } from 'react';
import { MapPin, X, Filter } from 'lucide-react';

const RouteSelector = ({ routes, selectedRoute, onSelectRoute, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter routes based on search
  const filteredRoutes = useMemo(() => {
    if (!searchTerm) return routes;
    
    return routes.filter(route => {
      const searchLower = searchTerm.toLowerCase();
      return (
        route.name.toLowerCase().includes(searchLower) ||
        route.origin.toLowerCase().includes(searchLower) ||
        route.destination.toLowerCase().includes(searchLower) ||
        route.routeNumber.toLowerCase().includes(searchLower)
      );
    });
  }, [routes, searchTerm]);

  const clearSelection = () => {
    setSearchTerm('');
    onSelectRoute(null); // This clears the route
  };

  const handleRouteClick = (route) => {
    // If clicking the same route, don't do anything
    // If clicking a different route, select it
    onSelectRoute(route);
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
          Select Bus Route
        </h2>
        {(selectedRoute || searchTerm) && (
          <button
            onClick={clearSelection}
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
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dc2626';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <X size={16} />
            Clear Selection
          </button>
        )}
      </div>

      {/* Search Box */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search routes by name, origin, or destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
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
            {searchTerm ? 'Try a different search term' : 'No routes available'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
            {selectedRoute ? (
              <span style={{ color: '#667eea', fontWeight: '600' }}>
                ✓ Selected: {selectedRoute.name}
              </span>
            ) : (
              `${filteredRoutes.length} route${filteredRoutes.length !== 1 ? 's' : ''} available`
            )}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filteredRoutes.map(route => (
              <div
                key={route._id}
                onClick={() => handleRouteClick(route)}
                style={{
                  padding: '16px',
                  background: selectedRoute?._id === route._id ? '#e0e7ff' : 'white',
                  border: selectedRoute?._id === route._id ? '2px solid #667eea' : '1px solid #e5e7eb',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedRoute?._id !== route._id) {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedRoute?._id !== route._id) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {selectedRoute?._id === route._id && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '24px',
                    height: '24px',
                    background: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
                
                <div style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: selectedRoute?._id === route._id ? '#667eea' : '#f3f4f6',
                  color: selectedRoute?._id === route._id ? 'white' : '#374151',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  {route.routeNumber}
                </div>

                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: '#1f2937',
                  paddingRight: '32px'
                }}>
                  {route.name}
                </h3>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <MapPin size={14} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      <strong>From:</strong> {route.origin}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} style={{ color: '#ef4444' }} />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      <strong>To:</strong> {route.destination}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  marginTop: '12px',
                  borderTop: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <span><strong>Distance:</strong> {route.distance} km</span>
                  <span><strong>Stops:</strong> {route.waypoints?.length || 0}</span>
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