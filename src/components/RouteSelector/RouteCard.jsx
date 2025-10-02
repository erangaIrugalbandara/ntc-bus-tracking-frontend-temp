import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

const RouteCard = ({ route, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(route)}
      style={{
        padding: '20px',
        background: isSelected ? '#e0e7ff' : 'white',
        border: isSelected ? '2px solid #667eea' : '1px solid #e5e7eb',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          background: isSelected ? '#667eea' : '#f3f4f6',
          color: isSelected ? 'white' : '#6b7280',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Navigation size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            {route.name}
          </h3>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '12px', 
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {route.routeNumber}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '14px', color: '#4b5563' }}>
            <strong>From:</strong> {route.origin}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '14px', color: '#4b5563' }}>
            <strong>To:</strong> {route.destination}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '14px', color: '#4b5563' }}>
            <strong>Distance:</strong> {route.distance} km
          </span>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;