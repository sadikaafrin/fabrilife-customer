import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useFooterContent from "../data/useFooterContent";

function ShippingDelivery() {

    const { footerContent, loading, error } = useFooterContent();

    // Loading UI
    if (loading) {
        return (
            <>
                <Header />
                <div style={{
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <i className="ri-loader-4-line" style={{
                            fontSize: '48px',
                            color: '#667eea',
                            animation: 'spin 1s linear infinite'
                        }}></i>
                        <p style={{
                            marginTop: '16px',
                            fontSize: '16px',
                            color: '#666'
                        }}>
                            Loading Shipping & Delivery...
                        </p>
                    </div>
                </div>
                <Footer />
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    // Error UI
    if (error) {
        return (
            <>
                <Header />
                <div style={{
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa'
                }}>
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '500px',
                        padding: '40px',
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e0e0e0'
                    }}>
                        <i className="ri-error-warning-line" style={{
                            fontSize: '64px',
                            color: '#dc3545',
                            marginBottom: '16px'
                        }}></i>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            Error Loading Content
                        </h3>
                        <p style={{ fontSize: '15px', color: '#666' }}>
                            {error}
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* HERO SECTION */}
            <div style={{
                background: 'linear-gradient(135deg, #2d2d2dff 0%, #000000ff 100%)',
                padding: '80px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Blurs */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '-80px',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <i className="ri-truck-line" style={{
                            fontSize: '40px',
                            color: '#fff'
                        }}></i>
                    </div>

                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '16px',
                    }}>
                        Shipping & Delivery
                    </h1>

                    <p style={{
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '650px',
                        margin: '0 auto'
                    }}>
                        Please read our shipping and delivery policy carefully before placing an order.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section style={{ padding: '60px 0', background: '#fafafa' }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 20px'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                    }}>
                        <div
                            style={{
                                fontSize: '15px',
                                lineHeight: '1.8',
                                color: '#444'
                            }}
                            dangerouslySetInnerHTML={{ __html: footerContent?.shipping_delivery }}
                        ></div>
                    </div>

                    {/* Quick Links */}
                    <div style={{
                        marginTop: '32px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px'
                    }}>
                        {[
                            { icon: 'ri-shield-check-line', title: 'Privacy Policy', link: '/privacy-and-policy' },
                            { icon: 'ri-file-list-3-line', title: 'Terms & Conditions', link: '/terms-and-conditions' },
                            { icon: 'ri-question-answer-line', title: 'FAQ', link: '/faq' }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '20px',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                                    e.currentTarget.style.borderColor = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                }}
                            >
                                <i className={item.icon} style={{
                                    fontSize: '24px',
                                    color: '#667eea'
                                }}></i>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a'
                                }}>
                                    {item.title}
                                </span>
                                <i className="ri-arrow-right-line" style={{
                                    fontSize: '18px',
                                    color: '#999',
                                    marginLeft: 'auto'
                                }}></i>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* RESPONSIVE FIXES */}
            <style>{`
                @media (max-width: 768px) {
                    h1[style*="font-size: 48px"] {
                        font-size: 36px !important;
                    }
                    div[style*="padding: 40px"] {
                        padding: 24px !important;
                    }
                }
            `}</style>

            <Footer />
        </>
    );
}

export default ShippingDelivery;