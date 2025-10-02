import React from 'react';
import { Bus, Gauge, Navigation2, MapPin } from 'lucide-react';

const BusCard = ({ location, isSelected, onSelect, onFocus }) => {
  const { bus, location: loc, trip } = location;
  
  const getOperatorColor = (operator) => {
    return operator === 'SLTB' ? '#3b82f6' : '#10b981';
  };

  const getServiceTypeColor = (serviceType) => {
    const colors = {
      'AC': '#8b5cf6',
      'Semi-Luxury': '#f59e0b',
      'Luxury': '#ec4899',
      'Normal': '#6b7280'
    };
    return colors[serviceType] || '#6b7280';
  };

  return (
    <div
      style={{
        padding: '16px',
        background: isSelected ? '#e0e7ff' : 'white',
        border: isSelected ? '2px solid #667eea' : '1px solid #e5e7eb',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none'
      }}
      onClick={() => onSelect(location)}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'start',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: getOperatorColor(bus.operator),
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bus size={22} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ 
              margin: '0 0 4px 0', 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {bus.busNumber}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              color: '#6b7280'
            }}>
              {bus.operator}
            </p>
          </div>
        </div>
        <span style={{
          padding: '4px 10px',
          background: getServiceTypeColor(bus.serviceType),
          color: 'white',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          {bus.serviceType}
        </span>
      </div>

      {trip && trip.route && (
        <div style={{
          padding: '10px',
          background: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <p style={{ 
            margin: '0 0 4px 0', 
            fontSize: '13px', 
            fontWeight: '600',
            color: '#374151'
          }}>
            {trip.route.name}
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '11px', 
            color: '#6b7280'
          }}>
            {trip.route.origin} → {trip.route.destination}
          </p>
        </div>
      )}

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={16} style={{ color: '#667eea' }} />
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Speed</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              {loc.speed} km/h
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation2 size={16} style={{ color: '#667eea' }} />
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Heading</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
              {loc.heading}°
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(location);
          }}
          style={{
            flex: 1,
            padding: '8px',
            background: isSelected ? '#667eea' : '#e0e7ff',
            color: isSelected ? 'white' : '#667eea',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {isSelected ? 'Tracking' : 'Track Bus'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFocus(location);
          }}
          style={{
            padding: '8px 12px',
            background: 'white',
            color: '#667eea',
            border: '1px solid #667eea',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <MapPin size={14} />
          Focus
        </button>
      </div>

      <p style={{ 
        margin: '12px 0 0 0', 
        fontSize: '11px', 
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        Updated: {new Date(loc.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default BusCard;