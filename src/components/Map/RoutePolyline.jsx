import React from 'react';
import { Polyline, Marker } from '@react-google-maps/api';

const RoutePolyline = ({ route }) => {
  if (!route || !route.waypoints) return null;

  const path = route.waypoints.map(wp => ({
    lat: wp.latitude,
    lng: wp.longitude
  }));

  return (
    <>
      {/* Blue route line */}
      <Polyline
        path={path}
        options={{
          strokeColor: '#3b82f6',
          strokeOpacity: 0.9,
          strokeWeight: 5,
          geodesic: true
        }}
      />

      {/* Start marker - Green */}
      <Marker
        position={path[0]}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3
        }}
        label={{
          text: 'Start',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
        title={`Start: ${route.waypoints[0].name}`}
      />

      {/* End marker - Red */}
      <Marker
        position={path[path.length - 1]}
        icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3
        }}
        label={{
          text: 'End',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
        title={`End: ${route.waypoints[route.waypoints.length - 1].name}`}
      />

      {/* Intermediate waypoint markers */}
      {route.waypoints.slice(1, -1).map((wp, idx) => (
        <Marker
          key={idx}
          position={{ lat: wp.latitude, lng: wp.longitude }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#3b82f6',
            fillOpacity: 0.8,
            strokeColor: 'white',
            strokeWeight: 2
          }}
          title={wp.name}
        />
      ))}
    </>
  );
};

export default RoutePolyline;