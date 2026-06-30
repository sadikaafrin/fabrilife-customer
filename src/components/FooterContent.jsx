import { Link } from 'react-router-dom';
import { useState } from 'react';
import useWebInfo from "../data/useWebInfo";
import LOGO from '../../public/logo.png';

function FooterContent() {
    const { webInfo } = useWebInfo();
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setEmail('');
    };

    return (
        <>
            <footer className="fl-footer">
                <div className="fl-footer-top">
                    <div className="fl-footer-grid">
                        {/* Brand column */}
                        <div className="fl-footer-brand">
                            <Link to="/">
                                <img src={LOGO} alt="logo" style={{ height: '38px', width: 'auto', marginBottom: '16px' }} />
                            </Link>
                            <p style={{ fontSize: '13.5px', color: '#aaa', lineHeight: '1.7', maxWidth: '300px', marginBottom: '20px' }}>
                                Because comfort and confidence go hand in hand. Premium fashion delivered to your door.
                            </p>
                            <div className="fl-footer-social">
                                {webInfo?.fb_link && (
                                    <a href={webInfo.fb_link} target="_blank" rel="noopener noreferrer" className="fl-social-link">
                                        <i className="ri-facebook-circle-fill"></i>
                                    </a>
                                )}
                                {webInfo?.insta_link && (
                                    <a href={webInfo.insta_link} target="_blank" rel="noopener noreferrer" className="fl-social-link">
                                        <i className="ri-instagram-line"></i>
                                    </a>
                                )}
                                {webInfo?.yt_link && (
                                    <a href={webInfo.yt_link} target="_blank" rel="noopener noreferrer" className="fl-social-link">
                                        <i className="ri-youtube-line"></i>
                                    </a>
                                )}
                                {webInfo?.twitter_link && (
                                    <a href={webInfo.twitter_link} target="_blank" rel="noopener noreferrer" className="fl-social-link">
                                        <i className="ri-twitter-x-line"></i>
                                    </a>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div style={{ marginTop: '24px', fontSize: '13px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {webInfo?.phone && (
                                    <span><i className="ri-phone-line" style={{ marginRight: '8px' }}></i>{webInfo.phone}</span>
                                )}
                                {webInfo?.email && (
                                    <span><i className="ri-mail-line" style={{ marginRight: '8px' }}></i>{webInfo.email}</span>
                                )}
                                {webInfo?.address && (
                                    <span><i className="ri-map-pin-line" style={{ marginRight: '8px' }}></i>{webInfo.address}</span>
                                )}
                            </div>
                        </div>

                        {/* About column */}
                        <div className="fl-footer-col">
                            <h6 className="fl-footer-heading">Company</h6>
                            <div className="fl-footer-links">
                                <Link to="/about-us">About Us</Link>
                                <Link to="/contact-us">Contact Us</Link>
                                <Link to="/blog">Blog</Link>
                                <Link to="/faq">FAQs</Link>
                            </div>
                        </div>

                        {/* Help column */}
                        <div className="fl-footer-col">
                            <h6 className="fl-footer-heading">Help & Support</h6>
                            <div className="fl-footer-links">
                                <Link to="/order-tracking">Track Order</Link>
                                <Link to="/wishlist">Wishlist</Link>
                                <Link to="/terms-and-conditions">Terms & Conditions</Link>
                                <Link to="/privacy-and-policy">Privacy Policy</Link>
                                <Link to="/shipping-and-delivery">Shipping & Delivery</Link>
                            </div>
                        </div>

                        {/* Newsletter column */}
                        <div className="fl-footer-col">
                            <h6 className="fl-footer-heading">Newsletter</h6>
                            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px', lineHeight: '1.6' }}>
                                Get special discounts & exclusive deals in your inbox.
                            </p>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    required
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        border: '1px solid #333',
                                        borderRight: 'none',
                                        borderRadius: '4px 0 0 4px',
                                        background: '#1a1a1a',
                                        color: '#fff',
                                        fontSize: '13px',
                                        outline: 'none',
                                    }}
                                />
                                <button type="submit" style={{
                                    padding: '10px 16px',
                                    background: '#fff',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '0 4px 4px 0',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    letterSpacing: '0.04em',
                                    whiteSpace: 'nowrap',
                                }}>
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Payment methods */}
                <div className="fl-footer-payments">
                    <div className="fl-footer-payments-inner">
                        <img
                            src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
                            alt="Payment Methods"
                            style={{ maxHeight: '38px', filter: 'brightness(0) invert(0.5)' }}
                        />
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="fl-footer-bottom bg-white">
                    <div className="fl-footer-bottom-inner">
                        <p>© 2025 {webInfo?.name || 'Store'}. All Rights Reserved.</p>
                        <div className="fl-footer-bottom-links">
                            <Link to="/privacy-and-policy">Privacy Policy</Link>
                            <Link to="/terms-and-conditions">Terms & Conditions</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating chat buttons */}
            <div className="fl-floating-icons">
                {webInfo?.wp_api_num && (
                    <a href={`https://wa.me/${webInfo.wp_api_num}`} target="_blank" rel="noopener noreferrer" className="fl-floating-btn fl-whatsapp">
                        <i className="ri-whatsapp-line"></i>
                    </a>
                )}
                {webInfo?.messenger_username && (
                    <a href={`https://m.me/${webInfo.messenger_username}`} target="_blank" rel="noopener noreferrer" className="fl-floating-btn fl-messenger">
                        <i className="ri-messenger-line"></i>
                    </a>
                )}
            </div>

            <style>{`
                .fl-footer {
                    background: #58595B;
                    color: #fff;
                    border-top: 3px solid #000;
                }

                .fl-footer-top {
                    padding: 60px 0 40px;
                }

                .fl-footer-grid {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 40px;
                    display: grid;
                    grid-template-columns: 1.8fr 1fr 1fr 1.4fr;
                    gap: 40px;
                }

                .fl-footer-heading {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #fff;
                    margin-bottom: 20px;
                }

                .fl-footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .fl-footer-links a {
                    font-size: 13.5px;
                    color: #aaa;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .fl-footer-links a:hover { color: #fff; }

                .fl-footer-social {
                    display: flex;
                    gap: 10px;
                }

                .fl-social-link {
                    width: 38px;
                    height: 38px;
                    border-radius: 8px;
                    border: 1px solid #333;
                    background: #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: #aaa;
                    font-size: 18px;
                    transition: all 0.15s;
                }
                .fl-social-link:hover {
                    background: #fff;
                    border-color: #fff;
                    color: #000;
                }

                .fl-footer-payments {
                    border-top: 1px solid #222;
                    border-bottom: 1px solid #222;
                    padding: 20px 0;
                }

                .fl-footer-payments-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 40px;
                }

                .fl-footer-bottom {
                    padding: 20px 0;
                }

                .fl-footer-bottom-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .fl-footer-bottom p {
                    font-size: 12.5px;
                    color: #666;
                    margin: 0;
                }

                .fl-footer-bottom-links {
                    display: flex;
                    gap: 20px;
                }

                .fl-footer-bottom-links a {
                    font-size: 12.5px;
                    color: #666;
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .fl-footer-bottom-links a:hover { color: #aaa; }

                .fl-floating-icons {
                    position: fixed;
                    right: 14px;
                    bottom: 25px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    z-index: 9999;
                }

                .fl-floating-btn {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
                    transition: transform 0.2s;
                }
                .fl-floating-btn:hover { transform: scale(1.1); }
                .fl-whatsapp { background: #25D366; }
                .fl-messenger { background: #0084FF; }

                @media (max-width: 1000px) {
                    .fl-footer-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 36px;
                        padding: 0 24px;
                    }
                    .fl-footer-top { padding: 40px 0 30px; }
                    .fl-footer-bottom-inner { padding: 0 24px; }
                    .fl-footer-payments-inner { padding: 0 24px; }
                }

                @media (max-width: 580px) {
                    .fl-footer-grid {
                        grid-template-columns: 1fr;
                        padding: 0 16px;
                    }
                    .fl-footer-bottom-inner {
                        flex-direction: column;
                        align-items: flex-start;
                        padding: 0 16px;
                        gap: 10px;
                    }
                    .fl-floating-icons { bottom: 80px; }
                }

                @media (max-width: 1150px) {
                    .fl-floating-icons { bottom: 80px; }
                }
            `}</style>
        </>
    );
}

export default FooterContent;
