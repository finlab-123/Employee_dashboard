import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import NotfoundPage from './pages/NotfoundPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvalidRole, setIsInvalidRole] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosClient.get('/auth/me');
        if (response.data?.success) {
          const fetchedUser = response.data.data;
          
          // If authenticated but role isn't an employee, flag it to show 404
          if (fetchedUser && fetchedUser.role !== 'employee') {
            setIsInvalidRole(true);
            setUser(null);
          } else {
            setUser(fetchedUser);
          }
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
        <h3 style={{ fontWeight: '500' }}>Verifying pipeline token keys...</h3>
      </div>
    );
  }

  if (isInvalidRole) {
    return <NotfoundPage />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f1f5f9' }}>
        {user && <Navbar user={user} onLogout={() => setUser(null)} />}
        <div style={{ display: 'flex', flex: 1 }}>
          {user && <Sidebar />}
          <main style={{ flex: 1, padding: '30px', boxSizing: 'border-box' }}>
            <Routes>
              {/* Default Redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected Workspace Layout Endpoints */}
              <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><DashboardPage /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute user={user} loading={loading}><LeadsPage /></ProtectedRoute>} />
              
              {/* Catch-all Wildcard Route for completely dead links matches 404 */}
              <Route path="*" element={<NotfoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;