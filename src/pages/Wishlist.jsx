import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import useSizes from '../data/useSizes';
import SizeModal from "../components/SizeModal";
import Swal from "sweetalert2";
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { sizes } = useSizes();
    const [loading, setLoading] = useState(true);

    // State for modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Transform wishlist items to match expected format
    const transformedWishlist = wishlist.map(item => ({
        ...item,
        title: item.name || item.title,
        img: item.image || item.img,
        selling_price: item.price || item.selling_price,
        link: item.link || `/product/${item.id}`,
        category: item.category || '',
        regular_price: item.regular_price || item.price,
        avilable_stock: item.avilable_stock || 1,
        product_slug: item.product_slug || item.id
    }));

    const handleAddToCart = (product) => {
        if (Number(product.avilable_stock) === 0) {
            Swal.fire({
                icon: "error",
                title: "Out of Stock",
                text: "This product is currently out of stock.",
            });
            return;
        }

        // Get sizes for product
        const productSizes = sizes.find((s) => s.product_slug === product.product_slug)?.sizes || [];

        if (productSizes.length > 0) {
            setSelectedProduct(product);
            setModalOpen(true);
        } else {
            addToCart({ ...product, size: null, quantity: 1 });
        }
    };

    const handleSizeSelect = (sizeLabel) => {
        addToCart({ ...selectedProduct, size: sizeLabel, quantity: 1 });
        setSelectedProduct(null);
        setModalOpen(false);
    };

    const handleRemoveFromWishlist = (product) => {
        removeFromWishlist(product.id, product.size);
    };

    const handleGoToProduct = (link) => {
        navigate(link);
    };

    return (
        <>
            <Header />

            <section style={{ 
                padding: '30px 0 60px', 
                background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
                minHeight: '70vh' 
            }}>
                <div className="container">
                    {/* Header Section */}
                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto 30px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                            borderRadius: '20px',
                            marginBottom: '24px',
                            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.25)'
                        }}>
                            <i className="ri-heart-3-fill" style={{ 
                                fontSize: '28px', 
                                color: '#fff' 
                            }}></i>
                        </div>
                        
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px',
                            letterSpacing: '-0.5px'
                        }}>
                            My Wishlist
                        </h1>
                        
                        <p style={{
                            fontSize: '16px',
                            color: '#666',
                            margin: 0
                        }}>
                            {wishlist.length === 0 
                                ? 'Start saving your favorite items' 
                                : `${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} saved`
                            }
                        </p>
                    </div>

                    {/* Empty State */}
                    {wishlist.length === 0 ? (
                        <div style={{
                            maxWidth: '600px',
                            textAlign: 'center',
                            margin: '20px auto',
                            padding: '60px 40px',
                            background: 'rgb(255, 255, 255)',
                            borderRadius: '16px',
                            border: '1px solid rgb(224, 224, 224'
                        }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                background: 'linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 32px',
                                border: '3px solid #fff',
                                boxShadow: '0 8px 24px rgba(255, 107, 107, 0.15)'
                            }}>
                                <i className="ri-heart-line" style={{
                                    fontSize: '52px',
                                    color: '#ff6b6b'
                                }}></i>
                            </div>
                            
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Your wishlist is empty
                            </h2>
                            
                            <p style={{
                                fontSize: '15px',
                                color: '#666',
                                marginBottom: '40px',
                                lineHeight: '1.6'
                            }}>
                                Explore our collection and save your favorite items to your wishlist for easy access later.
                            </p>
                            
                            <Link 
                                to="/shop"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '16px 40px',
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 107, 0.3)';
                                }}
                            >
                                <i className="ri-shopping-bag-3-line"></i>
                                Explore Products
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid-container mens-fashion-products" style={{
                                paddingBottom: '40px'
                            }}>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, idx) => (
                                        <div key={idx} style={{ padding: 8 }}>
                                            <Skeleton
                                                variant="rectangular"
                                                width="100%"
                                                height={220}
                                                sx={{ borderRadius: 2, bgcolor: "grey.300" }}
                                                animation="wave"
                                            />
                                            <Skeleton
                                                variant="text"
                                                width="80%"
                                                sx={{ margin: "12px 0", bgcolor: "grey.200" }}
                                                animation="wave"
                                            />
                                            <Skeleton
                                                variant="text"
                                                width="60%"
                                                sx={{ margin: "8px 0", bgcolor: "grey.200" }}
                                                animation="wave"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    transformedWishlist.map((product, index) => (
                                        <WishlistProductCard
                                            key={index}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                            onRemove={handleRemoveFromWishlist}
                                            onGoToProduct={handleGoToProduct}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Bottom Action Bar */}
                            {!loading && (
                                <div style={{
                                    maxWidth: '100%',
                                    padding: '32px',
                                    background: '#fff',
                                    borderRadius: '16px',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '24px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ flex: '1', minWidth: '250px' }}>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#1a1a1a',
                                            marginBottom: '6px'
                                        }}>
                                            Ready to checkout?
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            margin: 0
                                        }}>
                                            Review your cart or continue shopping
                                        </p>
                                    </div>
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <Link 
                                            to="/view-cart"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '12px 28px',
                                                background: '#1a1a1a',
                                                color: '#fff',
                                                borderRadius: '10px',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease',
                                                border: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#333';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#1a1a1a';
                                            }}
                                        >
                                            <i className="ri-shopping-cart-line"></i>
                                            View Cart
                                        </Link>

                                        <Link 
                                            to="/shop"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '12px 28px',
                                                background: '#fff',
                                                color: '#1a1a1a',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '10px',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f9fafb';
                                                e.currentTarget.style.borderColor = '#d1d5db';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                            }}
                                        >
                                            <i className="ri-store-2-line"></i>
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />

            {/* Size Modal */}
            <SizeModal
                product={selectedProduct}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSizeSelect={handleSizeSelect}
            />

            <style>{`
                @media (max-width: 768px) {
                    h1 {
                        font-size: 28px !important;
                    }
                    
                    div[style*="flexWrap"] {
                        justify-content: center !important;
                    }
                }
                
                @media (max-width: 500px) {
                    section {
                        padding: 30px 0 10px !important;
                    }
                }

                .wishlist-remove-btn {
                    transition: all 0.2s ease;
                }
                
                .wishlist-remove-btn:hover {
                    color: #ff4d6d !important;
                    transform: scale(1.1);
                }
            `}</style>
        </>
    );
}

