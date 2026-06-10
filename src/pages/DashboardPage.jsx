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

  if (loading) return <div style={{ padding: '20px', color: '#64748b' }}>Loading metric summaries...</div>;
  if (error) return <div style={{ color: '#dc2626', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ color: '#7ab600', margin: '0 0 8px 0' }}>Performance Analytics</h1>
      <p style={{ color: '#64748b', margin: '0 0 24px 0' }}>Real-time summary of your assigned customer leads.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Total Leads</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0f172a' }}>{data?.total || 0}</p>
        </div>
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: '14px', textTransform: 'uppercase' }}>Pending Review</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#d97706' }}>{data?.pending || 0}</p>
        </div>
        <div style={{ padding: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#16a34a', fontSize: '14px', textTransform: 'uppercase' }}>Approved Closures</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{data?.approved || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
