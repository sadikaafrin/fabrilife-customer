import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useFooterContent from "../data/useFooterContent";
import useTestimonials from '../data/useTestimonials';
import useBrands from '../data/useBrands';

function AboutUs() {
    const { footerContent, loading: footerLoading, error: footerError } = useFooterContent();
    const { testimonials: reviews, loading: testimonialsLoading, error: testimonialsError } = useTestimonials();
    const { brands, loading: brandsLoading, error: brandsError } = useBrands();
    
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const brandScrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || !reviews || reviews.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, reviews.length]);

    const scrollReviews = (direction) => {
        if (!reviews || reviews.length === 0) return;
        
        if (direction === 'left') {
            setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
        } else {
            setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
        }
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000);
    };

    const scrollBrands = (direction) => {
        if (brandScrollRef.current) {
            const scrollAmount = 200;
            brandScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getVisibleReviews = () => {
        if (!reviews || reviews.length === 0) return [];
        
        const visible = [];
        const visibleCount = Math.min(5, reviews.length);
        for (let i = 0; i < visibleCount; i++) {
            visible.push(reviews[(currentReviewIndex + i) % reviews.length]);
        }
        return visible;
    };

    // Show loading state while ANY data is loading
    if (footerLoading || testimonialsLoading || brandsLoading) {
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

    // Show error state if any data failed to load
    if (footerError || testimonialsError || brandsError) {
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
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '18px', color: '#e53e3e', marginBottom: '10px' }}>Error loading data</p>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            {footerError || testimonialsError || brandsError}
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            style={{
                                marginTop: '20px',
                                padding: '10px 24px',
                                background: '#667eea',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
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
                        maxWidth: '900px',
                        margin: '0 auto 80px'
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
                            <i className="ri-information-line" style={{ fontSize: '30px', color: '#fff' }}></i>
                        </div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '24px'
                        }}>
                            About Us
                        </h1>
                        <div 
                            style={{
                                fontSize: '17px',
                                lineHeight: '1.8',
                                color: '#666',
                                padding: '32px',
                                background: '#fff',
                                borderRadius: '16px',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                            dangerouslySetInnerHTML={{ __html: footerContent?.about_us || 'No content available' }}
                        />
                    </div>

                    {/* Stats Section */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '24px',
                        maxWidth: '1000px',
                        margin: '0 auto 80px'
                    }}>
                        {[
                            { number: '10+', label: 'Years Experience', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102, 126, 234, 0.3)' },
                            { number: '50K+', label: 'Happy Customers', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(245, 87, 108, 0.3)' },
                            { number: '100+', label: 'Products', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79, 172, 254, 0.3)' }
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 32px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = `0 12px 32px ${stat.shadow}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                }}
                            >
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: '700',
                                    background: stat.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    marginBottom: '12px'
                                }}>
                                    {stat.number}
                                </div>
                                <div style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#666'
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Customer Reviews Section */}
                    {reviews && reviews.length > 0 && (
                        <div style={{ marginBottom: '80px' }}>
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
                                    What Our Customers Say
                                </h2>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#666'
                                }}>
                                    Don't just take our word for it
                                </p>
                            </div>

                            <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
                                {/* Left Arrow */}
                                <button
                                    onClick={() => scrollReviews('left')}
                                    style={{
                                        position: 'absolute',
                                        left: '-20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    <ChevronLeft style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </button>

                                {/* Reviews Container */}
                                <div
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '24px',
                                        padding: '8px 0',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {getVisibleReviews().map((review, idx) => (
                                        <div
                                            key={`${review.id}-${idx}`}
                                            style={{
                                                background: '#fff',
                                                borderRadius: '16px',
                                                padding: '32px',
                                                border: '1px solid #e0e0e0',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                transition: 'all 0.3s ease',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: '380px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                            }}
                                        >
                                            <Quote style={{
                                                width: '32px',
                                                height: '32px',
                                                color: '#e0e0e0',
                                                marginBottom: '16px'
                                            }} />
                                            
                                            <p style={{
                                                fontSize: '15px',
                                                lineHeight: '1.7',
                                                color: '#333',
                                                marginBottom: '20px',
                                                flex: 1
                                            }}>
                                                {review.text}
                                            </p>

                                            <div style={{
                                                display: 'flex',
                                                gap: '4px',
                                                marginBottom: '20px'
                                            }}>
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            fill: '#FFD700',
                                                            color: '#FFD700'
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                paddingTop: '20px',
                                                borderTop: '1px solid #f0f0f0'
                                            }}>
                                                <img
                                                    src={review.image}
                                                    alt={review.name}
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: '2px solid #f0f0f0'
                                                    }}
                                                />
                                                <div>
                                                    <div style={{
                                                        fontSize: '15px',
                                                        fontWeight: '600',
                                                        color: '#1a1a1a',
                                                        marginBottom: '2px'
                                                    }}>
                                                        {review.name}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#666'
                                                    }}>
                                                        {review.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Right Arrow */}
                                <button
                                    onClick={() => scrollReviews('right')}
                                    style={{
                                        position: 'absolute',
                                        right: '-20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                                    }}
                                >
                                    <ChevronRight style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </button>

                                {/* Dots Indicator */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginTop: '32px'
                                }}>
                                    {reviews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setCurrentReviewIndex(index);
                                                setIsPaused(true);
                                                setTimeout(() => setIsPaused(false), 10000);
                                            }}
                                            style={{
                                                width: index === currentReviewIndex ? '32px' : '8px',
                                                height: '8px',
                                                background: index === currentReviewIndex 
                                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                    : '#d0d0d0',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            {/* Responsive CSS */}
                            <style>{`
                                @media (max-width: 1400px) {
                                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                                        grid-template-columns: repeat(4, 1fr) !important;
                                    }
                                }
                                @media (max-width: 1100px) {
                                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                                        grid-template-columns: repeat(3, 1fr) !important;
                                    }
                                }
                                @media (max-width: 768px) {
                                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                                        grid-template-columns: repeat(2, 1fr) !important;
                                    }
                                }
                                @media (max-width: 500px) {
                                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                                        grid-template-columns: repeat(1, 1fr) !important;
                                    }
                                }
                            `}</style>
                        </div>
                    )}

                    {/* Trusted Brands Section */}
                    {brands && brands.length > 0 && (
                        <div>
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
                                    Trusted By Leading Brands
                                </h2>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#666'
                                }}>
                                    Partnering with the best in the industry
                                </p>
                            </div>

                            <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
                                {/* Left Arrow */}
                                <button
                                    onClick={() => scrollBrands('left')}
                                    style={{
                                        position: 'absolute',
                                        left: '-20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        boxShadow: '0 4px 16px rgba(79, 172, 254, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 172, 254, 0.4)';
                                    }}
                                >
                                    <ChevronLeft style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </button>

                                {/* Brands Container */}
                                <div
                                    ref={brandScrollRef}
                                    style={{
                                        display: 'flex',
                                        gap: '32px',
                                        overflowX: 'auto',
                                        scrollBehavior: 'smooth',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        padding: '24px 0'
                                    }}
                                >
                                    {brands.map((brand, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                minWidth: '160px',
                                                height: '120px',
                                                background: '#fff',
                                                borderRadius: '12px',
                                                border: '1px solid #e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '24px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 172, 254, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                            }}
                                        >
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '60px',
                                                    objectFit: 'contain',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.filter = 'grayscale(0%)';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Right Arrow */}
                                <button
                                    onClick={() => scrollBrands('right')}
                                    style={{
                                        position: 'absolute',
                                        right: '-20px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '48px',
                                        height: '48px',
                                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        boxShadow: '0 4px 16px rgba(79, 172, 254, 0.4)',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(79, 172, 254, 0.4)';
                                    }}
                                >
                                    <ChevronRight style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </button>
                            </div>

                            <style>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

export default AboutUs;