import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosClient from './api/axiosClient';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosClient.get('/auth/me');
        if (response.data?.success) setUser(response.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f1f5f9' }}>
        {user && <Navbar user={user} onLogout={() => setUser(null)} />}
        <div style={{ display: 'flex', flex: 1 }}>
          {user && <Sidebar />}
          <main style={{ flex: 1, padding: '30px', boxSizing: 'border-box' }}>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><DashboardPage /></ProtectedRoute>} />
              <Route path="/leads" element={<ProtectedRoute user={user} loading={loading}><LeadsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>

  );
}

export default App;
