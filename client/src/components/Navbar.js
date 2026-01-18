import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#2c3e50', // Dark Blue-Grey
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };

    const brandStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#ecf0f1',
        textDecoration: 'none'
    };

    return (
        <nav style={navStyle}>
            <div style={brandStyle}>🚀 NSS Charity</div>
            <div>
                {!user ? (
                    <span style={{ opacity: 0.8 }}>Welcome, Guest</span>
                ) : (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span>👤 {user.name} ({user.role})</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '8px 16px',
                                background: '#e74c3c',
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;