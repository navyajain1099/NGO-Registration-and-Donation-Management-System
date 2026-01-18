import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const { data } = await API.post(endpoint, formData);
            setUser(data);
            // Redirect based on role
            navigate(data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input type="text" placeholder="Name" required
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                )} <br />
                <input type="email" placeholder="Email" required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                /> <br />
                <input type="password" placeholder="Password" required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                /> <br /><br />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button style={{ marginTop: '10px' }} onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? 'Register' : 'Login'}
            </button>
        </div>
    );
};

export default Auth;