// Custom Wishlist Product Card Component
function WishlistProductCard({ product, onAddToCart, onRemove, onGoToProduct }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="card" style={{ position: 'relative' }}>
            {/* Remove from Wishlist Button */}
            <button
                onClick={() => onRemove(product)}
                style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease'
                }}
                className="wishlist-remove-btn"
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ff4d6d';
                    e.currentTarget.querySelector('i').style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.querySelector('i').style.color = '#ff4d6d';
                }}
            >
                <i 
                    className="ri-heart-fill"
                    style={{
                        fontSize: '18px',
                        color: '#ff4d6d',
                        transition: 'color 0.2s ease'
                    }}
                ></i>
            </button>

            <div style={{ position: "relative", width: "100%"}}>
                {!imgLoaded && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={220}
                        sx={{ position: "absolute", top: 0, left: 0, borderRadius: 2, bgcolor: "grey.300" }}
                        animation="wave"
                    />
                )}
                <img
                    onClick={() => onGoToProduct(product.link)}
                    src={product.img}
                    className="card-img-top"
                    alt={product.title}
                    style={imgLoaded ? { cursor: 'pointer' } : { visibility: "hidden", cursor: 'pointer' }}
                    onLoad={() => setImgLoaded(true)}
                />
            </div>

            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h6
                        style={{
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                        }}
                        onClick={() => onGoToProduct(product.link)}
                    >
                        {product.title}
                    </h6>
                </div>

                <p
                    onClick={() => onGoToProduct(product.link)}
                    style={{ cursor: "pointer" }}
                >
                    {product.category}
                </p>

                <div className="price-inf d-flex justify-content-between price-row">
                    <h6
                        style={{ fontWeight: 800, fontSize: "1.05rem", cursor: "pointer" }}
                        onClick={() => onGoToProduct(product.link)}
                    >
                        ৳ {product.selling_price}
                    </h6>
                    <h6
                        style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: ".9rem", cursor: "pointer" }}
                        className="price-old"
                        onClick={() => onGoToProduct(product.link)}
                    >
                        ৳ {product.regular_price}
                    </h6>
                </div>

                <div className="d-flex gap-1 pt-1">
                    <button
                        className="btn btn-dark add-to-cart-btn py-2 mb-0"
                        onClick={() => onAddToCart(product)}
                        disabled={Number(product.avilable_stock) === 0}
                    >
                        <span className="cart-buy-text">Add to Cart </span>
                    </button>
                    
                    <button
                        className="btn btn-dark add-to-cart-btn py-2 mb-0"
                        onClick={() => onGoToProduct(product.link)}
                        style={{backgroundColor: "#4e4e4eff"}}
                        disabled={Number(product.avilable_stock) === 0}
                    >
                        <span className="cart-buy-text">Buy Now </span>
                    </button>
                </div>
            </div>

            <style>{`
                @media (min-width: 601px) and (max-width: 790px) {
                    .container {
                        padding-left: 10px !important;
                        padding-right: 10px !important;
                    }
                }

                @media only screen and (max-width: 500px) {
                    .card-body .btn span {
                        font-weight: 400 !important;
                    }
                }

                @media only screen and (max-width: 780px) {
                    .card-body {
                        padding: 10px !important;
                    }
                }
                
                .cart-buy-text {
                    font-size: 13px;
                }

                @media (min-width: 1001px) and (max-width: 1024px) {
                    .cart-buy-text {
                        font-size: 12px;
                    }
                }
                
                @media (min-width: 701px) and (max-width: 724px) {
                    .cart-buy-text {
                        font-size: 12px;
                    }
                }

                @media (min-width: 601px) and (max-width: 630px) {
                    .cart-buy-text {
                        font-size: 12px;
                    }
                }

                @media only screen and (max-width: 393px) {
                    .cart-buy-text {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Wishlist;