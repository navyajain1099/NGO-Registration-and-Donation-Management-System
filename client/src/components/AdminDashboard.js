import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalAmount: 0 });

    useEffect(() => {
        API.get('/admin/stats').then((res) => {
            const data = res.data;
            setDonations(data);

            // 1. Calculate Totals for the Dashboard
            const uniqueUsers = new Set(data.map(d => d.name)).size;
            const totalMoney = data
                .filter(d => d.status === 'Success')
                .reduce((sum, d) => sum + d.amount, 0);

            setStats({ totalUsers: uniqueUsers, totalAmount: totalMoney });
        });
    }, []);

    // 2. CSV Export Feature
    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,User,Amount,Status,Order ID\n";
        donations.forEach(row => {
            csvContent += `${row.name},${row.amount},${row.status},${row.order_id}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "nss_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard</h1>

            {/* New Stats Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ padding: '20px', background: '#eee', borderRadius: '8px' }}>
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div style={{ padding: '20px', background: '#dff0d8', borderRadius: '8px' }}>
                    <h3>Total Raised</h3>
                    <p>₹{stats.totalAmount}</p>
                </div>
                <button onClick={downloadCSV} style={{ padding: '10px 20px', height: 'fit-content', alignSelf: 'center' }}>
                    Download CSV Report
                </button>
            </div>

            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#333', color: '#fff' }}>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Order ID</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((d, index) => (
                        <tr key={index}>
                            <td>{d.name}</td>
                            <td>₹{d.amount}</td>
                            <td style={{ color: d.status === 'Success' ? 'green' : 'red', fontWeight: 'bold' }}>
                                {d.status}
                            </td>
                            <td>{d.order_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;