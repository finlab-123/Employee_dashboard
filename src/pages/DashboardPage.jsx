import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axiosClient.get('/employee/dashboard');
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        setError('Failed to fetch lead pipeline metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '20px', color: '#64748b' }}>Loading leads Workspace...</div>;
  if (error) return <div style={{ color: '#dc2626', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ color: '#7ab600', margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700' }}>Performance Analytics</h1>
      <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Real-time summary of your assigned customer leads.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {/* Total Leads Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Total Leads</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{data?.total || 0}</p>
        </div>

        {/* Pending Review Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Pending Review</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{data?.pending || 0}</p>
        </div>

        {/* In Progress Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#2563eb', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>In Progress</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{data?.inProgress || 0}</p>
        </div>

        {/* Ringing Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#b06000', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Ringing</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#b06000' }}>{data?.ringing || 0}</p>
        </div>

        {/* Call Back Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#b06000', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Call Back</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#b06000' }}>{data?.callback || 0}</p>
        </div>

        {/* Documents Verified Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#6b21a8', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Documents Verified</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#6b21a8' }}>{data?.documentsVerified || 0}</p>
        </div>

        {/* Approved Closures Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#16a34a', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Approved Closures</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{data?.approved || 0}</p>
        </div>

        {/* Rejected Files Card */}
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#dc2626', fontSize: '14px', textTransform: 'uppercase', fontWeight: '600' }}>Rejected / Dropped</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{data?.rejected || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;