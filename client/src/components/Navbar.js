import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className="navbar">
            {/* Brand Logo */}
            <div className="navbar-brand">
                <div className="navbar-brand-icon">
                    💚
                </div>
                <span>NSS Charity</span>
            </div>

            {/* User Section */}
            <div className="navbar-user">
                {!user ? (
                    <span style={{ opacity: 0.8, fontSize: '0.95rem' }}>
                        Welcome, Guest
                    </span>
                ) : (
                    <>
                        <div className="navbar-user-info">
                            <div className="navbar-avatar">
                                {getInitials(user.name)}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                    {user.name}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    opacity: 0.7,
                                    textTransform: 'capitalize'
                                }}>
                                    {user.role}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn-danger btn-sm"
                            style={{
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                background: 'rgba(239, 68, 68, 0.9)',
                                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;