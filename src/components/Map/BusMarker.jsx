import React, { useState, useEffect, useRef } from 'react';
import { OverlayView } from '@react-google-maps/api';

const BusMarker = ({ location, onClick }) => {
  const { bus, location: loc } = location;
  const [displayPosition, setDisplayPosition] = useState({ 
    lat: loc.latitude, 
    lng: loc.longitude 
  });
  const [displayHeading, setDisplayHeading] = useState(loc.heading);
  const animationRef = useRef(null);
  const prevLocationRef = useRef({ lat: loc.latitude, lng: loc.longitude, heading: loc.heading });
  
  const color = bus.operator === 'SLTB' ? '#ef4444' : '#10b981';

  useEffect(() => {
    // Cancel previous animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startPos = prevLocationRef.current;
    const endPos = { lat: loc.latitude, lng: loc.longitude, heading: loc.heading };
    
    const startTime = Date.now();
    const duration = 5000; // 5 seconds to match UPDATE_INTERVAL

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out function for smoother animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const lat = startPos.lat + (endPos.lat - startPos.lat) * easeProgress;
      const lng = startPos.lng + (endPos.lng - startPos.lng) * easeProgress;
      const heading = startPos.heading + (endPos.heading - startPos.heading) * easeProgress;
      
      setDisplayPosition({ lat, lng });
      setDisplayHeading(heading);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevLocationRef.current = endPos;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loc.latitude, loc.longitude, loc.heading]);

  return (
    <OverlayView
      position={displayPosition}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={() => onClick(location)}
        style={{
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: color,
          borderRadius: '50% 50% 50% 0',
          transform: `rotate(${displayHeading - 45}deg)`,
          border: '3px solid white',
          boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'none'
        }}>
          <span style={{
            transform: `rotate(${45 - displayHeading}deg)`,
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            🚌
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '-28px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          color: color,
          border: `2px solid ${color}`,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          {bus.busNumber}
        </div>

        {loc.speed > 0 && (
          <div style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {Math.round(loc.speed)} km/h
          </div>
        )}
      </div>
    </OverlayView>
  );
};

export default BusMarker;