import React from 'react';
import { Bus, Gauge, Navigation2 } from 'lucide-react';

const BusCard = ({ location, onFocus }) => {
  const { bus, location: loc, trip } = location;
  
  // Color based on operator: Red for SLTB, Green for Private
  const color = bus.operator === 'SLTB' ? '#ef4444' : '#10b981';

  return (
    <div
      onClick={() => onFocus(location)}
      style={{
        padding: '16px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: color,
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Bus size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
            {bus.busNumber}
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
            {bus.serviceType} • {bus.operator}
          </p>
        </div>
        <div style={{
          background: color,
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          {bus.operator}
        </div>
      </div>

      {trip && trip.route && (
        <div style={{
          padding: '8px 12px',
          background: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#4b5563'
        }}>
          <strong>Route:</strong> {trip.route.name}
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '8px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
          <Gauge size={16} />
          <span>{loc.speed} km/h</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
          <Navigation2 size={16} />
          <span>{loc.heading}°</span>
        </div>
      </div>

      <div style={{ 
        fontSize: '11px', 
        color: '#9ca3af',
        textAlign: 'right'
      }}>
        Updated: {new Date(loc.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default BusCard;