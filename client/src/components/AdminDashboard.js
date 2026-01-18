import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'donations'

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

    // Calculate Stats
    const totalRaised = donations
        .filter(d => d.status === 'Success')
        .reduce((sum, d) => sum + d.amount, 0);

    return (
        <div className="container">
            <h1 style={{ marginBottom: '30px' }}>Admin Control Center</h1>

            {/* 1. TOP STATS ROW */}
            <div className="stats-grid">
                <div className="stat-box">
                    <div className="stat-title">Total Registered Users</div>
                    <div className="stat-value">{users.length}</div>
                </div>
                <div className="stat-box green">
                    <div className="stat-title">Total Funds Collected</div>
                    <div className="stat-value">₹{totalRaised.toLocaleString()}</div>
                </div>
            </div>

            {/* 2. TABS */}
            <div className="card">
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

                {/* 3. DYNAMIC CONTENT */}
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
                                    <td>#{u.id}</td>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
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
                                <th>Donor Name</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(d => (
                                <tr key={d.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{d.order_id}</td>
                                    <td>{d.name} <br /><small style={{ color: '#999' }}>{d.email}</small></td>
                                    <td style={{ fontWeight: 'bold' }}>₹{d.amount}</td>
                                    <td>
                                        <span className={`badge ${d.status === 'Success' ? 'badge-success' : 'badge-pending'}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;