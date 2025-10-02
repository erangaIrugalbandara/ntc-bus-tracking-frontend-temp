import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    tripNumber: '',
    bus: '',
    route: '',
    direction: 'outbound',
    departureTime: '',
    arrivalTime: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, busesRes, routesRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/trips`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/buses`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/routes`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setTrips(tripsRes.data.data.trips);
      setBuses(busesRes.data.data.buses);
      setRoutes(routesRes.data.data.routes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/admin/trips`,
        {
          ...formData,
          departureTime: new Date(formData.departureTime).toISOString(),
          arrivalTime: new Date(formData.arrivalTime).toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create trip');
    }
  };

  const resetForm = () => {
    setFormData({
      tripNumber: '',
      bus: '',
      route: '',
      direction: 'outbound',
      departureTime: '',
      arrivalTime: '',
      status: 'scheduled'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: {
        icon: Calendar,
        color: '#6b7280',
        bg: '#f3f4f6',
        label: 'Scheduled'
      },
      in_progress: {
        icon: Clock,
        color: '#f59e0b',
        bg: '#fef3c7',
        label: 'In Progress'
      },
      completed: {
        icon: CheckCircle,
        color: '#10b981',
        bg: '#d1fae5',
        label: 'Completed'
      },
      cancelled: {
        icon: XCircle,
        color: '#ef4444',
        bg: '#fee2e2',
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.scheduled;
  };

  const filteredTrips =
    filterStatus === 'all'
      ? trips
      : trips.filter((trip) => trip.status === filterStatus);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
        Loading trips...
      </div>
    );
  }

  return (
    <div>
      {/* Filters + Create Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['all', 'scheduled', 'in_progress', 'completed', 'cancelled'].map(
            (status) => {
              const count =
                status === 'all'
                  ? trips.length
                  : trips.filter((t) => t.status === status).length;

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '8px 16px',
                    background: filterStatus === status ? '#667eea' : 'white',
                    color: filterStatus === status ? 'white' : '#374151',
                    border:
                      filterStatus === status ? 'none' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {status === 'all'
                    ? 'All'
                    : status
                        .replace('_', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                  <span
                    style={{
                      padding: '2px 8px',
                      background:
                        filterStatus === status
                          ? 'rgba(255,255,255,0.2)'
                          : '#f3f4f6',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          Schedule Trip
        </button>
      </div>

      {/* Trip Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        {filteredTrips.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px',
              color: '#6b7280'
            }}
          >
            <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '16px' }}>No trips found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                <th style={{ padding: '16px', textAlign: 'left' }}>Trip Number</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Bus</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Direction</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Departure</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Arrival</th>
                <th style={{ padding: '16px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.map((trip) => {
                const statusConfig = getStatusConfig(trip.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={trip._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>
                      {trip.tripNumber}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600' }}>
                        {trip.bus?.busNumber || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {trip.bus?.serviceType}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: '600' }}>
                        {trip.route?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {trip.route?.origin} → {trip.route?.destination}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          background:
                            trip.direction === 'outbound'
                              ? '#dbeafe'
                              : '#fce7f3',
                          color:
                            trip.direction === 'outbound'
                              ? '#1e40af'
                              : '#9f1239',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}
                      >
                        {trip.direction}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>
                      {new Date(trip.departureTime).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px' }}>
                      {new Date(trip.arrivalTime).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 12px',
                          background: statusConfig.bg,
                          borderRadius: '8px'
                        }}
                      >
                        <StatusIcon size={16} style={{ color: statusConfig.color }} />
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: statusConfig.color
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <h2 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: 'bold' }}>
              Schedule New Trip
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Trip Number */}
              <div style={{ marginBottom: '20px' }}>
                <label>Trip Number</label>
                <input
                  type="text"
                  value={formData.tripNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, tripNumber: e.target.value })
                  }
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                />
              </div>

              {/* Bus + Route */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Bus</label>
                  <select
                    value={formData.bus}
                    onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                  >
                    <option value="">Select Bus</option>
                    {buses
                      .filter((b) => b.status === 'active')
                      .map((bus) => (
                        <option key={bus._id} value={bus._id}>
                          {bus.busNumber} - {bus.serviceType} ({bus.operator})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label>Route</label>
                  <select
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                  >
                    <option value="">Select Route</option>
                    {routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direction */}
              <div style={{ margin: '20px 0' }}>
                <label>Direction</label>
                <select
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                >
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                </select>
              </div>

              {/* Departure + Arrival */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Departure Time</label>
                  <input
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={(e) =>
                      setFormData({ ...formData, departureTime: e.target.value })
                    }
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label>Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={(e) =>
                      setFormData({ ...formData, arrivalTime: e.target.value })
                    }
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  Schedule Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;
