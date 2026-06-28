import { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';

function OrderTracking() {
    const [invoiceNo, setInvoiceNo] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        setOrderData(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("invoice_no", invoiceNo);
        
            const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_ORDER_TRACKING_URL;
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                setOrderData(data.data);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to fetch order data.");
        }

        setLoading(false);
    };

    const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('completed')) {
        return { bg: '#d4edda', text: '#155724', border: '#c3e6cb' };
    }
    if (statusLower.includes('shipped')) {
        return { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb' };
    }
    if (statusLower.includes('pending')) {
        return { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' };
    }
    if (statusLower.includes('processing')) {
        return { bg: '#d1cdffff', text: '#200485ff', border: '#a7aeffff' };
    }
    if (statusLower.includes('canceled')) {
        return { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' };
    }
    
    return { bg: '#e2e3e5', text: '#383d41', border: '#d6d8db' };
};

    const statusColors = orderData ? getStatusColor(orderData.status) : {};

    return ( 
        <>
            <Header />

            {/**************************************************/}
            {/* START MAIN AREA */}
            {/**************************************************/}
            
            <div style={{ minHeight: '100vh', background: '#fafafa' }}>
                <section className="py-5">
                    <div className="container">
                        {/* Hero Section */}
                        <div style={{
                            textAlign: 'center',
                            maxWidth: '700px',
                            margin: '0 auto 50px'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                            }}>
                                <i className="ri-map-pin-line" style={{ fontSize: '36px', color: '#fff' }}></i>
                            </div>
                            <h1 style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Track Your Order
                            </h1>
                            <p style={{
                                fontSize: '16px',
                                color: '#666',
                                lineHeight: '1.6'
                            }}>
                                Enter your invoice number below to get real-time updates on your order status
                            </p>
                        </div>

                        {/* Search Form */}
                        <div style={{
                            maxWidth: '700px',
                            margin: '0 auto 50px'
                        }}>
                            <form onSubmit={handleSearch}>
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    padding: '8px',
                                    display: 'flex',
                                    gap: '8px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{ 
                                        flex: 1,
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="ri-file-list-3-line" style={{
                                            position: 'absolute',
                                            left: '16px',
                                            fontSize: '20px',
                                            color: '#999',
                                            pointerEvents: 'none'
                                        }}></i>
                                        <input 
                                            type="text" 
                                            value={invoiceNo}
                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                            placeholder="Enter your invoice number..." 
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                padding: '16px 16px 16px 48px',
                                                fontSize: '16px',
                                                borderRadius: '12px',
                                                background: 'transparent',
                                                outline: 'none'
                                            }}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{
                                            padding: '16px 32px',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            border: 'none',
                                            background: '#000',
                                            color: '#fff',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.3s ease',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid #fff',
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.6s linear infinite'
                                                }}></span>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-search-line"></i>
                                                Track Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Helper Text */}
                            <div style={{
                                marginTop: '16px',
                                textAlign: 'center',
                                fontSize: '14px',
                                color: '#666'
                            }}>
                                <i className="ri-information-line" style={{ marginRight: '6px' }}></i>
                                You can find your invoice number in your order confirmation email
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                maxWidth: '700px',
                                margin: '0 auto 30px',
                                padding: '16px 20px',
                                background: '#fff',
                                border: '1px solid #f5c6cb',
                                borderRadius: '12px',
                                color: '#721c24',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)'
                            }}>
                                <i className="ri-error-warning-line" style={{ fontSize: '24px', flexShrink: 0 }}></i>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Error</div>
                                    <div style={{ fontSize: '14px' }}>{error}</div>
                                </div>
                            </div>
                        )}

                        {/* Results Section - Single Order with Items */}
                        {orderData ? (
                            <div style={{
                                maxWidth: '1200px',
                                margin: '0 auto'
                            }}>
                                {/* Order Summary Card */}
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e0e0e0',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    marginBottom: '20px'
                                }}>
                                    {/* Order Header */}
                                    <div style={{
                                        padding: '24px',
                                        background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                                        color: '#fff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '16px'
                                    }}>
                                        <div>
                                            <div style={{ 
                                                fontSize: '14px', 
                                                opacity: 0.9,
                                                marginBottom: '6px'
                                            }}>
                                                Invoice Number
                                            </div>
                                            <div style={{ 
                                                fontSize: '24px', 
                                                fontWeight: '700'
                                            }}>
                                                {orderData.invoice_no}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '12px 24px',
                                            borderRadius: '20px',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            background: statusColors.bg,
                                            color: statusColors.text,
                                            border: `1px solid ${statusColors.border}`,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <i className="ri-checkbox-circle-line"></i>
                                            {orderData.status}
                                        </span>
                                    </div>

                                    {/* Order Info Grid */}
                                    <div style={{ padding: '24px' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '16px',
                                            marginBottom: '24px'
                                        }}>
                                            <div style={{
                                                padding: '16px',
                                                background: '#fafafa',
                                                borderRadius: '10px',
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#666',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <i className="ri-calendar-line" style={{ marginRight: '6px' }}></i>
                                                    Order Date
                                                </div>
                                                <div style={{ 
                                                    fontSize: '15px', 
                                                    color: '#1a1a1a',
                                                    fontWeight: '600'
                                                }}>
                                                    {orderData.date}
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '16px',
                                                background: '#fafafa',
                                                borderRadius: '10px',
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#666',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <i className="ri-bank-card-line" style={{ marginRight: '6px' }}></i>
                                                    Payment Method
                                                </div>
                                                <div style={{ 
                                                    fontSize: '15px', 
                                                    color: '#1a1a1a',
                                                    fontWeight: '600'
                                                }}>
                                                    {orderData.paymentMethod}
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '16px',
                                                background: '#fafafa',
                                                borderRadius: '10px',
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#666',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <i className="ri-shopping-bag-line" style={{ marginRight: '6px' }}></i>
                                                    Total Items
                                                </div>
                                                <div style={{ 
                                                    fontSize: '15px', 
                                                    color: '#1a1a1a',
                                                    fontWeight: '600'
                                                }}>
                                                    {orderData.total_ordered_items}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div style={{
                                            padding: '20px',
                                            background: '#fafafa',
                                            borderRadius: '12px',
                                            border: '1px solid #f0f0f0',
                                            marginBottom: '24px'
                                        }}>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                color: '#666',
                                                marginBottom: '12px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase'
                                            }}>
                                                <i className="ri-map-pin-line" style={{ marginRight: '6px' }}></i>
                                                Shipping Address
                                            </div>
                                            <div style={{ 
                                                fontSize: '15px', 
                                                color: '#1a1a1a',
                                                lineHeight: '1.6',
                                                fontWeight: '500'
                                            }}>
                                                {orderData.shippingAddress}
                                            </div>
                                        </div>

                                        {/* Order Note */}
                                        {orderData.order_note && (
                                            <div style={{
                                                padding: '20px',
                                                background: '#fff8e1',
                                                borderRadius: '12px',
                                                border: '1px solid #ffe082',
                                                marginBottom: '24px'
                                            }}>
                                                <div style={{ 
                                                    fontSize: '12px', 
                                                    color: '#f57f17',
                                                    marginBottom: '8px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    <i className="ri-message-3-line" style={{ marginRight: '6px' }}></i>
                                                    Order Note
                                                </div>
                                                <div style={{ 
                                                    fontSize: '14px', 
                                                    color: '#f57f17',
                                                    fontStyle: 'italic'
                                                }}>
                                                    {orderData.order_note}
                                                </div>
                                            </div>
                                        )}

                                        {/* Items List */}
                                        <div style={{
                                            borderTop: '2px solid #e0e0e0',
                                            paddingTop: '24px'
                                        }}>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                marginBottom: '20px'
                                            }}>
                                                <i className="ri-shopping-bag-3-line" style={{ marginRight: '8px' }}></i>
                                                Order Items ({orderData.items.length})
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                {orderData.items.map((item, idx) => (
                                                    <div 
                                                        key={idx}
                                                        style={{
                                                            padding: '20px',
                                                            background: '#fff',
                                                            borderRadius: '12px',
                                                            border: '1px solid #e0e0e0',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: '16px',
                                                            flexWrap: 'wrap'
                                                        }}
                                                    >
                                                        <div style={{ flex: 1, minWidth: '250px' }}>
                                                            <div style={{
                                                                fontSize: '12px',
                                                                color: '#666',
                                                                marginBottom: '6px',
                                                                fontWeight: '600'
                                                            }}>
                                                                Order #{item.order_no}
                                                            </div>
                                                            <div style={{ 
                                                                fontSize: '16px', 
                                                                color: '#1a1a1a',
                                                                fontWeight: '600',
                                                                marginBottom: '8px'
                                                            }}>
                                                                {item.product_title}
                                                            </div>

                                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                <div style={{ fontSize: '14px', color: '#666' }}>
                                                                    Qty: <strong style={{ color: '#1a1a1a' }}>{item.quantity}</strong>
                                                                </div>

                                                                {item.size && item.size !== "Default" && item.size !== "N/A" && item.size !== "" && (
                                                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                                                        Size: <strong style={{ color: '#1a1a1a' }}>{item.size}</strong>
                                                                    </div>
                                                                )}

                                                                {item.color && item.color !== "Default" && item.color !== "N/A" && item.color !== "" && (
                                                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                                                        Color: <strong style={{ color: '#1a1a1a' }}>{item.color}</strong>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            fontSize: '22px',
                                                            fontWeight: '700',
                                                            color: '#1a1a1a',
                                                            textAlign: 'right'
                                                        }}>
                                                            ৳{item.total_price}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div style={{
                                            marginTop: '24px',
                                            padding: '24px',
                                            background: '#fafafa',
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <h3 style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                marginBottom: '16px'
                                            }}>
                                                Price Breakdown
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '15px',
                                                    color: '#666'
                                                }}>
                                                    <span>Subtotal ({orderData.total_ordered_items} items)</span>
                                                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>৳{orderData.total_purchase_amount}</span>
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '15px',
                                                    color: '#666'
                                                }}>
                                                    <span>Shipping Charge</span>
                                                    <span style={{ fontWeight: '600', color: '#1a1a1a' }}>৳{orderData.shippingCharge}</span>
                                                </div>

                                                {parseInt(orderData.discountAmount) > 0 && (
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '15px',
                                                        color: '#28a745'
                                                    }}>
                                                        <span>Discount</span>
                                                        <span style={{ fontWeight: '600' }}>-৳{orderData.discountAmount}</span>
                                                    </div>
                                                )}

                                                <div style={{
                                                    borderTop: '2px solid #e0e0e0',
                                                    paddingTop: '12px',
                                                    marginTop: '8px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontSize: '18px',
                                                    fontWeight: '700',
                                                    color: '#1a1a1a'
                                                }}>
                                                    <span>Total Amount</span>
                                                    <span>৳{orderData.final_amount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            !loading && !error && (
                                <div style={{
                                    maxWidth: '600px',
                                    margin: '60px auto',
                                    textAlign: 'center',
                                    padding: '60px 40px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: '#f5f5f5',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        fontSize: '48px',
                                        color: '#999'
                                    }}>
                                        <i className="ri-search-line"></i>
                                    </div>
                                    <h3 style={{
                                        fontSize: '20px',
                                        fontWeight: '600',
                                        color: '#1a1a1a',
                                        marginBottom: '12px'
                                    }}>
                                        Ready to Track?
                                    </h3>
                                    <p style={{
                                        fontSize: '15px',
                                        color: '#666',
                                        lineHeight: '1.6'
                                    }}>
                                        Enter your invoice number above to track your order and see real-time delivery updates
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </section>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    
                    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');
                `}</style>
            </div>

            {/**************************************************/}
            {/* END MAIN AREA */}
            {/**************************************************/}
            <Footer />
        </>
    );
}

export default OrderTracking;