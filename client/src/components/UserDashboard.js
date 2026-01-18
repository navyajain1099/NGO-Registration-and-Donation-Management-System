import React, { useState } from 'react';
import API from '../api';

const UserDashboard = ({ user }) => {
    const [amount, setAmount] = useState('');

    const handleDonate = async () => {
        // 1. Create Order
        const { data: order } = await API.post('/create-order', { amount, user_id: user.id });

        // 2. Open Razorpay
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Paste Key Here Too
            amount: order.amount,
            currency: "INR",
            name: "NSS Donation",
            order_id: order.id,
            handler: async function (response) {
                // 3. Verify
                const verifyData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                };
                const res = await API.post('/verify-payment', verifyData);
                alert(res.data.status === 'success' ? 'Donation Successful!' : 'Failed');
            },
            prefill: { name: user.name, email: user.email }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome, {user.name}</h1>
            <h3>Make a Donation</h3>
            <input type="number" placeholder="Enter Amount" onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleDonate}>Donate Now</button>
        </div>
    );
};

export default UserDashboard;