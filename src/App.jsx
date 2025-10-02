import React, { useState } from 'react';
import Header from './components/Header';
import RouteSelector from './components/RouteSelector/RouteSelector';
import BusMap from './components/Map/BusMap';
import BusList from './components/BusList/BusList';
import LoadingSpinner from './components/LoadingSpinner';
import { useRoutes } from './hooks/useRoutes';
import { useBusLocations } from './hooks/useBusLocations';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  
  const { routes, loading: routesLoading } = useRoutes();
  const { locations, setLocations, loading: locationsLoading } = useBusLocations(selectedRoute);
  
  useWebSocket(setLocations, selectedRoute);

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    if (route && route.waypoints && route.waypoints.length > 0) {
      setMapCenter({
        lat: route.waypoints[0].latitude,
        lng: route.waypoints[0].longitude
      });
    }
  };

  const handleFocusBus = (location) => {
    setMapCenter({
      lat: location.location.latitude,
      lng: location.location.longitude
    });
  };

  if (routesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      
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
              locations={locations}
              selectedRoute={selectedRoute}
              center={mapCenter}
            />
          </div>

          <div className="sidebar">
            <BusList
              locations={locations}
              onFocusBus={handleFocusBus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;