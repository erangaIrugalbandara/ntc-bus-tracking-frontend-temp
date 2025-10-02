import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Bus, Map, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      title: 'Total Buses',
      value: stats.totalBuses,
      subtitle: `${stats.activeBuses} active`,
      icon: Bus,
      color: '#3b82f6',
      bg: '#dbeafe'
    },
    {
      title: 'Total Routes',
      value: stats.totalRoutes,
      subtitle: 'Across Sri Lanka',
      icon: Map,
      color: '#10b981',
      bg: '#d1fae5'
    },
    {
      title: 'Active Trips',
      value: stats.activeTrips,
      subtitle: 'Currently running',
      icon: Clock,
      color: '#f59e0b',
      bg: '#fef3c7'
    },
    {
      title: 'Scheduled Trips',
      value: stats.scheduledTrips,
      subtitle: 'Upcoming',
      icon: TrendingUp,
      color: '#8b5cf6',
      bg: '#ede9fe'
    }
  ] : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '14px', 
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {card.title}
                </p>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  {card.value}
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '13px', 
                  color: '#9ca3af'
                }}>
                  {card.subtitle}
                </p>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                background: card.bg,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <card.icon size={28} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          System Overview
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1f2937' }}>
              Fleet Status
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              {stats.activeBuses} out of {stats.totalBuses} buses are currently active and operational.
            </p>
          </div>

          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1f2937' }}>
              Route Coverage
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              {stats.totalRoutes} routes covering major cities across Sri Lanka.
            </p>
          </div>

          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1f2937' }}>
              Trip Management
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              {stats.activeTrips} trips in progress with {stats.scheduledTrips} scheduled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;