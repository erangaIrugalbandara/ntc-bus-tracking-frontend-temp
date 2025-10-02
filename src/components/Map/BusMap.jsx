import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import BusMarker from './BusMarker';
import RoutePolyline from './RoutePolyline';
import LoadingSpinner from '../LoadingSpinner';
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_OPTIONS, GOOGLE_MAPS_API_KEY } from '../../utils/constants';

const BusMap = ({ locations, selectedRoute, center }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['geometry']
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit bounds to show all buses
  React.useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({
          lat: location.location.latitude,
          lng: location.location.longitude
        });
      });

      // If route is selected, include route waypoints
      if (selectedRoute && selectedRoute.waypoints) {
        selectedRoute.waypoints.forEach(wp => {
          bounds.extend({
            lat: wp.latitude,
            lng: wp.longitude
          });
        });
      }

      map.fitBounds(bounds);
    }
  }, [map, locations, selectedRoute]);

  if (loadError) {
    return (
      <div style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee',
        borderRadius: '12px',
        color: '#c00'
      }}>
        Error loading Google Maps. Please check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ height: '600px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center || DEFAULT_CENTER}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={MAP_OPTIONS}
      >
        {/* Draw route polyline if route is selected */}
        {selectedRoute && <RoutePolyline route={selectedRoute} />}

        {/* Draw bus markers */}
        {locations.map(location => (
          <BusMarker
            key={location.bus._id}
            location={location}
            onClick={(bus) => setSelectedBus(bus)}
          />
        ))}

        {/* Info window for selected bus */}
        {selectedBus && (
          <InfoWindow
            position={{
              lat: selectedBus.location.latitude,
              lng: selectedBus.location.longitude
            }}
            onCloseClick={() => setSelectedBus(null)}
          >
            <div style={{ padding: '10px', minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                Bus {selectedBus.bus.busNumber}
              </h3>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Type:</strong> {selectedBus.bus.serviceType}
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Operator:</strong> {selectedBus.bus.operator}
              </p>
              {selectedBus.trip && selectedBus.trip.route && (
                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                  <strong>Route:</strong> {selectedBus.trip.route.name}
                </p>
              )}
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Speed:</strong> {selectedBus.location.speed} km/h
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Heading:</strong> {selectedBus.location.heading}°
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
                Last updated: {new Date(selectedBus.location.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default BusMap;