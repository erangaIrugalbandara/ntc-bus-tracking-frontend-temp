import React from 'react';
import BusCard from './BusCard';
import { Bus } from 'lucide-react';

const BusList = ({ locations, onFocusBus }) => {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      height: '600px',
      overflowY: 'auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '20px',
        position: 'sticky',
        top: 0,
        background: 'white',
        paddingBottom: '10px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <Bus size={24} style={{ color: '#667eea' }} />
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
          Active Buses ({locations.length})
        </h2>
      </div>

      {locations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#9ca3af'
        }}>
          <Bus size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '16px', margin: 0 }}>No active buses on this route</p>
          <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>
            Try selecting a different route or check back later
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {locations.map(location => (
            <BusCard
              key={location.bus._id}
              location={location}
              onFocus={onFocusBus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusList;