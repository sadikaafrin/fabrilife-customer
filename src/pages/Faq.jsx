import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useFooterContent from "../data/useFooterContent";

function Faq() {
    const { footerContent, loading, error } = useFooterContent();

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
                    <div style={{
                        textAlign: 'center'
                    }}>
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
                            Loading FAQ...
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
                            Error Loading FAQ
                        </h3>
                        <p style={{
                            fontSize: '15px',
                            color: '#666'
                        }}>
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

            {/**************************************************/}
            {/* START MAIN AREA */}
            {/**************************************************/}

            {/* HERO AREA */}
            <div style={{
                background: 'linear-gradient(135deg, #2d2d2dff 0%, #000000ff 100%)',
                padding: '80px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Elements */}
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
                        <i className="ri-question-answer-line" style={{
                            fontSize: '40px',
                            color: '#fff'
                        }}></i>
                    </div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '16px',
                        textShadow: '0 2px 20px rgba(0,0,0,0.1)'
                    }}>
                        FAQ
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Frequently Asked Questions
                    </p>
                </div>
            </div>

            {/* CONTENT AREA */}
            <section style={{
                padding: '60px 0',
                background: '#fafafa'
            }}>
                <div className="container" style={{
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
                        {/* Info Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)',
                            padding: '20px 24px',
                            borderRadius: '12px',
                            marginBottom: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            border: '1px solid #d0e0ff'
                        }}>
                            <i className="ri-information-line" style={{
                                fontSize: '28px',
                                color: '#667eea',
                                flexShrink: 0
                            }}></i>
                            <div>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '4px'
                                }}>
                                    Have a Question?
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#666',
                                    margin: 0
                                }}>
                                    Find answers to the most commonly asked questions below. Can't find what you're looking for? Contact our support team.
                                </p>
                            </div>
                        </div>

                        {/* FAQ Content */}
                        <div 
                            style={{
                                fontSize: '15px',
                                lineHeight: '1.8',
                                color: '#444'
                            }}
                            dangerouslySetInnerHTML={{ __html: footerContent?.faq }}
                        >
                        </div>

                        {/* Contact Support */}
                        <div style={{
                            marginTop: '40px',
                            padding: '24px',
                            background: '#f9fafb',
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #e0e0e0'
                        }}>
                            <i className="ri-customer-service-2-line" style={{
                                fontSize: '32px',
                                color: '#667eea',
                                marginBottom: '12px'
                            }}></i>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                marginBottom: '8px'
                            }}>
                                Still Need Help?
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '20px'
                            }}>
                                Our support team is here to assist you
                            </p>
                            <Link 
                                to="/contact-us" 
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 28px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="ri-mail-line"></i>
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={{
                        marginTop: '32px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px'
                    }}>
                        {[
                            { icon: 'ri-file-list-3-line', title: 'Terms & Conditions', link: '/terms-and-conditions' },
                            { icon: 'ri-shield-check-line', title: 'Privacy Policy', link: '/privacy-and-policy' },
                            { icon: 'ri-arrow-go-back-line', title: 'Shipping & Delivery', link: '/shipping-and-delivery' }
                        ].map((item, idx) => (
                            <Link
                                key={idx}
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
                                <i 
                                    className={item.icon}
                                    style={{
                                        fontSize: '24px',
                                        color: '#667eea'
                                    }}
                                ></i>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a'
                                }}>
                                    {item.title}
                                </span>
                                <i 
                                    className="ri-arrow-right-line"
                                    style={{
                                        fontSize: '18px',
                                        color: '#999',
                                        marginLeft: 'auto'
                                    }}
                                ></i>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    div[style*="padding: 40px"] {
                        padding: 24px !important;
                    }
                    h1[style*="font-size: 48px"] {
                        font-size: 36px !important;
                    }
                }
            `}</style>

            {/**************************************************/}
            {/* END MAIN AREA */}
            {/**************************************************/}

            <Footer />
        </>
    );
}

export default Faq;