import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersRes = await API.get('/admin/users');
            const donationsRes = await API.get('/admin/donations');
            setUsers(usersRes.data);
            setDonations(donationsRes.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        }
    };

    const totalRaised = donations
        .filter(d => d.status === 'Success')
        .reduce((sum, d) => sum + d.amount, 0);

    const successfulDonations = donations.filter(d => d.status === 'Success').length;

    return (
        <div className="container">
            {/* Admin Header */}
            <div className="admin-header">
                <h1>Admin Control Center</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'linear-gradient(135deg, #475569, #334155)',
                        fontSize: '0.9rem'
                    }}
                >
                    👤 Switch to My Donor Profile
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-box">
                    <div className="stat-title">Total Registered Users</div>
                    <div className="stat-value">{users.length}</div>
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#737373'
                    }}>
                        👥 Active members in the community
                    </div>
                </div>
                <div className="stat-box green">
                    <div className="stat-title">Total Funds Collected</div>
                    <div className="stat-value">₹{totalRaised.toLocaleString()}</div>
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.85rem',
                        color: '#737373'
                    }}>
                        💚 From {successfulDonations} successful donations
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="card">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 User Registry
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('donations')}
                    >
                        💰 Donation Records
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'users' ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email Address</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={{
                                        fontWeight: 600,
                                        color: '#0d9488',
                                        fontFamily: 'monospace'
                                    }}>
                                        #{u.id}
                                    </td>
                                    <td>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem'
                                        }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                background: u.role === 'admin'
                                                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                                                    : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.85rem'
                                            }}>
                                                {u.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                                            </div>
                                            <strong>{u.name}</strong>
                                        </div>
                                    </td>
                                    <td style={{ color: '#525252' }}>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                            {u.role === 'admin' ? '⚡ ' : '👤 '}
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Donor</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: '#737373'
                                    }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                        No donations recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                donations.map(d => (
                                    <tr key={d.id}>
                                        <td style={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.85rem',
                                            color: '#525252'
                                        }}>
                                            {d.order_id}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{d.name}</div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: '#a3a3a3',
                                                marginTop: '2px'
                                            }}>
                                                {d.email}
                                            </div>
                                        </td>
                                        <td style={{
                                            fontWeight: 700,
                                            color: '#0f766e',
                                            fontSize: '1.05rem'
                                        }}>
                                            ₹{d.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge ${d.status === 'Success' ? 'badge-success' : 'badge-pending'}`}>
                                                {d.status === 'Success' ? '✓ ' : '⏳ '}
                                                {d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;