import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontWeight: 'bold', color: '#7ab600', fontSize: '20px', letterSpacing: '0.5px' }}>
        EMPLOYEE PORTAL
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>Logged in as: {user?.firstName} {user?.lastName}</span>
        <button
          onClick={onLogout}
          style={{ padding: '8px 16px', color:'#ffffff', background: '#dc2727ff', border: '1px solid #000000ff', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
