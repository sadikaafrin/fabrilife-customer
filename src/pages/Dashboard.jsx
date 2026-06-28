import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import useOrders from '../data/useOrders';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    // ============================================
    // START CHANGE PASSWORD STATE & HANDLERS
    // ============================================
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_new_password: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear message when user starts typing
        if (passwordMessage.text) {
            setPasswordMessage({ type: '', text: '' });
        }
    };

    // Handle password update submission
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_new_password) {
            setPasswordMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_new_password) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (passwordData.new_password.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('user_id', user?.id);
            formData.append('current_password', passwordData.current_password);
            formData.append('new_password', passwordData.new_password);
            formData.append('confirm_new_password', passwordData.confirm_new_password);

            const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_USER_PASSWORD_UPDATE_URL;

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setPasswordMessage({ type: 'success', text: data.message });
                // Clear form
                setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_new_password: ''
                });
                
                // Optional: Auto logout after password change
                setTimeout(() => {
                    setPasswordMessage({ type: 'info', text: 'Redirecting to login...' });
                    setTimeout(() => {
                        handleLogout();
                    }, 1500);
                }, 2000);
            } else {
                setPasswordMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
            console.error('Password update error:', error);
        } finally {
            setPasswordLoading(false);
        }
    };
    // ============================================
    // END CHANGE PASSWORD STATE & HANDLERS
    // ============================================

    
    // Initialize useOrders with user?.id (will be null initially)
    const { orders, loading: ordersLoading, error: ordersError } = useOrders(user?.id);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
            case 'Shipped': return { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' };
            case 'Pending': return { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' };
            case 'Processing': return { bg: '#d1cdffff', text: '#200485ff', border: '#a7aeffff' };
            case 'Canceled': return { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' };
            default: return { bg: '#e2e3e5', text: '#383d41', border: '#d6d8db' };
        }
    };

    return (
        <>
            <Header />
            <section className="profile py-3 py-md-5">
                <div className="container">
                    <div className='row'>
                        {/* Left Sidebar */}
                        <div className='col-lg-3 col-md-4'>
                            <div style={{
                                border: '1px solid #e0e0e0',
                                background: '#fff',
                                padding: '24px',
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'sticky',
                                top: '180px'
                            }}>
                                {/* User Profile Section */}
                                <div style={{ 
                                    textAlign: 'center', 
                                    paddingBottom: '24px', 
                                    marginBottom: '24px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '28px',
                                        fontWeight: '600',
                                        margin: '0 auto 16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}>
                                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                    </div>
                                    <p style={{ 
                                        fontWeight: '600', 
                                        fontSize: '18px', 
                                        marginBottom: '4px',
                                        color: '#1a1a1a'
                                    }}>
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p style={{ 
                                        fontSize: '13px', 
                                        color: '#666',
                                        margin: 0
                                    }}>
                                        {user.email}
                                    </p>
                                </div>

                                {/* Navigation Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        { key: 'profile', icon: 'ri-user-line', label: 'Profile' },
                                        { key: 'orders', icon: 'ri-shopping-bag-line', label: 'Purchase History' },
                                        { key: 'security', icon: 'ri-lock-line', label: 'Change Password' }
                                    ].map(tab => (
                                        <button 
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key)}
                                            style={{
                                                padding: '14px 16px',
                                                border: 'none',
                                                background: activeTab === tab.key ? '#000' : 'transparent',
                                                color: activeTab === tab.key ? '#fff' : '#333',
                                                fontWeight: '500',
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s ease',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeTab !== tab.key) {
                                                    e.target.style.background = '#f5f5f5';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (activeTab !== tab.key) {
                                                    e.target.style.background = 'transparent';
                                                }
                                            }}
                                        >
                                            <i className={tab.icon} style={{ fontSize: '18px' }}></i>
                                            {tab.label}
                                        </button>
                                    ))}
                                    
                                    <div style={{ 
                                        height: '1px', 
                                        background: '#f0f0f0', 
                                        margin: '8px 0' 
                                    }}></div>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        style={{
                                            padding: '14px 16px',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#dc3545',
                                            fontWeight: '500',
                                            fontSize: '15px',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#fff5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                        }}
                                    >
                                        <i className="ri-logout-box-line" style={{ fontSize: '18px' }}></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className='col-lg-9 col-md-8'>
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div style={{ 
                                    borderRadius: '16px',
                                    padding: '32px',
                                    background: '#fff',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '32px',
                                        paddingBottom: '20px',
                                        borderBottom: '2px solid #f5f5f5'
                                    }}>
                                        <h2 style={{ 
                                            margin: 0, 
                                            fontWeight: '600', 
                                            fontSize: '24px',
                                            color: '#1a1a1a'
                                        }}>
                                            Personal Information
                                        </h2>
                                        <button 
                                            className="d-none btn btn-dark"
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <i className="ri-edit-box-line"></i>
                                            Edit Profile
                                        </button>
                                    </div>

                                    <div style={{ 
                                        display: 'grid', 
                                        gap: '24px'
                                    }}>
                                        {[
                                            { label: 'First Name', value: user.first_name, icon: 'ri-user-line' },
                                            { label: 'Last Name', value: user.last_name, icon: 'ri-user-line' },
                                            { label: 'Email Address', value: user.email || '-', icon: 'ri-mail-line' },
                                            { label: 'Phone Number', value: user.phone, icon: 'ri-phone-line' },
                                            { label: 'Gender', value: user.gender || '-', icon: 'ri-user-heart-line' }
                                        ].map((field, index) => (
                                            <div 
                                                key={index}
                                                style={{
                                                    padding: '20px',
                                                    background: '#fafafa',
                                                    borderRadius: '12px',
                                                    border: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}
                                            >
                                                <div style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    background: '#fff',
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px',
                                                    color: '#000',
                                                    flexShrink: 0
                                                }}>
                                                    <i className={field.icon}></i>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ 
                                                        fontSize: '13px', 
                                                        color: '#666', 
                                                        marginBottom: '4px',
                                                        fontWeight: '500'
                                                    }}>
                                                        {field.label}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '16px', 
                                                        color: '#1a1a1a',
                                                        fontWeight: '500'
                                                    }}>
                                                        {field.value}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div style={{ 
                                    padding: '32px',
                                    borderRadius: '16px',
                                    background: '#fff',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>

                                    {/* Section Title */}
                                    <h2 style={{ 
                                        marginBottom: '32px', 
                                        fontWeight: '600', 
                                        fontSize: '24px',
                                        color: '#1a1a1a',
                                        paddingBottom: '20px',
                                        borderBottom: '2px solid #f5f5f5'
                                    }}>
                                        Purchase History
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                        {/* Loading State */}
                                        {ordersLoading && (
                                            <>
                                                {[1, 2, 3].map(i => (
                                                    <div key={i}
                                                        style={{
                                                            height: "120px",
                                                            background: "#f3f3f3",
                                                            borderRadius: "12px",
                                                            animation: "pulse 1.4s infinite"
                                                        }}
                                                    ></div>
                                                ))}
                                            </>
                                        )}

                                        {/* Empty State */}
                                        {!ordersLoading && orders.length === 0 && (
                                            <div style={{ textAlign: "center", padding: "50px 0" }}>
                                                <i
                                                    className="ri-file-list-2-line"
                                                    style={{ fontSize: "60px", color: "#b5b5b5", marginBottom: "12px" }}
                                                ></i>
                                                <h4 style={{ fontWeight: 700, fontSize: "18px", color: "#1a1a1a" }}>
                                                    No Orders Yet
                                                </h4>
                                                <p style={{ color: "#777", marginBottom: "16px" }}>
                                                    You haven't purchased anything yet. Start shopping!
                                                </p>
                                                <button className="btn btn-dark" onClick={() => navigate("/shop")}>
                                                    🛍️ Shop Now
                                                </button>
                                            </div>
                                        )}

                                        {/* Order List */}
                                        {!ordersLoading && orders.length > 0 && orders.map((order) => {
                                            const statusColors = getStatusColor(order.status);
                                            const isExpanded = expandedOrder === order.invoice_no;

                                            return (
                                                <div 
                                                    key={order.invoice_no}
                                                    style={{
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        transition: 'all 0.2s ease',
                                                        background: '#fff'
                                                    }}
                                                >
                                                    {/* Order Header */}
                                                    <div 
                                                        style={{
                                                            padding: '20px',
                                                            cursor: 'pointer',
                                                            transition: 'background 0.2s ease'
                                                        }}
                                                        onClick={() => setExpandedOrder(isExpanded ? null : order.invoice_no)}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                                                    >
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between',
                                                            alignItems: 'flex-start',
                                                            gap: '16px',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                                                                <div style={{ 
                                                                    fontWeight: '600', 
                                                                    fontSize: '16px',
                                                                    color: '#1a1a1a',
                                                                    marginBottom: '8px'
                                                                }}>
                                                                    {order.invoice_no}
                                                                </div>
                                                                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                                                    <i className="ri-calendar-line" style={{ marginRight: '6px' }}></i>
                                                                    {order.date}
                                                                </div>
                                                                <div style={{ fontSize: '14px', color: '#333' }}>
                                                                    <i className="ri-shopping-bag-line" style={{ marginRight: '6px' }}></i>
                                                                    {order.total_ordered_items} {order.total_ordered_items === '1' ? 'item' : 'items'}
                                                                </div>
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                                                                        Final Amount
                                                                    </div>
                                                                    <div style={{ fontWeight: '700', fontSize: '20px', color: '#1a1a1a' }}>
                                                                        ৳{order.final_amount}
                                                                    </div>
                                                                </div>

                                                                <span style={{
                                                                    padding: '8px 16px',
                                                                    borderRadius: '20px',
                                                                    fontWeight: '600',
                                                                    fontSize: '13px',
                                                                    background: statusColors.bg,
                                                                    color: statusColors.text,
                                                                    border: `1px solid ${statusColors.border}`,
                                                                    whiteSpace: 'nowrap'
                                                                }}>
                                                                    {order.status}
                                                                </span>

                                                                <i 
                                                                    className={isExpanded ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}
                                                                    style={{ fontSize: '24px', color: '#666', transition: 'transform 0.2s ease' }}
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Body */}
                                                    {isExpanded && (
                                                        <div style={{ padding: '20px', background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
                                                            
                                                            {/* Order Summary */}
                                                            <div style={{ 
                                                                background: '#fff',
                                                                padding: '16px',
                                                                borderRadius: '10px',
                                                                marginBottom: '20px',
                                                                border: '1px solid #e0e0e0'
                                                            }}>
                                                                <div style={{ 
                                                                    fontSize: '14px', 
                                                                    fontWeight: '600',
                                                                    marginBottom: '12px',
                                                                    paddingBottom: '8px',
                                                                    borderBottom: '1px solid #f0f0f0'
                                                                }}>
                                                                    <i className="ri-file-text-line" style={{ marginRight: '6px' }}></i>
                                                                    Order Summary
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ color: '#666' }}>Subtotal:</span>
                                                                        <span style={{ fontWeight: '600' }}>৳{order.total_purchase_amount}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <span style={{ color: '#666' }}>Shipping Charge:</span>
                                                                        <span style={{ fontWeight: '600' }}>৳{order.shippingCharge}</span>
                                                                    </div>
                                                                    {order.discountAmount !== '0' && (
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <span style={{ color: '#666' }}>Discount:</span>
                                                                            <span style={{ fontWeight: '600', color: '#dc3545' }}>-৳{order.discountAmount}</span>
                                                                        </div>
                                                                    )}
                                                                    <div style={{ height: '1px', background: '#e0e0e0' }}></div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                                                                        <span style={{ fontWeight: '600' }}>Total Amount:</span>
                                                                        <span style={{ fontWeight: '700', fontSize: '18px' }}>৳{order.final_amount}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Order Info */}
                                                            <div style={{
                                                                display: 'grid',
                                                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
                                                                gap: '16px',
                                                                marginBottom: '20px'
                                                            }}>
                                                                <div>
                                                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                                                        <i className="ri-bank-card-line" style={{ marginRight: '6px' }}></i>
                                                                        Payment Method
                                                                    </div>
                                                                    <div style={{ fontSize: '15px', fontWeight: '500' }}>
                                                                        {order.paymentMethod}
                                                                    </div>
                                                                </div>

                                                                <div style={{ gridColumn: 'span 2' }}>
                                                                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                                                        <i className="ri-map-pin-line" style={{ marginRight: '6px' }}></i>
                                                                        Shipping Address
                                                                    </div>
                                                                    <div style={{ fontSize: '15px', fontWeight: '500' }}>
                                                                        {order.shippingAddress}
                                                                    </div>
                                                                </div>

                                                                {order.order_note && (
                                                                    <div style={{ gridColumn: 'span 3' }}>
                                                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                                                            <i className="ri-sticky-note-line" style={{ marginRight: '6px' }}></i>
                                                                            Order Note
                                                                        </div>
                                                                        <div style={{ fontSize: '15px', fontWeight: '500' }}>
                                                                            {order.order_note}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Order Items */}
                                                            <div style={{ marginBottom: '16px' }}>
                                                                <div style={{ 
                                                                    fontSize: '14px', 
                                                                    fontWeight: '600',
                                                                    marginBottom: '12px',
                                                                    paddingBottom: '8px',
                                                                    borderBottom: '1px solid #e0e0e0'
                                                                }}>
                                                                    <i className="ri-list-check" style={{ marginRight: '6px' }}></i>
                                                                    Order Items
                                                                </div>

                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx}
                                                                        style={{
                                                                            background: '#fff',
                                                                            padding: '12px',
                                                                            borderRadius: '8px',
                                                                            marginBottom: '8px',
                                                                            border: '1px solid #e8e8e8'
                                                                        }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                                                            <div style={{ flex: 1 }}>
                                                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                                                                                    {item.product_title}
                                                                                </div>
                                                                                <div style={{ fontSize: '13px', color: '#666' }}>
                                                                                    Qty: {item.quantity} • Size: {item.size} • Color: {item.color}
                                                                                </div>
                                                                            </div>

                                                                            <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                                                                ৳{item.total_price}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <button className="d-none btn btn-dark btn-sm">
                                                                <i className="ri-file-list-line" style={{ marginRight: '8px' }}></i>
                                                                View Invoice
                                                            </button>

                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div style={{ 
                                    padding: '32px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <h2 style={{ 
                                        marginBottom: '32px', 
                                        fontWeight: '600', 
                                        fontSize: '24px',
                                        color: '#1a1a1a',
                                        paddingBottom: '20px',
                                        borderBottom: '2px solid #f5f5f5'
                                    }}>
                                        Change Password
                                    </h2>
                                    
                                    <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '500px' }}>
                                        {/* Alert Messages */}
                                        {passwordMessage.text && (
                                            <div style={{
                                                padding: '14px 18px',
                                                borderRadius: '10px',
                                                marginBottom: '24px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                background: passwordMessage.type === 'success' ? '#d4edda' : 
                                                        passwordMessage.type === 'error' ? '#f8d7da' : '#d1ecf1',
                                                color: passwordMessage.type === 'success' ? '#155724' : 
                                                    passwordMessage.type === 'error' ? '#721c24' : '#0c5460',
                                                border: `1px solid ${passwordMessage.type === 'success' ? '#c3e6cb' : 
                                                                    passwordMessage.type === 'error' ? '#f5c6cb' : '#bee5eb'}`
                                            }}>
                                                <i className={
                                                    passwordMessage.type === 'success' ? 'ri-checkbox-circle-line' :
                                                    passwordMessage.type === 'error' ? 'ri-error-warning-line' :
                                                    'ri-information-line'
                                                } style={{ fontSize: '18px' }}></i>
                                                {passwordMessage.text}
                                            </div>
                                        )}

                                        {[
                                            { label: 'Current Password', name: 'current_password', placeholder: 'Enter current password' },
                                            { label: 'New Password', name: 'new_password', placeholder: 'Enter new password' },
                                            { label: 'Confirm New Password', name: 'confirm_new_password', placeholder: 'Confirm new password' }
                                        ].map((field, index) => (
                                            <div key={index} style={{ marginBottom: '24px' }}>
                                                <label style={{ 
                                                    display: 'block', 
                                                    fontWeight: '600', 
                                                    marginBottom: '10px',
                                                    fontSize: '14px',
                                                    color: '#1a1a1a'
                                                }}>
                                                    {field.label}
                                                </label>
                                                <input 
                                                    type="password" 
                                                    name={field.name}
                                                    value={passwordData[field.name]}
                                                    onChange={handlePasswordChange}
                                                    className="form-control"
                                                    placeholder={field.placeholder}
                                                    disabled={passwordLoading}
                                                    style={{ 
                                                        padding: '14px 16px', 
                                                        border: '1px solid #e0e0e0',
                                                        fontSize: '15px',
                                                        borderRadius: '10px',
                                                        transition: 'all 0.2s ease',
                                                        opacity: passwordLoading ? 0.6 : 1
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#000';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#e0e0e0';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        
                                        <div style={{
                                            padding: '16px',
                                            background: '#f8f9fa',
                                            borderRadius: '10px',
                                            marginBottom: '24px',
                                            fontSize: '13px',
                                            color: '#666'
                                        }}>
                                            <i className="ri-information-line" style={{ marginRight: '8px', color: '#000' }}></i>
                                            Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.
                                        </div>
                                        
                                        <button 
                                            type="submit"
                                            className="btn btn-dark"
                                            disabled={passwordLoading}
                                            style={{
                                                padding: '14px 28px',
                                                fontSize: '15px',
                                                fontWeight: '500',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                opacity: passwordLoading ? 0.7 : 1,
                                                cursor: passwordLoading ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <i className="ri-loader-4-line" style={{ animation: 'spin 1s linear infinite' }}></i>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="ri-lock-line"></i>
                                                    Update Password
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* ADD THIS STYLE TAG BEFORE CLOSING YOUR RETURN OR IN YOUR CSS */}
                            <style>{`
                                @keyframes spin {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Dashboard;