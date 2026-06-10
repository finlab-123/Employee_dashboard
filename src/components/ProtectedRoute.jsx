import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Verifying security session...</div>;
  }
  if (!user) {
    return <Navigate to="http://localhost:5175" replace />;
  }
  return children;
};

export default ProtectedRoute;
