import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, MapPin, Navigation } from 'lucide-react';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/routes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRoutes(response.data.data.routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading routes...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {routes.map(route => (
          <div
            key={route._id}
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
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                    {route.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Route #{route.routeNumber}
                  </p>
                </div>
                <span style={{
                  padding: '6px 12px',
                  background: '#e0e7ff',
                  color: '#667eea',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Active
                </span>
              </div>
            </div>

            <div style={{ 
              marginBottom: '16px',
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                <MapPin size={18} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#6b7280' }}>From</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {route.origin}
                  </p>
                </div>
              </div>
              <div style={{ 
                height: '2px', 
                background: 'linear-gradient(to right, #10b981, #ef4444)',
                margin: '0 0 12px 9px',
                width: 'calc(100% - 18px)'
              }} />
              <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <MapPin size={18} style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: '12px', color: '#6b7280' }}>To</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {route.destination}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                padding: '12px',
                background: '#dbeafe',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#1e40af', fontWeight: '600' }}>
                  Distance
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>
                  {route.distance} km
                </p>
              </div>
              <div style={{
                padding: '12px',
                background: '#fef3c7',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#92400e', fontWeight: '600' }}>
                  Duration
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#92400e' }}>
                  {Math.floor(route.estimatedDuration / 60)}h {route.estimatedDuration % 60}m
                </p>
              </div>
              <div style={{
                padding: '12px',
                background: '#ede9fe',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#5b21b6', fontWeight: '600' }}>
                  Stops
                </p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#5b21b6' }}>
                  {route.waypoints?.length || 0}
                </p>
              </div>
            </div>

            {route.waypoints && route.waypoints.length > 0 && (
              <div style={{
                padding: '12px',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Navigation size={14} style={{ color: '#15803d' }} />
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#15803d' }}>
                    Key Stops
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {route.waypoints.slice(0, 3).map((wp, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        background: 'white',
                        border: '1px solid #86efac',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: '#15803d'
                      }}
                    >
                      {wp.name}
                    </span>
                  ))}
                  {route.waypoints.length > 3 && (
                    <span style={{
                      padding: '4px 8px',
                      background: 'white',
                      border: '1px solid #86efac',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#15803d',
                      fontWeight: '600'
                    }}>
                      +{route.waypoints.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <MapPin size={64} style={{ color: '#d1d5db', margin: '0 auto 20px' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
            No Routes Found
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Routes will appear here once they are added to the system
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;