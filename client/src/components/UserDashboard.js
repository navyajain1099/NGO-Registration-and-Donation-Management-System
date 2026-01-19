import React, { useState, useEffect } from 'react';
import API from '../api';

const UserDashboard = ({ user }) => {
    const [amount, setAmount] = useState('');
    const [myDonations, setMyDonations] = useState([]);
    const [activeTab, setActiveTab] = useState('donate');

    useEffect(() => {
        if (user && user.id) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const { data } = await API.get(`/my-donations/${user.id}`);
            setMyDonations(data);
        } catch (err) {
            console.error("Failed to load history");
        }
    };

    const handleDonate = async () => {
        if (!amount) return alert("Please enter an amount");

        const { data: order } = await API.post('/create-order', { amount, user_id: user.id });

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "NSS Charity",
            description: "Donation for a cause",
            order_id: order.id,
            handler: async function (response) {
                const verifyData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                };
                try {
                    const res = await API.post('/verify-payment', verifyData);
                    if (res.data.status === 'success') {
                        alert('Donation Successful! Thank you.');
                        setAmount('');
                        fetchHistory();
                        setActiveTab('history');
                    }
                } catch (err) {
                    alert('Payment Verification Failed');
                }
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: "#0d9488" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const totalDonated = myDonations
        .filter(d => d.status === 'Success')
        .reduce((sum, d) => sum + d.amount, 0);

    const presetAmounts = [100, 500, 1000, 5000];

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="dashboard-greeting">
                    <h1>Hello, {user.name}! 👋</h1>
                    <p>Thank you for being a part of our mission to make a difference.</p>
                </div>
                <div className="dashboard-stats">
                    <h4>Total Contributions</h4>
                    <div className="amount">₹{totalDonated.toLocaleString()}</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="dashboard-tabs">
                <button
                    className={`dashboard-tab ${activeTab === 'donate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donate')}
                >
                    ❤️ Make a Donation
                </button>
                <button
                    className={`dashboard-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📜 Donation History
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'donate' ? (
                <div className="donation-section">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💚</div>
                    <h3>Support Our Cause</h3>
                    <p>Your contribution helps us bring hope and change to those in need.</p>

                    {/* Preset Amounts */}
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        {presetAmounts.map(preset => (
                            <button
                                key={preset}
                                onClick={() => setAmount(preset.toString())}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: amount === preset.toString()
                                        ? 'linear-gradient(135deg, #0d9488, #14b8a6)'
                                        : '#f5f5f5',
                                    color: amount === preset.toString() ? 'white' : '#404040',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: amount === preset.toString()
                                        ? '0 4px 15px rgba(20, 184, 166, 0.4)'
                                        : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ₹{preset.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <div className="donation-input-group">
                        <input
                            type="number"
                            placeholder="Enter custom amount (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{
                                maxWidth: '280px',
                                fontSize: '1.1rem'
                            }}
                        />
                        <button
                            onClick={handleDonate}
                            className="donate-btn"
                        >
                            🎁 Donate Now
                        </button>
                    </div>

                    {/* Impact Message */}
                    {amount && parseInt(amount) > 0 && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem 1.5rem',
                            background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                            borderRadius: '12px',
                            display: 'inline-block'
                        }}>
                            <span style={{ color: '#0f766e', fontWeight: 500 }}>
                                ✨ Your ₹{parseInt(amount).toLocaleString()} can provide meals for {Math.floor(parseInt(amount) / 50)} people!
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="history-section">
                    {myDonations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <h4>No donations yet</h4>
                            <p>Start your giving journey today!</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Order ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myDonations.map((d) => (
                                    <tr key={d.id}>
                                        <td>{new Date(d.date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {d.order_id}
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#0f766e' }}>
                                            ₹{d.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge ${d.status === 'Success' ? 'badge-success' : 'badge-pending'}`}>
                                                {d.status === 'Success' ? '✓ ' : '⏳ '}{d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;