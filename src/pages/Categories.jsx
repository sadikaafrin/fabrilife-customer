import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useCategories from '../data/useCategories';
import '../assets/css/categories.css';

function Categories() {
    const { categories } = useCategories();
    const [activeCategory, setActiveCategory] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const icons = [
        'ri-book-line',
        'ri-shopping-bag-line',
        'ri-computer-line',
        'ri-home-line',
        'ri-tools-line',
        'ri-camera-line',
        'ri-cup-line',
        'ri-heart-line'
    ];

    const scrollToCategory = (slug) => {
        const element = document.getElementById(slug);
        if (element) {
            const offset = 120;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveCategory(slug);
        }
    };

    return (
        <>
            <Header />

            <div className="categories-wrapper">
                {/* Hero Section */}
                <div className={`hero-section ${isVisible ? 'visible' : ''}`}>
                    <div className="container">
                        <div className="hero-content">
                            <div className="breadcrumb-nav">
                                <Link to="/" className="breadcrumb-link">Home</Link>
                                <span className="breadcrumb-separator">/</span>
                                <span className="breadcrumb-current">Categories</span>
                            </div>
                            <h1 className="hero-title">Explore Our Collection</h1>
                            <p className="hero-subtitle">
                                Discover products across {categories.length} carefully curated categories
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container main-container">
                    <div className="layout-grid">
                        {/* Sidebar Navigation */}
                        <aside className="sidebar">
                            <div className="sidebar-sticky">
                                <div className="sidebar-header">
                                    <h2 className="sidebar-title">Categories</h2>
                                    <div className="sidebar-divider"></div>
                                </div>
                                
                                <nav className="category-nav">
                                    {categories.map((category, index) => {
                                        const iconClass = icons[index % icons.length];
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => scrollToCategory(category.slug)}
                                                className={`nav-item ${activeCategory === category.slug ? 'active' : ''}`}
                                            >
                                                <div className="nav-item-content">
                                                    {category.img ? (
                                                        <img
                                                            src={category.img}
                                                            className="nav-icon-img"
                                                            alt={category.title}
                                                        />
                                                    ) : (
                                                        <div className="nav-icon-placeholder">
                                                            <i className={iconClass}></i>
                                                        </div>
                                                    )}
                                                    <span className="nav-title">{category.title}</span>
                                                </div>
                                                <i className="ri-arrow-right-s-line nav-arrow"></i>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="content-area">
                            {categories.map((category, index) => {
                                const iconClass = icons[index % icons.length];
                                return (
                                    <section
                                        key={category.id}
                                        id={category.slug}
                                        className="category-section"
                                    >
                                        {/* Category Header */}
                                        <div className="category-header">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="category-header-content">
                                                <div className="category-icon-wrapper">
                                                    {category.img ? (
                                                        <img
                                                            src={category.img}
                                                            className="category-icon-img"
                                                            alt={category.title}
                                                        />
                                                    ) : (
                                                        <div className="category-icon-placeholder">
                                                            <i className={iconClass}></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h2 className="categories-title">{category.title}</h2>
                                                    {category.sub_category && (
                                                        <p className="category-count">
                                                            {category.sub_category.length} {category.sub_category.length === 1 ? 'subcategory' : 'subcategories'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='border px-3 py-2'>
                                                <Link
                                                    to={category.link}
                                                    className="view-all-link"
                                                >
                                                    View All
                                                    <i className="ri-arrow-right-line view-all-icon"></i>
                                                </Link>
                                            </div>
                                            </div>
                                        </div>

                                        {/* Subcategories Grid */}
                                        {category.sub_category && category.sub_category.length > 0 ? (
                                            <div className="subcategories-grid">
                                                {category.sub_category.map((sub, subIndex) => (
                                                    <Link
                                                        key={sub.id}
                                                        to={sub.link}
                                                        className="subcategory-card"
                                                        style={{ animationDelay: `${subIndex * 0.05}s` }}
                                                    >
                                                        <div className="subcategory-content">
                                                            <div className="subcategory-icon">
                                                                <i className="ri-folder-line"></i>
                                                            </div>
                                                            <h3 className="subcategory-title">{sub.title}</h3>
                                                        </div>
                                                        <div className="subcategory-arrow">
                                                            <i className="ri-arrow-right-line"></i>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state">
                                                <i className="ri-inbox-line"></i>
                                                <p>No subcategories available yet</p>
                                            </div>
                                        )}
                                    </section>
                                );
                            })}
                        </main>
                    </div>
                </div>
            </div>

            <Footer />
            
        </>
    );
}

export default Categories;