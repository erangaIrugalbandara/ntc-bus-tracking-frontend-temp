import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RouteSelector from '../components/RouteSelector/RouteSelector';
import BusMap from '../components/Map/BusMap';
import BusList from '../components/BusList/BusList';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRoutes } from '../hooks/useRoutes';
import { useBusLocations } from '../hooks/useBusLocations';
import { useWebSocket } from '../hooks/useWebSocket';
import { Settings } from 'lucide-react';

function UserPage() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [showAllBuses, setShowAllBuses] = useState(true);
  const navigate = useNavigate();
  
  const { routes, loading: routesLoading } = useRoutes();
  const { locations, setLocations, loading: locationsLoading } = useBusLocations(selectedRoute);
  
  useWebSocket(setLocations, selectedRoute);

  // Reset bus selection when route changes
  useEffect(() => {
    setSelectedBus(null);
    setShowAllBuses(true);
  }, [selectedRoute]);

  const handleSelectRoute = (route) => {
    // Clear previous selections
    setSelectedBus(null);
    setShowAllBuses(true);
    setSelectedRoute(route);
    
    if (route && route.waypoints && route.waypoints.length > 0) {
      // Center map on the first waypoint of the route
      setMapCenter({
        lat: route.waypoints[0].latitude,
        lng: route.waypoints[0].longitude
      });
    } else {
      // If route is cleared, reset map center
      setMapCenter(null);
    }
  };

  const handleSelectBus = (location) => {
    setSelectedBus(location);
    setShowAllBuses(false);
    setMapCenter({
      lat: location.location.latitude,
      lng: location.location.longitude
    });
  };

  const handleShowAllBuses = () => {
    setSelectedBus(null);
    setShowAllBuses(true);
  };

  const handleFocusBus = (location) => {
  setSelectedBus(location);
  setShowAllBuses(false);
  setMapCenter({
    lat: location.location.latitude,
    lng: location.location.longitude
  });
};

  const displayLocations = showAllBuses ? locations : (selectedBus ? [selectedBus] : []);

  if (routesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header>
        <button
          onClick={() => navigate('/admin/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
          }}
        >
          <Settings size={18} />
          Admin Panel
        </button>
      </Header>
      
      <div className="container">
        <RouteSelector
          routes={routes}
          selectedRoute={selectedRoute}
          onSelectRoute={handleSelectRoute}
          loading={routesLoading}
        />

        <div className="main-content">
          <div className="map-container">
            <BusMap
              locations={displayLocations}
              selectedRoute={selectedRoute}
              center={mapCenter}
              followBus={!!selectedBus}
            />
          </div>

          <div className="sidebar">
            {selectedRoute && locations.length > 0 && (
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={handleShowAllBuses}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: showAllBuses ? '#667eea' : 'white',
                      color: showAllBuses ? 'white' : '#667eea',
                      border: showAllBuses ? 'none' : '2px solid #667eea',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    All Buses ({locations.length})
                  </button>
                  {selectedBus && (
                    <button
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Tracking: {selectedBus.bus.busNumber}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <BusList
              locations={locations}
              selectedBus={selectedBus}
              onSelectBus={handleSelectBus}
              onFocusBus={handleFocusBus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPage;