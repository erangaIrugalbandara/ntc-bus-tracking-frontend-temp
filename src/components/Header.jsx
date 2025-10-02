import React from 'react';
import { Bus, Navigation } from 'lucide-react';

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px 40px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <Bus size={32} />
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          NTC Bus Tracking System
        </h1>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
          Real-time bus tracking across Sri Lanka
        </p>
      </div>
    </header>
  );
};

export default Header;