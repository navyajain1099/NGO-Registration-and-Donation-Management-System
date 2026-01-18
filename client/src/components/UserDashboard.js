import React, { useState, useEffect } from 'react';
import API from '../api';

const UserDashboard = ({ user }) => {
    const [amount, setAmount] = useState('');
    const [myDonations, setMyDonations] = useState([]);
    const [activeTab, setActiveTab] = useState('donate'); // 'donate' or 'history'

    // Load History on Boot
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

        // 1. Create Order
        const { data: order } = await API.post('/create-order', { amount, user_id: user.id });

        // 2. Open Razorpay
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            name: "NSS Charity",
            description: "Donation for a cause",
            order_id: order.id,
            handler: async function (response) {
                // 3. Verify
                const verifyData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                };
                try {
                    const res = await API.post('/verify-payment', verifyData);
                    if (res.data.status === 'success') {
                        alert('Donation Successful! Thank you.');
                        setAmount(''); // Clear input
                        fetchHistory(); // Refresh the list instantly
                        setActiveTab('history'); // Switch to history view
                    }
                } catch (err) {
                    alert('Payment Verification Failed');
                }
            },
            prefill: { name: user.name, email: user.email },
            theme: { color: "#3399cc" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header / Profile Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
                <div>
                    <h1>Hello, {user.name} 👋</h1>
                    <p style={{ color: '#666' }}>{user.email} | ID: {user.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h3>Total Donated</h3>
                    <p style={{ fontSize: '1.5rem', color: 'green', fontWeight: 'bold' }}>
                        ₹{myDonations.filter(d => d.status === 'Success').reduce((sum, d) => sum + d.amount, 0)}
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('donate')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: activeTab === 'donate' ? '#333' : '#eee',
                        color: activeTab === 'donate' ? '#fff' : '#333',
                        border: 'none', borderRadius: '5px', cursor: 'pointer'
                    }}
                >
                    ❤️ Make a Donation
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        background: activeTab === 'history' ? '#333' : '#eee',
                        color: activeTab === 'history' ? '#fff' : '#333',
                        border: 'none', borderRadius: '5px', cursor: 'pointer'
                    }}
                >
                    📜 Donation History
                </button>
            </div>

            {/* CONTENT AREA */}
            {activeTab === 'donate' ? (
                <div style={{ textAlign: 'center', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
                    <h3>Support Our Cause</h3>
                    <p>Your contribution helps us make a difference.</p>
                    <div style={{ marginTop: '1rem' }}>
                        <input
                            type="number"
                            placeholder="Enter Amount (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{ padding: '10px', fontSize: '1.2rem', width: '200px', marginRight: '10px' }}
                        />
                        <button
                            onClick={handleDonate}
                            style={{ padding: '12px 24px', fontSize: '1.2rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Donate Now
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Date</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Order ID</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #dee2e6' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myDonations.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No donations yet.</td></tr>
                            ) : (
                                myDonations.map((d) => (
                                    <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{new Date(d.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{d.order_id}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>₹{d.amount}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                                                background: d.status === 'Success' ? '#d4edda' : '#f8d7da',
                                                color: d.status === 'Success' ? '#155724' : '#721c24'
                                            }}>
                                                {d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;