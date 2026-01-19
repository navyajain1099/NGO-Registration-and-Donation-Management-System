import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const { data } = await API.post(endpoint, formData);
            setUser(data);
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || 'Something went wrong'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem'
                    }}>
                        {isLogin ? '👋' : '🌟'}
                    </div>
                    <h2>{isLogin ? 'Welcome Back!' : 'Join Our Community'}</h2>
                    <p>
                        {isLogin
                            ? 'Sign in to continue making a difference'
                            : 'Create an account and start your journey of giving'
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            marginTop: '0.5rem',
                            padding: '1rem',
                            fontSize: '1rem'
                        }}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                {isLogin ? '🔐 Sign In' : '🚀 Create Account'}
                            </>
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <div className="auth-toggle">
                    <span>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                {/* Trust Indicators */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e5e5'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        fontSize: '0.8rem',
                        color: '#737373'
                    }}>
                        <span>🔒 Secure</span>
                        <span>💳 Trusted</span>
                        <span>❤️ Verified NGO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;