import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axiosClient.get('/employee/leads');
        if (response.data?.success) setLeads(response.data.data || []);
      } catch (err) {
        setError('Failed to pull lead allocations.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const payload = { status };
      if (status === 'Rejected') {
        const remark = window.prompt('Enter rejection reason:');
        if (!remark || !remark.trim()) {
          alert('Rejection reason is required.');
          return;
        }
        payload.remark = remark.trim();
      }
      const response = await axiosClient.patch(`/employee/leads/${id}/status`, payload);
      if (response.data.success) {
        // 🟢 CHANGED: Changed lead.id to lead._id to update state correctly
        setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, status } : lead));
      }
    } catch (err) {
      alert('Could not sync status update.');
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#64748b' }}>Loading workspace...</div>;
  if (error) return <div style={{ color: '#dc2626', padding: '20px' }}>{error}</div>;

  return (
    <div style={{ padding: '10px' }}>
      <h1 style={{ color: '#7ab600', margin: '0 0 20px 0' }}>Assigned Pipeline</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '14px' }}>Name</th>
              <th style={{ padding: '14px' }}>Product</th>
              <th style={{ padding: '14px' }}>Status</th>
              <th style={{ padding: '14px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              // 🟢 CHANGED: Changed key to use lead._id
              <tr key={lead._id} style={{ borderBottom: '1px solid #edf2f7' }}>
                <td style={{ padding: '14px', fontWeight: '500' }}>{lead.firstName} {lead.lastName}</td>
                <td style={{ padding: '14px' }}>{lead.productCategory || lead.product || 'N/A'}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ color: lead.status === 'Approved' ? 'green' : lead.status === 'Rejected' ? 'red' : 'orange', fontWeight: '600' }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '14px' }}>
                  {/* 🟢 CHANGED: Passed lead._id into the change handler update call */}
                  <select value={lead.status} onChange={(e) => updateStatus(lead._id, e.target.value)} style={{ padding: '4px', borderRadius: '4px' }}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPage;