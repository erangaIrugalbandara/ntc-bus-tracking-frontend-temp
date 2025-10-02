import React from 'react';
import { OverlayView } from '@react-google-maps/api';

const BusMarker = ({ location, onClick }) => {
  const { bus, location: loc } = location;
  
  // Color based on operator: Red for SLTB, Green for Private
  const color = bus.operator === 'SLTB' ? '#ef4444' : '#10b981';

  return (
    <OverlayView
      position={{ lat: loc.latitude, lng: loc.longitude }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={() => onClick(location)}
        style={{
          transform: `translate(-50%, -50%) rotate(${loc.heading}deg)`,
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: color,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          border: '3px solid white',
          boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            transform: 'rotate(45deg)',
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
          transform: 'translateX(-50%) rotate(45deg)',
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
      </div>
    </OverlayView>
  );
};

export default BusMarker;