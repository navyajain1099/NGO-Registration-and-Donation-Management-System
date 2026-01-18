import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    return (
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <h2>NSS Open Project</h2>
            <div>
                {!user ? (
                    <span>Login Required</span>
                ) : (
                    <>
                        <span style={{ marginRight: '10px' }}>Hi, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;