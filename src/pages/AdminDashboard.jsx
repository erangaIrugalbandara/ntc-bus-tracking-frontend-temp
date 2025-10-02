import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Bus, 
  Map, 
  Clock, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import Dashboard from '../components/Admin/Dashboard';
import BusManagement from '../components/Admin/BusManagement';
import RouteManagement from '../components/Admin/RouteManagement';
import TripManagement from '../components/Admin/TripManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/buses', icon: Bus, label: 'Buses' },
    { path: '/admin/routes', icon: Map, label: 'Routes' },
    { path: '/admin/trips', icon: Clock, label: 'Trips' }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        transition: 'width 0.3s',
        overflow: 'hidden',
        boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bus size={24} style={{ color: 'white' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                NTC Admin
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                {user?.name || 'Administrator'}
              </p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '20px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '8px',
                background: window.location.pathname === item.path 
                  ? 'rgba(255,255,255,0.2)' 
                  : 'transparent',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s',
                fontSize: '15px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.location.pathname !== item.path) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          right: '20px' 
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '8px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            <Home size={20} />
            User View
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '20px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            {navItems.find(item => item.path === window.location.pathname)?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buses" element={<BusManagement />} />
            <Route path="/routes" element={<RouteManagement />} />
            <Route path="/trips" element={<TripManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;