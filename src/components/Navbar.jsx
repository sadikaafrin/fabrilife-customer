import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import useWebInfo from "../data/useWebInfo";
import LOGO from '../../public/logo.png';
import useProducts from '../data/useProducts';
import useCategories from "../data/useCategories";
import { initGoogleTranslate, switchLanguage } from "../data/googleTranslate";

function Navbar() {
    const navigate = useNavigate();
    const { webInfo } = useWebInfo();
    const { products } = useProducts();
    const { categories } = useCategories();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const navRef = useRef(null);

    // ── Language toggle (Google Translate) ──
    const [lang, setLang] = useState("en");

    useEffect(() => {
        initGoogleTranslate();
    }, []);

    const toggleLanguage = () => {
        const nextLang = lang === "en" ? "bn" : "en";
        switchLanguage(nextLang);
        setLang(nextLang);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length > 0) {
            const filtered = products.filter((p) =>
                p.title?.toLowerCase().includes(value.toLowerCase()) ||
                p.category?.toLowerCase().includes(value.toLowerCase()) ||
                p.product_keyword?.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 8));
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
            setSuggestions([]);
        }
    };

    const openMenuBtn = () => {
        const pages = document.getElementById('pages');
        if (pages) pages.style.left = '0';
    };

    const closeMenuBtn = () => {
        const pages = document.getElementById('pages');
        if (pages) pages.style.left = '-100%';
    };

    const openCartBar = () => {
        const cart = document.querySelector('.cart');
        if (cart) cart.style.right = '0';
    };

    const goToWishlist = () => navigate("/wishlist");
    const goToAccount = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        navigate(user ? "/dashboard" : "/login");
    };

    const dropdownBtn = (id) => {
        const content = document.querySelector(`.content${id}`);
        if (content) {
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const popularSearches = categories.slice(0, 6).map((category) => category.title || '');

    const openMobileSearch = () => setMobileSearchOpen(true);
    const closeMobileSearch = () => setMobileSearchOpen(false);

    const handleMobilePopularSearch = (term) => {
        setSearchTerm(term);
        setSuggestions([]);
        setMobileSearchOpen(false);
        navigate(`/search-results?query=${encodeURIComponent(term)}`);
    };

    return (
        <>
            {/* ── Main Nav ── */}
            <nav id="home" className="fl-nav" ref={navRef}>
                <div className="fl-nav-container">
                    <div className="fl-nav-inner">

                        {/* LEFT: Hamburger + Logo */}
                        <div className="fl-nav-left">
                            <button className="fl-hamburger" onClick={openMenuBtn} aria-label="Open menu">
                                <i className="ri-menu-2-line"></i>
                            </button>
                            <Link to="/" className="fl-logo-link">
                                <img src={LOGO} alt="logo" />
                            </Link>
                        </div>

                        {/* CENTER: Category mega-menu links */}
                        <ul className="fl-nav-links">
                            {categories.slice(0, 3).map((category) => (
                                <li className="fl-nav-item fl-has-mega" key={category.id}>
                                    <Link to={category.link} className="fl-nav-link">
                                        <span className="fl-nav-label">{category.title}</span>
                                    </Link>

                                    {/* Mega dropdown — always rendered, shown on hover via CSS */}
                                    <div className="fl-mega-dropdown">
                                        <div className="fl-mega-inner">

                                            {/* LEFT: subcategories */}
                                            <div className="fl-mega-left">
                                                <p className="fl-mega-cat-title">{category.title}</p>
                                                <div className="fl-mega-subcats">
                                                    {category.sub_category && category.sub_category.map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            to={sub.link}
                                                            className="fl-mega-sublink"
                                                        >
                                                            {sub.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                                <Link
                                                    to={category.link}
                                                    className="fl-mega-view-all"
                                                >
                                                    View All {category.title} <i className="ri-arrow-right-line"></i>
                                                </Link>
                                            </div>

                                            {/* RIGHT: new arrivals products with images */}
                                            <div className="fl-mega-right">
                                                <p className="fl-mega-featured-title">New Arrivals</p>
                                                <div className="fl-mega-products">
                                                    {products
                                                        .filter(p => p.category === category.title || p.category_id === category.id)
                                                        .slice(0, 3)
                                                        .map((product, idx) => (
                                                            <Link
                                                                key={idx}
                                                                to={product.link}
                                                                className="fl-mega-product"
                                                            >
                                                                <img src={product.img} alt={product.title} />
                                                                <div className="fl-mega-product-info">
                                                                    <span className="fl-mega-product-name">{product.title}</span>
                                                                    <span className="fl-mega-product-price">৳ {product.selling_price}</span>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* RIGHT: Search + Icons */}
                        <div className="fl-nav-right">

                            {/* Search bar - Desktop only */}
                            <div className="nav-search-wrap">
                                <form onSubmit={handleSearchSubmit} className="nav-search-form" autoComplete="off">
                                    <i className="ri-search-line nav-search-icon-inline"></i>
                                    <input
                                        id="input-box"
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Search"
                                        autoComplete="off"
                                        className="nav-search-input"
                                    />
                                    {suggestions.length > 0 && (
                                        <div className="search-suggestions">
                                            {suggestions.slice(0, 5).map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={product.link}
                                                    className="suggestion-item"
                                                    onClick={() => setSuggestions([])}
                                                >
                                                    <img src={product.img} alt={product.title} />
                                                    <span className="suggestion-title">{product.title}</span>
                                                    <span className="suggestion-price">৳ {product.selling_price}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Mobile search icon */}
                            <button className="fl-icon-btn fl-mobile-search-toggle" onClick={openMobileSearch} aria-label="Search">
                                <i className="ri-search-line"></i>
                            </button>

                            {/* Wishlist - Mobile top navbar */}
                            <button className="fl-icon-btn fl-mobile-only" onClick={goToWishlist} aria-label="Wishlist">
                                <i className="ri-heart-line"></i>
                                {wishlistCount > 0 && <span className="fl-badge">{wishlistCount}</span>}
                            </button>

                            {/* Language toggle - Mobile top navbar */}
                            <button className="fl-icon-btn fl-mobile-only" onClick={toggleLanguage} aria-label="Translate">
                                <i className="ri-translate-2"></i>
                            </button>

                            {/* Desktop icons */}
                            <Link to="/order-tracking" className="fl-icon-btn fl-icon-labeled fl-desktop-only" aria-label="Track Order">
                                <i className="ri-map-pin-2-line"></i>
                                <span>Track</span>
                            </Link>

                            {/* Language toggle - Desktop */}
                            <button
                                className="fl-icon-btn fl-icon-labeled fl-desktop-only"
                                onClick={toggleLanguage}
                                aria-label="Translate"
                            >
                                <i className="ri-translate-2"></i>
                                <span>{lang === "en" ? "বাং" : "EN"}</span>
                            </button>

                            <button className="fl-icon-btn fl-icon-labeled fl-desktop-only" onClick={goToAccount} aria-label="Account">
                                <i className="ri-user-line"></i>
                                <span>{user ? 'Account' : 'Login'}</span>
                            </button>

                            <button className="fl-icon-btn fl-icon-labeled fl-desktop-only" onClick={goToWishlist} aria-label="Wishlist">
                                <i className="ri-heart-line"></i>
                                <span>Wishlist</span>
                                {wishlistCount > 0 && <span className="fl-badge">{wishlistCount}</span>}
                            </button>

                            <button className="fl-icon-btn fl-icon-labeled fl-cart-btn fl-desktop-only" onClick={openCartBar} aria-label="Cart">
                                <i className="ri-shopping-bag-line"></i>
                                <span>Bag</span>
                                {cartCount > 0 && <span className="fl-badge fl-badge-cart">{cartCount}</span>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {mobileSearchOpen && (
                    <div className="mobile-search-overlay">
                        <div className="mobile-search-top">
                            <button className="mobile-search-close" type="button" onClick={closeMobileSearch} aria-label="Close search">
                                <i className="ri-arrow-left-line"></i>
                            </button>
                            <form className="mobile-search-box" onSubmit={(e) => { handleSearchSubmit(e); closeMobileSearch(); }}>
                                <i className="ri-search-line"></i>
                                <input
                                    id="mobile-search-input"
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search products..."
                                    autoComplete="off"
                                />
                            </form>
                        </div>
                        <div className="mobile-search-popular">
                            <p>Popular Searches</p>
                            <div className="popular-search-tags">
                                {popularSearches.map((term) => (
                                    <button
                                        key={term}
                                        type="button"
                                        className="popular-search-pill"
                                        onClick={() => handleMobilePopularSearch(term)}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Mobile Drawer ── */}
                <div className="pages nav-page" id="pages">
                    <div className="hide-menu">
                        <Link to="/" onClick={closeMenuBtn}>
                            <img style={{ height: '28px', width: 'auto' }} src={LOGO} alt="logo" />
                        </Link>
                        <button
                            onClick={closeMenuBtn}
                            style={{
                                width: '38px', height: '38px', borderRadius: '50%',
                                border: 'none', background: '#f5f5f5',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <i className="ri-close-line" style={{ fontSize: '20px', color: '#555' }}></i>
                        </button>
                    </div>
                    <hr className="mobile-logo-line" style={{ margin: 0, borderColor: '#f0f0f0' }} />

                    {/* Mobile search */}
                 

                    {/* Mobile nav links */}
                    <div className="container-mobilebar">
                        <ul style={{ marginLeft: 0, paddingLeft: 0 }}>
                            <li style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/" onClick={closeMenuBtn}>
                                    <i className="ri-home-line" style={{ marginRight: 8, fontSize: 16 }}></i>Home
                                </Link>
                            </li>
                            <li style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/shop" onClick={closeMenuBtn}>
                                    <i className="ri-store-line" style={{ marginRight: 8, fontSize: 16 }}></i>Shop All
                                </Link>
                            </li>

                            {categories.map((category) => (
                                <li className="mobile-category-list" key={category.id} style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                    <div className="dropdown">
                                        <button className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px', width: '100%' }} onClick={() => dropdownBtn(category.id)}>
                                            <span>{category.title}</span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>
                                        <div className={`content content${category.id}`} style={{ paddingLeft: 0 }}>
                                            {category.sub_category && category.sub_category.map((sub) => (
                                                <Link className="text-uppercase" key={sub.id} to={sub.link} onClick={closeMenuBtn}
                                                    style={{ fontSize: '13px', color: '#555', padding: '8px 12px', display: 'block' }}>
                                                    {sub.title}
                                                </Link>
                                            ))}
                                            <Link to={category.link} onClick={closeMenuBtn}
                                                style={{ fontSize: '12px', fontWeight: 700, color: '#e53935', padding: '8px 12px', display: 'block', textTransform: 'uppercase' }}>
                                                View All {category.title} →
                                            </Link>
                                        </div>
                                    </div>
                                </li>
                            ))}

                            <li style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/blog" onClick={closeMenuBtn}>
                                    <i className="ri-article-line" style={{ marginRight: 8, fontSize: 16 }}></i>Blog
                                </Link>
                            </li>
                            <li style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/about-us" onClick={closeMenuBtn}>
                                    <i className="ri-information-line" style={{ marginRight: 8, fontSize: 16 }}></i>About Us
                                </Link>
                            </li>
                            <li style={{ padding: "11px 0", borderBottom: '1px solid #f5f5f5' }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/contact-us" onClick={closeMenuBtn}>
                                    <i className="ri-customer-service-2-line" style={{ marginRight: 8, fontSize: 16 }}></i>Contact Us
                                </Link>
                            </li>
                            <li style={{ padding: "11px 0" }}>
                                <Link className="nav-text text-uppercase" style={{ fontWeight: 600, fontSize: '14px' }} to="/order-tracking" onClick={closeMenuBtn}>
                                    <i className="ri-map-pin-2-line" style={{ marginRight: 8, fontSize: 16 }}></i>Track Order
                                </Link>
                            </li>
                            <li style={{ padding: "11px 0" }}>
                                <button
                                    className="nav-text text-uppercase"
                                    style={{ fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}
                                    onClick={toggleLanguage}
                                >
                                    <i className="ri-translate-2" style={{ marginRight: 8, fontSize: 16 }}></i>
                                    {lang === "en" ? "বাংলা তে দেখুন" : "View in English"}
                                </button>
                            </li>
                        </ul>

                        <div className="mobile-menu-bottom">
                            <hr style={{ borderColor: '#f0f0f0', margin: '12px 0' }} />
                            <div style={{ background: '#fafafa', borderRadius: 10, padding: '16px', marginBottom: 16 }}>
                                {webInfo?.email && (
                                    <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
                                        <i className="ri-mail-line" style={{ marginRight: 8, color: '#999' }}></i>{webInfo.email}
                                    </p>
                                )}
                                {webInfo?.phone && (
                                    <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
                                        <i className="ri-phone-line" style={{ marginRight: 8, color: '#999' }}></i>{webInfo.phone}
                                    </p>
                                )}
                                {webInfo?.address && (
                                    <p style={{ fontSize: 13, color: '#555', marginBottom: 0 }}>
                                        <i className="ri-map-pin-line" style={{ marginRight: 8, color: '#999' }}></i>{webInfo.address}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: 12, color: '#999', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Follow Us</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 20 }}>
                                    {webInfo?.fb_link && (
                                        <a href={webInfo.fb_link} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                            <i className="ri-facebook-circle-fill" style={{ fontSize: '20px', color: '#1877f2' }}></i>
                                        </a>
                                    )}
                                    {webInfo?.insta_link && (
                                        <a href={webInfo.insta_link} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                            <i className="ri-instagram-line" style={{ fontSize: '20px', color: '#e1306c' }}></i>
                                        </a>
                                    )}
                                    {webInfo?.yt_link && (
                                        <a href={webInfo.yt_link} target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                            <i className="ri-youtube-line" style={{ fontSize: '20px', color: '#ff0000' }}></i>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="mobile-menu-bottom" style={{ borderColor: '#f0f0f0', margin: 0 }} />
                    <div className="container-mobilebar mobile-menu-bottom" style={{ padding: '14px 16px' }}>
                        <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
                            © 2025 {webInfo?.name}. All rights reserved.
                        </p>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;