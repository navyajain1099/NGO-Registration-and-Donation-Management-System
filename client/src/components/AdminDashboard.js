import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminDashboard = () => {
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        API.get('/admin/stats').then((res) => setDonations(res.data));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr><th>User</th><th>Amount</th><th>Status</th><th>Order ID</th></tr>
                </thead>
                <tbody>
                    {donations.map((d) => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>{d.amount}</td>
                            <td style={{ color: d.status === 'Success' ? 'green' : 'red' }}>{d.status}</td>
                            <td>{d.order_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;