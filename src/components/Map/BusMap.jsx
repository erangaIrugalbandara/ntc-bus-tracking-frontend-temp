import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Marker, Polyline } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import BusMarker from './BusMarker';
import LoadingSpinner from '../LoadingSpinner';
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_OPTIONS, GOOGLE_MAPS_API_KEY } from '../../utils/constants';

const BusMap = ({ locations = [], selectedRoute, center, followBus }) => {
  const [selectedBus, setSelectedBus] = useState(null);
  const [map, setMap] = useState(null);
  const previousLocationsRef = useRef({});

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

  // Smooth animation for bus locations - with validation
  useEffect(() => {
    if (!locations || !Array.isArray(locations)) return;
    
    locations.forEach(location => {
      if (location && location.bus && location.bus._id && location.location) {
        previousLocationsRef.current[location.bus._id] = {
          lat: location.location.latitude,
          lng: location.location.longitude
        };
      }
    });
  }, [locations]);

  // Only auto-fit on initial load or route change 
useEffect(() => {
  if (!map) return;

  // Only fit bounds when route changes or on initial load
  // NOT when locations update
  if (selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.length > 0) {
    const bounds = new window.google.maps.LatLngBounds();
    
    selectedRoute.waypoints.forEach(wp => {
      bounds.extend({
        lat: wp.latitude,
        lng: wp.longitude
      });
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }
  } else if (!selectedRoute && locations.length === 0) {
    // Reset to default only when no route and no buses
    map.setCenter(DEFAULT_CENTER);
    map.setZoom(12);
  }
}, [map, selectedRoute]); 

  // Follow selected bus
  useEffect(() => {
    if (map && followBus && center) {
      map.panTo(center);
      const currentZoom = map.getZoom();
    if (currentZoom < 14) {
      map.setZoom(15);
    }
  }
}, [map, center, followBus]);

  // Clear selected bus when route changes
  useEffect(() => {
    setSelectedBus(null);
  }, [selectedRoute]);

  if (loadError) {
    return (
      <div style={{
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee',
        borderRadius: '12px',
        color: '#c00',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>Error loading Google Maps</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Please check your API key in the .env file
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  // Prepare route polyline path - ONLY if route is selected
  const routePath = selectedRoute && selectedRoute.waypoints 
    ? selectedRoute.waypoints
        .filter(wp => wp && typeof wp.latitude === 'number' && typeof wp.longitude === 'number')
        .map(wp => ({
          lat: wp.latitude,
          lng: wp.longitude
        }))
    : [];

  // Filter valid locations
  const validLocations = (locations || []).filter(location => 
    location && 
    location.bus && 
    location.location && 
    typeof location.location.latitude === 'number' && 
    typeof location.location.longitude === 'number'
  );

  return (
    <div style={{ 
      height: '600px', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center || DEFAULT_CENTER}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={MAP_OPTIONS}
      >
        {/* Draw blue route polyline - ONLY if selectedRoute exists */}
        {selectedRoute && routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeWeight: 5,
              geodesic: true
            }}
          />
        )}

        {/* Draw route waypoint markers - ONLY if selectedRoute exists */}
        {selectedRoute && selectedRoute.waypoints && selectedRoute.waypoints.map((waypoint, index) => {
          if (!waypoint || typeof waypoint.latitude !== 'number' || typeof waypoint.longitude !== 'number') {
            return null;
          }

          const isStart = index === 0;
          const isEnd = index === selectedRoute.waypoints.length - 1;
          
          let markerColor = '#3b82f6'; // Blue for intermediate
          let label = '';
          
          if (isStart) {
            markerColor = '#10b981'; // Green for start
            label = 'Start';
          } else if (isEnd) {
            markerColor = '#ef4444'; // Red for end
            label = 'End';
          }

          return (
            <Marker
              key={`waypoint-${index}`}
              position={{ lat: waypoint.latitude, lng: waypoint.longitude }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: isStart || isEnd ? 10 : 6,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2
              }}
              title={waypoint.name || ''}
              label={isStart || isEnd ? {
                text: label,
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold'
              } : undefined}
            />
          );
        })}

        {/* Draw bus markers - only valid locations */}
        {validLocations.map(location => (
          <BusMarker
            key={location.bus._id}
            location={location}
            onClick={(bus) => setSelectedBus(bus)}
          />
        ))}

        {/* Info window for selected bus */}
        {selectedBus && selectedBus.location && (
          <InfoWindow
            position={{
              lat: selectedBus.location.latitude,
              lng: selectedBus.location.longitude
            }}
            onCloseClick={() => setSelectedBus(null)}
          >
            <div style={{ padding: '10px', minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                Bus {selectedBus.bus?.busNumber || 'N/A'}
              </h3>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Type:</strong> {selectedBus.bus?.serviceType || 'N/A'}
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Operator:</strong> {selectedBus.bus?.operator || 'N/A'}
              </p>
              {selectedBus.trip && selectedBus.trip.route && (
                <p style={{ margin: '4px 0', fontSize: '13px' }}>
                  <strong>Route:</strong> {selectedBus.trip.route.name}
                </p>
              )}
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Speed:</strong> {selectedBus.location.speed ?? 0} km/h
              </p>
              <p style={{ margin: '4px 0', fontSize: '13px' }}>
                <strong>Heading:</strong> {selectedBus.location.heading ?? 0}°
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
                Last updated: {selectedBus.location.timestamp 
                  ? new Date(selectedBus.location.timestamp).toLocaleTimeString() 
                  : 'N/A'}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Status indicator */}
      {validLocations.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '14px',
          fontWeight: '600',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }} />
          {validLocations.length} Active Bus{validLocations.length !== 1 ? 'es' : ''}
        </div>
      )}

      {/* No route selected message */}
      {!selectedRoute && validLocations.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#e0e7ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <MapPin size={24} style={{ color: '#667eea' }} />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
            Select a Route
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Choose a bus route to see active buses and their locations
          </p>
        </div>
      )}
    </div>
  );
};

export default BusMap;