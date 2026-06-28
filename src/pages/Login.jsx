import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Login() {
    const [formData, setFormData] = useState({ phone: '01944667441', password: '12345678' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_USER_LOGIN_URL;
            
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                body: new URLSearchParams(formData),
            });

            const result = await response.json();

            if (result.success) {
                // Save user info to localStorage/sessionStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: result.message,
                });
                navigate('/dashboard');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: result.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            {/**************************************************/}
            {/* START MAIN AREA */}
            {/**************************************************/}

            <div style={{ 
                minHeight: '70vh', 
                background: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '480px'
                }}>
                    {/* Hero Section */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(119, 87, 245, 0.3)',
                            display: 'none'
                        }}>
                            <i className="ri-user-line" style={{ fontSize: '32px', color: '#fff' }}></i>
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            Welcome Back
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#666'
                        }}>
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}>
                        <form onSubmit={handleSubmit}>
                            {/* Phone Number Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '8px'
                                }}>
                                    Phone Number
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <i className="ri-phone-line" style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '20px',
                                        color: '#999'
                                    }}></i>
                                    <input
                                        name="phone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 48px',
                                            fontSize: '15px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            background: '#fafafa',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.background = '#fff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e0e0e0';
                                            e.target.style.background = '#fafafa';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '8px'
                                }}>
                                    Password
                                </label>
                                <div style={{
                                    position: 'relative'
                                }}>
                                    <i className="ri-lock-line" style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '20px',
                                        color: '#999'
                                    }}></i>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 48px 14px 48px',
                                            fontSize: '15px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            background: '#fafafa',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#667eea';
                                            e.target.style.background = '#fff';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e0e0e0';
                                            e.target.style.background = '#fafafa';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            color: '#999'
                                        }}
                                    >
                                        <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} style={{ fontSize: '20px' }}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '32px',
                                flexWrap: 'wrap',
                                gap: '12px'
                            }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: '#666',
                                    cursor: 'pointer'
                                }}>
                                    <input 
                                        type="checkbox" 
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" style={{
                                    fontSize: '14px',
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: loading ? '#999' : 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    marginBottom: '24px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <i className="ri-loader-4-line" style={{ 
                                            animation: 'spin 1s linear infinite',
                                            fontSize: '18px'
                                        }}></i>
                                        Logging in...
                                    </span>
                                ) : (
                                    'Login'
                                )}
                            </button>

                            {/* Register Link */}
                            <p style={{
                                textAlign: 'center',
                                fontSize: '15px',
                                color: '#666'
                            }}>
                                Don't have an account?{' '}
                                <Link to="/registration" style={{
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        marginTop: '32px',
                        padding: '24px',
                        background: '#fff',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        {[
                            { icon: 'ri-shield-check-line', text: 'Secure Login' },
                            { icon: 'ri-lock-line', text: 'Encrypted' },
                            { icon: 'ri-customer-service-2-line', text: '24/7 Support' }
                        ].map((badge, idx) => (
                            <div 
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '13px',
                                    color: '#666'
                                }}
                            >
                                <i 
                                    className={badge.icon}
                                    style={{
                                        fontSize: '18px',
                                        color: '#667eea'
                                    }}
                                ></i>
                                <span style={{ fontWeight: '500' }}>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spinner Animation */}
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    @media (max-width: 640px) {
                        div[style*="padding: 40px"] {
                            padding: 24px !important;
                        }
                    }
                `}</style>
            </div>

            {/**************************************************/}
            {/* END MAIN AREA */}
            {/**************************************************/}
            <Footer />
        </>
    );
}

export default Login;