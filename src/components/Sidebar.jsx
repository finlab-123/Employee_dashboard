import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={{ width: '240px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24px 16px', minHeight: 'calc(100vh - 70px)', boxSizing: 'border-box' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => ({
            padding: '12px 16px', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px',
            background: isActive ? '#e2e8f0' : 'transparent',
            color: isActive ? '#0f172a' : '#475569'
          })}
        >
          📊 Dashboard Analytics
        </NavLink>
        <NavLink 
          to="/leads" 
          style={({ isActive }) => ({
            padding: '12px 16px', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px',
            background: isActive ? '#e2e8f0' : 'transparent',
            color: isActive ? '#0f172a' : '#475569'
          })}
        >
          💼 My Assigned Leads
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
