import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom Modal State for handling rejection reasons gracefully
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    leadId: null,
    targetStatus: '',
    remark: ''
  });

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

  // Centralised function that executes the actual API PATCH network call
  const executeStatusChange = async (id, status, remarkText = '') => {
    try {
      const payload = { status };
      if (remarkText) {
        payload.remark = remarkText;
      }

      const response = await axiosClient.patch(`/employee/leads/${id}/status`, payload);
      if (response.data.success) {
        // 🟢 FIXED: Server returns the updated object with the remarks array inside response.data.data
        const updatedLeadFromServer = response.data.data;

        setLeads(prev => prev.map(lead => 
          lead._id === id 
            ? { 
                ...lead, 
                status: updatedLeadFromServer.status, 
                remarks: updatedLeadFromServer.remarks || lead.remarks 
              } 
            : lead
        ));
      }
    } catch (err) {
      alert('Could not sync status update.');
    }
  };

  // Intercept changes from the HTML select dropdown picker
  const handleStatusSelectChange = (id, newStatus) => {
    if (newStatus === 'Rejected') {
      setRejectionModal({
        isOpen: true,
        leadId: id,
        targetStatus: newStatus,
        remark: ''
      });
    } else {
      executeStatusChange(id, newStatus, '');
    }
  };

  // Submits the rejection custom comment block text payload
  const handleRejectionSubmit = (e) => {
    e.preventDefault();
    const { leadId, targetStatus, remark } = rejectionModal;

    if (!remark || !remark.trim()) {
      alert('A valid rejection reason is required.');
      return;
    }

    executeStatusChange(leadId, targetStatus, remark.trim());
    setRejectionModal({ isOpen: false, leadId: null, targetStatus: '', remark: '' });
  };

  // Helper utility function to style badge indicators elegantly
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { bg: '#e6f4ea', color: '#137333' };
      case 'Rejected':
        return { bg: '#fce8e6', color: '#c5221f' };
      case 'In Progress':
        return { bg: '#e8f0fe', color: '#1a73e8' };
      case 'Ringing':
      case 'call back':
        return { bg: '#fef7e0', color: '#b06000' };
      case 'Documents Verified':
        return { bg: '#f3e8ff', color: '#6b21a8' };
      default:
        return { bg: '#f1f3f4', color: '#3c4043' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Loading CRM Workspace...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '600px', margin: '20px auto', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#dc2626', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <h4 style={{ margin: '0 0 4px 0', fontWeight: '600' }}>System Discrepancy</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header Pipeline Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#0f172a', margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}>Assigned Pipeline</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Track, audit, and dispatch credit leads allocations securely.</p>
        </div>
        <div style={{ background: '#7ab600', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: '500' }}>
          Active Leads: {leads.length}
        </div>
      </div>
      
      {/* Table Data Block */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Applicant Profile</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Product Focus</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Lead Status</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>update lead status</th>
              <th style={{ padding: '16px', color: '#475569', fontWeight: '600' }}>Communication Details</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No consumer loan leads currently assigned to your pipeline pool.</td>
              </tr>
            ) : (
              leads.map(lead => {
                const badgeStyle = getStatusStyle(lead.status);
                
                // 🟢 FIXED: Safely grab the text of the newest entry inside the array
                const latestRemarkText = Array.isArray(lead.remarks) && lead.remarks.length > 0 
                  ? lead.remarks[lead.remarks.length - 1]?.text 
                  : null;

                return (
                  <tr key={lead._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                    
                    {/* Column 1: Profile & Remark Array Parser */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{lead.firstName} {lead.lastName}</div>
                      
                      {/* 🟢 FIXED: Changed conditional expression to parse latestRemarkText variable */}
                      {lead.status === 'Rejected' && latestRemarkText && (
                        <div style={{ 
                          fontSize: '12px', color: '#991b1b', background: '#fef2f2', borderLeft: '3px solid #f87171',
                          padding: '6px 10px', borderRadius: '0 4px 4px 0', marginTop: '8px', maxWidth: '280px', lineHeight: '1.4'
                        }}>
                          <strong>Audit Log:</strong> "{latestRemarkText}"
                        </div>
                      )}
                    </td>
                    
                    {/* Column 2: Product Category */}
                    <td style={{ padding: '16px', color: '#334155', textTransform: 'capitalize', verticalAlign: 'top', paddingTop: '18px' }}>
                      {lead.productCategory?.replace('-', ' ') || lead.product || 'Standard Loan'}
                    </td>
                    
                    {/* Column 3: Status Badge */}
                    <td style={{ padding: '16px', verticalAlign: 'top', paddingTop: '18px' }}>
                      <span style={{ 
                        background: badgeStyle.bg, color: badgeStyle.color, 
                        padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', display: 'inline-block' 
                      }}>
                        {lead.status}
                      </span>
                    </td>
                    
                    {/* Column 4: Dropdown Status Selector */}
                    <td style={{ padding: '16px', verticalAlign: 'top', paddingTop: '14px' }}>
                      <select 
                        value={lead.status} 
                        onChange={(e) => handleStatusSelectChange(lead._id, e.target.value)} 
                        style={{ 
                          padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', 
                          background: '#fff', color: '#334155', fontWeight: '500', cursor: 'pointer', outline: 'none'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ringing">Ringing</option>
                        <option value="call back">Call Back</option>
                        <option value="Documents Verified">Documents Verified</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    
                    {/* Column 5: Communication Info */}
                    <td style={{ padding: '16px', verticalAlign: 'top' }}>
                      <div style={{ color: '#334155', fontWeight: '500' }}>{lead.phone}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{lead.email}</div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- DESIGN OPTIMISED MODAL REJECTION BOX --- */}
      {rejectionModal.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ 
            background: '#fff', padding: '28px', borderRadius: '12px', width: '440px', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#fee2e2', color: '#ef4444', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>⚠️</div>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>File Declinature Audit Reason</h3>
            </div>
            
            <p style={{ margin: '0 0 18px 0', color: '#64748b', fontSize: '13px', lineHeight: '1.5' }}>
              State the structural grounds for rejection. This description will be attached to the user history log securely.
            </p>
            
            <form onSubmit={handleRejectionSubmit}>
              <textarea
                required
                rows="4"
                placeholder="Examples: High debt-to-income metric, insufficient CIBIL score documentation, unverifiable pan profile data..."
                value={rejectionModal.remark}
                onChange={(e) => setRejectionModal({ ...rejectionModal, remark: e.target.value })}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                  fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box', resize: 'none',
                  outline: 'none', color: '#1e293b', lineHeight: '1.5'
                }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setRejectionModal({ isOpen: false, leadId: null, targetStatus: '', remark: '' })}
                  style={{ 
                    padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', 
                    background: '#fff', color: '#475569', cursor: 'pointer', fontSize: '14px', fontWeight: '500' 
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    padding: '8px 16px', borderRadius: '6px', border: 'none', 
                    background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' 
                  }}
                >
                  Confirm Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;