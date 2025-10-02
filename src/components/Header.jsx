import React from 'react';
import { Bus, Navigation } from 'lucide-react';

const Header = ({ children }) => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <Bus size={28} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              NTC Bus Tracking System
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '4px'
            }}>
              <Navigation size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
              <p style={{ 
                margin: 0, 
                fontSize: '13px', 
                color: 'rgba(255,255,255,0.9)'
              }}>
                Real-time bus location tracking across Sri Lanka
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
};

export default Header;