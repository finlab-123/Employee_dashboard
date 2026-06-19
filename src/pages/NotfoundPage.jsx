import React from 'react';

const NotFoundPage = () => {
    const handleBackToLogin = () => {
        window.location.replace("http://localhost:5175");
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: '24px',
            color: '#0f172a'
        }}>
            <div style={{
                fontSize: '120px',
                fontWeight: '800',
                lineHeight: '1',
                color: '#cbd5e1',
                marginBottom: '16px',
                letterSpacing: '-0.05em'
            }}>
                404
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
                You can't access this Dashboard.
            </h2>

            <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '420px', margin: '0 0 32px 0', lineHeight: '1.6' }}>
                You need to Login as the Employee To Access this Dashboard.
            </p>

            <button
                onClick={handleBackToLogin}
                style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease-in-out',
                    outline: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}
            >
                Return to Login
            </button>
        </div>
    );
};

export default NotFoundPage;