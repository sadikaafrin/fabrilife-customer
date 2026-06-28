import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useWebInfo from "../data/useWebInfo";

function ContactUs() {
    const { webInfo, loading, error } = useWebInfo();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [msgBox, setMsgBox] = useState({
        show: false,
        message: '',
        success: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_CONTACT_SUBMIT_URL;
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            setMsgBox({
                show: true,
                message: data.message,
                success: data.success
            });
            
            if (data.success) {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            }
            
            setTimeout(() => {
                setMsgBox(prev => ({ ...prev, show: false }));
            }, 5000);
            
        } catch (err) {
            setMsgBox({
                show: true,
                message: 'An error occurred. Please try again.',
                success: false
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToWhatsApp = (phone) => {
        window.location.href = `https://api.whatsapp.com/send?phone=${phone}&text=I%20want%20to%20know%20about%20your%20products?`;
    };

    const callBDNumber = (phone) => {
        window.location.href = `tel:+880${phone}`;
    };

    const goToMessenger = (username) => {
        window.location.href = `https://m.me/${username}`;
    };

    const contactInfo = {
        phone: webInfo?.phone || '',
        email: webInfo?.email || '',
        address: webInfo?.address || '',
        facebook: webInfo?.fb_link || '',
        messenger: webInfo?.messenger_username || '',
        whatsapp: webInfo?.wp_api_num || '',
        mapUrl: webInfo?.location || ''
    };

    const contactCards = [
        {
            icon: 'ri-phone-line',
            title: 'Phone',
            description: 'Call us anytime',
            value: contactInfo.phone,
            action: () => callBDNumber(contactInfo.phone),
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: '#f5576c'
        },
        {
            icon: 'ri-mail-line',
            title: 'Email',
            description: 'Send us a message',
            value: contactInfo.email,
            action: () => window.location.href = `mailto:${contactInfo.email}`,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: '#4facfe'
        },
        {
            icon: 'ri-map-pin-line',
            title: 'Location',
            description: 'Visit our office',
            value: contactInfo.address,
            action: null,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#667eea'
        },
        {
            icon: 'ri-facebook-fill',
            title: 'Facebook',
            description: 'Follow us on Facebook',
            value: 'Visit Our Page',
            action: () => window.open(contactInfo.facebook, '_blank'),
            gradient: 'linear-gradient(135deg, #1877f2 0%, #0c5fbf 100%)',
            color: '#1877f2'
        },
        {
            icon: 'ri-messenger-line',
            title: 'Messenger',
            description: 'Chat with us instantly',
            value: 'Send Message',
            action: () => goToMessenger(contactInfo.messenger),
            gradient: 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
            color: '#00b2ff'
        },
        {
            icon: 'ri-whatsapp-line',
            title: 'WhatsApp',
            description: 'Message us on WhatsApp',
            value: 'Start Chat',
            action: () => goToWhatsApp(contactInfo.whatsapp),
            gradient: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
            color: '#25d366'
        }
    ];

    if (loading) {
        return (
            <>
                <Header />
                <div style={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="spinner-border" style={{ width: '3rem', height: '3rem', color: '#667eea' }} role="status"></div>
                        <p style={{ marginTop: '20px', fontSize: '16px', color: '#666' }}>Loading...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <section style={{ padding: '30px 0', background: '#fafafa', minHeight: '70vh' }}>
                <div className="container">
                    {/* Hero Section */}
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto 30px'
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                        }}>
                            <i className="ri-customer-service-2-line" style={{ fontSize: '30px', color: '#fff' }}></i>
                        </div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '16px'
                        }}>
                            Get In Touch
                        </h1>
                        <p style={{
                            fontSize: '17px',
                            color: '#666',
                            lineHeight: '1.6'
                        }}>
                            We'd love to hear from you. Contact us anytime and we'll get back to you as soon as possible
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                        maxWidth: '1200px',
                        margin: '0 auto 80px'
                    }}>
                        {contactCards.map((card, index) => (
                            <div
                                key={index}
                                onClick={card.action}
                                style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    transition: 'all 0.3s ease',
                                    cursor: card.action ? 'pointer' : 'default',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = `0 12px 32px ${card.color}33`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: card.gradient,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: `0 4px 16px ${card.color}40`
                                }}>
                                    <i className={card.icon} style={{ fontSize: '28px', color: '#fff' }}></i>
                                </div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    marginBottom: '8px'
                                }}>
                                    {card.title}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#999',
                                    marginBottom: '16px'
                                }}>
                                    {card.description}
                                </p>
                                <p style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: card.color,
                                    margin: 0,
                                    wordBreak: 'break-word'
                                }}>
                                    {card.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto 80px'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '48px'
                        }}>
                            <h2 style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Send Us a Message
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#666'
                            }}>
                                Fill out the form below and we'll respond within 24 hours
                            </p>
                        </div>

                        {/* Success/Error Message */}
                        {msgBox.show && (
                            <div style={{
                                padding: '16px 24px',
                                background: msgBox.success ? '#d4edda' : '#f8d7da',
                                border: `1px solid ${msgBox.success ? '#c3e6cb' : '#f5c6cb'}`,
                                borderRadius: '12px',
                                marginBottom: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <i 
                                    className={msgBox.success ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'} 
                                    style={{ 
                                        fontSize: '24px', 
                                        color: msgBox.success ? '#155724' : '#721c24' 
                                    }}
                                ></i>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: msgBox.success ? '#155724' : '#721c24'
                                    }}>
                                        {msgBox.message}
                                    </div>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '3px',
                                    background: msgBox.success ? '#28a745' : '#dc3545',
                                    animation: 'progressBar 5s linear',
                                    width: '100%'
                                }}></div>
                            </div>
                        )}

                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '40px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                        }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gap: '24px' }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '24px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a',
                                                marginBottom: '8px'
                                            }}>
                                                Full Name <span style={{ color: '#f5576c' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '10px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#667eea';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a',
                                                marginBottom: '8px'
                                            }}>
                                                Email Address <span style={{ color: '#f5576c' }}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '10px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#667eea';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '24px'
                                    }}>
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a',
                                                marginBottom: '8px'
                                            }}>
                                                Phone Number <span style={{ color: '#f5576c' }}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '10px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#667eea';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: '#1a1a1a',
                                                marginBottom: '8px'
                                            }}>
                                                Subject <span style={{ color: '#f5576c' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '10px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#667eea';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#1a1a1a',
                                            marginBottom: '8px'
                                        }}>
                                            Message <span style={{ color: '#f5576c' }}>*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '10px',
                                                fontSize: '15px',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#667eea';
                                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e0e0e0';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            padding: '16px 40px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            margin: '0 auto',
                                            opacity: isSubmitting ? 0.7 : 1
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-send-plane-fill"></i>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div style={{ maxWidth: '1000px', margin: '0 auto 80px' }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Find Us Here
                            </h2>
                            <p style={{
                                fontSize: '16px',
                                color: '#666'
                            }}>
                                Visit our office or drop by anytime
                            </p>
                        </div>

                        <div style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                            height: '450px'
                        }}>
                            <iframe
                                src={contactInfo.mapUrl}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 0
                                }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Location Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Additional Info */}
                    {webInfo?.contact_us && (
                        <div style={{
                            maxWidth: '900px',
                            margin: '0 auto',
                            padding: '40px',
                            background: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                            <div 
                                style={{
                                    fontSize: '15px',
                                    lineHeight: '1.8',
                                    color: '#666'
                                }}
                                dangerouslySetInnerHTML={{ __html: webInfo.contact_us }} 
                            />
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                @keyframes progressBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </>
    );
}

export default ContactUs;