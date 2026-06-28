import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from "../CartContext";
import useProducts from '../data/useProducts';
import useSizes from '../data/useSizes';
import useColors from '../data/useColors';

// Add the same normalizeColorName function from Cartbar
function normalizeColorName(c) {
  if (!c) return null;
  if (typeof c === "string") return String(c).trim();
  return String(c.name || c.label || c.color || "").trim();
}

function ViewCart() {
    const {
        carts,
        totalPrice,
        shippingCharge,
        finalPrice,
        removeCart,
        incrementQuantity,
        decrementQuantity,
        updateCartItemSize,
        updateCartItemColor,
    } = useCart();

    // Fetch product data to get sizes and colors
    const { products } = useProducts();
    const { sizes } = useSizes();
    const { colors } = useColors();

    // State to track which item is showing color options
    const [showColorOptions, setShowColorOptions] = useState(null);

    // Helper functions to get color info
    const getColorDisplay = (item) => {
        const colorName = item.colorObj?.name || item.colorName || item.color;
        if (!colorName) return null;
        return String(colorName).charAt(0).toUpperCase() + String(colorName).slice(1);
    };

    const getColorHex = (item) => {
        return item.colorObj?.hex || item.colorHex || null;
    };

    // Get available sizes for a product - try multiple sources
    const getAvailableSizes = (item) => {
        // 1. Check if sizes are stored in the cart item
        if (item.availableSizes && Array.isArray(item.availableSizes) && item.availableSizes.length > 0) {
            return item.availableSizes;
        }
        if (item.sizes && Array.isArray(item.sizes) && item.sizes.length > 0) {
            return item.sizes;
        }
        if (item.productSizes && Array.isArray(item.productSizes) && item.productSizes.length > 0) {
            return item.productSizes;
        }

        // 2. Try to get sizes from the global sizes data using product slug
        const productSlug = item.product_slug || item.slug;
        if (productSlug) {
            const sizeData = sizes.find(s => s.product_slug === productSlug);
            if (sizeData && sizeData.sizes && sizeData.sizes.length > 0) {
                return sizeData.sizes;
            }
        }

        // 3. Try to get sizes from the product data by ID
        const productData = products.find(p => String(p.id) === String(item.id));
        if (productData) {
            if (productData.sizes && Array.isArray(productData.sizes) && productData.sizes.length > 0) {
                return productData.sizes;
            }
            if (productData.size_label) {
                return [{ label: productData.size_label }];
            }
        }

        // 4. FALLBACK: If no sizes found but product has a size, return it as an array
        if (item.size) {
            return [item.size];
        }

        return [];
    };

    // Get available colors for a product - try multiple sources
    const getAvailableColors = (item) => {
        // 1. Check if colors are stored in the cart item
        if (item.availableColors && Array.isArray(item.availableColors) && item.availableColors.length > 0) {
            return item.availableColors;
        }
        if (item.colors && Array.isArray(item.colors) && item.colors.length > 0) {
            return item.colors;
        }
        if (item.productColors && Array.isArray(item.productColors) && item.productColors.length > 0) {
            return item.productColors;
        }

        // 2. Try to get colors from the global colors data using product slug
        const productSlug = item.product_slug || item.slug;
        if (productSlug) {
            const colorData = colors.find(c => c.product_slug === productSlug);
            if (colorData && colorData.colors && colorData.colors.length > 0) {
                return colorData.colors;
            }
        }

        // 3. Try to get colors from the product data by ID
        const productData = products.find(p => String(p.id) === String(item.id));
        if (productData) {
            if (productData.colors && Array.isArray(productData.colors) && productData.colors.length > 0) {
                return productData.colors;
            }
            if (productData.color) {
                return [{ label: productData.color, hex: productData.color_hex || null }];
            }
        }

        // 4. FALLBACK: If no colors found but product has a color, return it as an array
        const colorName = item.colorObj?.name || item.colorName || item.color;
        if (colorName) {
            return [{ 
                label: colorName, 
                name: colorName,
                hex: item.colorObj?.hex || item.colorHex || null 
            }];
        }

        return [];
    };

    // Toggle color options
    const toggleColorOptions = (itemId, size, color) => {
        const key = `${itemId}-${size}-${color}`;
        setShowColorOptions(showColorOptions === key ? null : key);
    };

    // Handle size selection
    const handleSizeSelect = (item, selectedSize) => {
        const normalizedColor = normalizeColorName(item.colorObj?.name || item.colorName || item.color);
        updateCartItemSize(item.id, item.size, normalizedColor, selectedSize);
    };

    // Handle color selection
    const handleColorSelect = (item, selectedColor) => {
        const normalizedColor = normalizeColorName(item.colorObj?.name || item.colorName || item.color);
        updateCartItemColor(item.id, item.size, normalizedColor, selectedColor);
        setShowColorOptions(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showColorOptions && !e.target.closest('.color-selector-wrapper')) {
                setShowColorOptions(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showColorOptions]);

    return ( 
        <>
            <Header />

            <section style={{ padding: '30px 0', background: '#fafafa', minHeight: '70vh' }}>
                <div className="container">
                    {/* Hero Section */}
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        margin: '0 auto 30px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(119, 87, 245, 0.3)'
                        }}>
                            <i className="ri-shopping-cart-line" style={{ fontSize: '28px', color: '#fff' }}></i>
                        </div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '12px'
                        }}>
                            Shopping Cart
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#666'
                        }}>
                            {carts.length === 0 ? 'Your cart is empty' : `${carts.length} ${carts.length === 1 ? 'item' : 'items'} in your cart`}
                        </p>
                    </div>

                    {carts.length === 0 ? (
                        /* Empty Cart State */
                        <div style={{
                            maxWidth: '600px',
                            margin: '20px auto',
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
                                <i className="ri-shopping-cart-line"></i>
                            </div>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Your Cart is Empty
                            </h3>
                            <p style={{
                                fontSize: '15px',
                                color: '#666',
                                marginBottom: '32px',
                                lineHeight: '1.6'
                            }}>
                                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
                            </p>
                            <Link 
                                to="/shop"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px 32px',
                                    background: 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)',
                                    color: '#fff',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 87, 108, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <i className="ri-shopping-bag-line"></i>
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 400px',
                            gap: '32px',
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }} className="cart-main-layout">
                            {/* Cart Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {carts.map((product, index) => {
                                    const displayColor = getColorDisplay(product);
                                    const colorHex = getColorHex(product);
                                    const normalizedColor = normalizeColorName(product.colorObj?.name || product.colorName || product.color);
                                    const itemKey = `${product.id}-${product.size}-${normalizedColor}`;
                                    const showColor = showColorOptions === itemKey;
                                    
                                    const availableSizes = getAvailableSizes(product);
                                    const availableColors = getAvailableColors(product);
                                    
                                    // Show selectors if we have data
                                    const hasSizeSelector = availableSizes.length > 0;
                                    const hasColorSelector = availableColors.length > 0;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            className="cart-item-card"
                                            style={{
                                                background: '#fff',
                                                borderRadius: '16px',
                                                padding: '24px',
                                                border: '1px solid #e0e0e0',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                transition: 'all 0.2s ease',
                                                display: 'grid',
                                                gridTemplateColumns: '120px 1fr auto',
                                                gap: '24px',
                                                alignItems: 'center',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                            }}
                                        >
                                            {/* Product Image */}
                                            <div className="product-image-wrapper" style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '12px',
                                                overflow: 'hidden',
                                                background: '#f5f5f5',
                                                border: '1px solid #e0e0e0'
                                            }}>
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div style={{ flex: 1 }}>
                                                <h3 className="product-title" style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#1a1a1a',
                                                    marginBottom: '8px'
                                                }}>
                                                    {product.name}
                                                </h3>
                                                
                                                {/* Size and Color Selection */}
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                                    {/* Size Selector - Simple Dropdown */}
                                                    {hasSizeSelector && (
                                                        <div className="size-selector-wrapper" style={{ 
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "6px"
                                                        }}>
                                                            <span style={{
                                                                fontSize: "13px",
                                                                color: "#374151",
                                                                fontWeight: "500",
                                                            }}>
                                                                Size:
                                                            </span>
                                                            <select
                                                                value={product.size || ""}
                                                                onChange={(e) => handleSizeSelect(product, e.target.value)}
                                                                style={{
                                                                    padding: "6px 30px 6px 12px",
                                                                    fontSize: "13px",
                                                                    fontWeight: "500",
                                                                    color: "#374151",
                                                                    background: "#ffffff",
                                                                    border: "1px solid #d1d5db",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer",
                                                                    outline: "none",
                                                                    transition: "all 0.2s ease",
                                                                    minHeight: "34px",
                                                                    minWidth: "100px",
                                                                    appearance: "auto",
                                                                    fontFamily: "inherit",
                                                                }}
                                                                onFocus={(e) => {
                                                                    e.currentTarget.style.borderColor = "#6b7280";
                                                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(107, 114, 128, 0.1)";
                                                                }}
                                                                onBlur={(e) => {
                                                                    e.currentTarget.style.borderColor = "#d1d5db";
                                                                    e.currentTarget.style.boxShadow = "none";
                                                                }}
                                                            >
                                                                <option value="" disabled>Select Size</option>
                                                                {availableSizes.map((size) => {
                                                                    const sizeLabel = typeof size === "object" ? size.label || size.size || size : size;
                                                                    return (
                                                                        <option key={sizeLabel} value={sizeLabel}>
                                                                            {sizeLabel}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* If no size selector but product has a size, show it statically */}
                                                    {!hasSizeSelector && product.size && (
                                                        <span className="product-size-text" style={{
                                                            fontSize: '12px',
                                                            color: '#555',
                                                            background: '#f5f5f5',
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            fontWeight: '500',
                                                            border: '1px solid #e8e8e8'
                                                        }}>
                                                            Size: {product.size}
                                                        </span>
                                                    )}

                                                    {/* Color Selector - Dropdown with color swatches */}
                                                    {hasColorSelector && (
                                                        <div className="color-selector-wrapper" style={{ 
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "6px",
                                                            position: 'relative'
                                                        }}>
                                                            <span style={{
                                                                fontSize: "13px",
                                                                color: "#374151",
                                                                fontWeight: "500",
                                                            }}>
                                                                Color:
                                                            </span>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '8px',
                                                                    padding: '4px 12px 4px 10px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #d1d5db',
                                                                    background: '#ffffff',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease',
                                                                    minHeight: '34px',
                                                                    minWidth: '120px'
                                                                }}
                                                                onClick={() => toggleColorOptions(product.id, product.size, normalizedColor)}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.borderColor = '#6b7280';
                                                                    e.currentTarget.style.background = '#f9fafb';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.borderColor = '#d1d5db';
                                                                    e.currentTarget.style.background = '#ffffff';
                                                                }}
                                                            >
                                                                <span style={{
                                                                    fontSize: '13px',
                                                                    color: '#374151',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    <span style={{ fontWeight: '600', color: '#111827' }}>
                                                                        {displayColor || 'Select'}
                                                                    </span>
                                                                </span>
                                                                {colorHex && (
                                                                    <span style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '50%',
                                                                        background: colorHex,
                                                                        border: '1px solid #d1d5db',
                                                                        display: 'inline-block',
                                                                        marginLeft: '4px'
                                                                    }}></span>
                                                                )}
                                                                <i className="ri-arrow-down-s-line" style={{
                                                                    fontSize: '16px',
                                                                    color: '#6b7280',
                                                                    transition: 'transform 0.2s ease',
                                                                    transform: showColor ? 'rotate(180deg)' : 'rotate(0deg)'
                                                                }}></i>
                                                            </div>

                                                            {showColor && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: 'calc(100% + 8px)',
                                                                    left: '0',
                                                                    background: '#ffffff',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '12px',
                                                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                                                    padding: '12px',
                                                                    minWidth: '180px',
                                                                    zIndex: 1000,
                                                                    maxHeight: '280px',
                                                                    overflowY: 'auto'
                                                                }}>
                                                                    <div style={{
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                        color: '#6b7280',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px',
                                                                        padding: '4px 4px 8px 4px',
                                                                        borderBottom: '1px solid #f3f4f6',
                                                                        marginBottom: '8px'
                                                                    }}>
                                                                        Select Color
                                                                    </div>
                                                                    <div style={{
                                                                        display: 'grid',
                                                                        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                                                        gap: '8px'
                                                                    }}>
                                                                        {availableColors.map(color => {
                                                                            const colorObj = typeof color === 'object' ? color : { label: color, hex: null };
                                                                            const colorLabel = colorObj.label || colorObj.name || colorObj.color || color;
                                                                            const colorHexValue = colorObj.hex || colorObj.hexCode || colorObj.value || null;
                                                                            const isSelected = displayColor && displayColor.toLowerCase() === colorLabel.toLowerCase();
                                                                            
                                                                            return (
                                                                                <button
                                                                                    key={colorLabel}
                                                                                    style={{
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        gap: '8px',
                                                                                        padding: '6px 10px',
                                                                                        fontSize: '13px',
                                                                                        fontWeight: isSelected ? '600' : '500',
                                                                                        color: isSelected ? '#ffffff' : '#374151',
                                                                                        background: isSelected ? '#111827' : '#f9fafb',
                                                                                        border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
                                                                                        borderRadius: '8px',
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.15s ease',
                                                                                        textAlign: 'left'
                                                                                    }}
                                                                                    onClick={() => handleColorSelect(product, colorObj)}
                                                                                    onMouseEnter={(e) => {
                                                                                        if (!isSelected) {
                                                                                            e.currentTarget.style.background = '#f3f4f6';
                                                                                            e.currentTarget.style.borderColor = '#9ca3af';
                                                                                        }
                                                                                    }}
                                                                                    onMouseLeave={(e) => {
                                                                                        if (!isSelected) {
                                                                                            e.currentTarget.style.background = '#f9fafb';
                                                                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    {colorHexValue && (
                                                                                        <span style={{
                                                                                            width: '20px',
                                                                                            height: '20px',
                                                                                            borderRadius: '50%',
                                                                                            background: colorHexValue,
                                                                                            border: '1px solid #d1d5db',
                                                                                            display: 'inline-block',
                                                                                            flexShrink: 0
                                                                                        }}></span>
                                                                                    )}
                                                                                    <span>{colorLabel}</span>
                                                                                    {isSelected && (
                                                                                        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>
                                                                                            <i className="ri-check-line"></i>
                                                                                        </span>
                                                                                    )}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* If no color selector but product has a color, show it statically */}
                                                    {!hasColorSelector && displayColor && (
                                                        <span style={{
                                                            fontSize: '12px',
                                                            color: '#555',
                                                            background: '#f5f5f5',
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontWeight: '500',
                                                            border: '1px solid #e8e8e8'
                                                        }}>
                                                            {colorHex && (
                                                                <span style={{
                                                                    width: '12px',
                                                                    height: '12px',
                                                                    borderRadius: '50%',
                                                                    background: colorHex,
                                                                    border: '1px solid #ddd',
                                                                    display: 'inline-block'
                                                                }}></span>
                                                            )}
                                                            {displayColor}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="product-unit-price" style={{
                                                    fontSize: '20px',
                                                    fontWeight: '700',
                                                    color: '#000000ff'
                                                }}>
                                                    ৳ {product.price}
                                                </div>
                                            </div>

                                            {/* Quantity & Actions */}
                                            <div className="product-actions-wrapper" style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                alignItems: 'flex-end'
                                            }}>
                                                {/* Quantity Controls */}
                                                <div className="quantity-box" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    background: '#f5f5f5',
                                                    padding: '8px 12px',
                                                    borderRadius: '10px',
                                                    border: '1px solid #e0e0e0'
                                                }}>
                                                    <button
                                                        onClick={() => decrementQuantity(product.id, product.size, normalizedColor)}
                                                        className="qty-button"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            background: '#fff',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            fontSize: '18px',
                                                            fontWeight: '600',
                                                            color: '#666',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#f5576c';
                                                            e.currentTarget.style.color = '#fff';
                                                            e.currentTarget.style.borderColor = '#f5576c';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '#fff';
                                                            e.currentTarget.style.color = '#666';
                                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="qty-display" style={{
                                                        fontSize: '16px',
                                                        fontWeight: '600',
                                                        color: '#1a1a1a',
                                                        minWidth: '30px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {product.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => incrementQuantity(product.id, product.size, normalizedColor)}
                                                        className="qty-button"
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            background: '#fff',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            fontSize: '18px',
                                                            fontWeight: '600',
                                                            color: '#666',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#f5576c';
                                                            e.currentTarget.style.color = '#fff';
                                                            e.currentTarget.style.borderColor = '#f5576c';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '#fff';
                                                            e.currentTarget.style.color = '#666';
                                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Subtotal & Remove */}
                                                <div className="subtotal-actions" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px'
                                                }}>
                                                    <div className="item-subtotal" style={{
                                                        fontSize: '18px',
                                                        fontWeight: '700',
                                                        color: '#1a1a1a'
                                                    }}>
                                                        ৳ {product.price * product.quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => removeCart(product.id, product.size, normalizedColor)}
                                                        className="delete-button"
                                                        style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            background: '#fff',
                                                            border: '1px solid #e0e0e0',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = '#dc3545';
                                                            e.currentTarget.style.borderColor = '#dc3545';
                                                            e.currentTarget.querySelector('i').style.color = '#fff';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '#fff';
                                                            e.currentTarget.style.borderColor = '#e0e0e0';
                                                            e.currentTarget.querySelector('i').style.color = '#dc3545';
                                                        }}
                                                    >
                                                        <i 
                                                            className="ri-delete-bin-line"
                                                            style={{
                                                                fontSize: '18px',
                                                                color: '#dc3545',
                                                                transition: 'color 0.2s ease'
                                                            }}
                                                        ></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Cart Summary */}
                            <div style={{
                                position: 'sticky',
                                top: '100px',
                                height: 'fit-content'
                            }}>
                                <div style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    border: '1px solid #e0e0e0',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                                }}>
                                    <h2 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#1a1a1a',
                                        marginBottom: '24px',
                                        paddingBottom: '16px',
                                        borderBottom: '2px solid #f5f5f5'
                                    }}>
                                        Cart Summary
                                    </h2>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                        marginBottom: '24px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: '#666'
                                        }}>
                                            <span>Subtotal</span>
                                            <span style={{ fontWeight: '600', color: '#1a1a1a' }}>৳ {totalPrice}</span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            color: '#666'
                                        }}>
                                            <span>Shipping</span>
                                            <span style={{ fontWeight: '600', color: '#1a1a1a' }}>৳ {shippingCharge}</span>
                                        </div>

                                        <div style={{
                                            height: '1px',
                                            background: '#e0e0e0',
                                            margin: '8px 0'
                                        }}></div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#1a1a1a'
                                            }}>
                                                Total
                                            </span>
                                            <span style={{
                                                fontSize: '24px',
                                                fontWeight: '700',
                                                color: '#000000ff'
                                            }}>
                                                ৳ {finalPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <Link 
                                        to="/checkout"
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '16px',
                                            background: 'linear-gradient(135deg, #595959ff 0%, #000000ff 100%)',
                                            color: '#fff',
                                            borderRadius: '10px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease',
                                            marginBottom: '16px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 87, 108, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <Link 
                                        to="/shop"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            width: '100%',
                                            padding: '14px',
                                            background: '#fff',
                                            color: '#666',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '10px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f5f5f5';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#fff';
                                        }}
                                    >
                                        <i className="ri-arrow-left-line"></i>
                                        Continue Shopping
                                    </Link>

                                    {/* Trust Badges */}
                                    <div style={{
                                        marginTop: '24px',
                                        padding: '20px',
                                        background: '#f5f5f5',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    }}>
                                        {[
                                            { icon: 'ri-shield-check-line', text: 'Secure Payment' },
                                            { icon: 'ri-truck-line', text: 'Fast Delivery' },
                                            { icon: 'ri-customer-service-2-line', text: '24/7 Support' }
                                        ].map((badge, idx) => (
                                            <div 
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    fontSize: '13px',
                                                    color: '#666'
                                                }}
                                            >
                                                <i 
                                                    className={badge.icon}
                                                    style={{
                                                        fontSize: '20px',
                                                        color: '#000000ff'
                                                    }}
                                                ></i>
                                                <span style={{ fontWeight: '500' }}>{badge.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Responsive Styles */}
                <style>{`
                    @media (max-width: 1024px) {
                        .cart-main-layout {
                            grid-template-columns: 1fr !important;
                        }
                        div[style*="position: sticky"] {
                            position: static !important;
                        }
                    }

                    @media (max-width: 768px) {
                        .cart-item-card {
                            grid-template-columns: 90px 1fr !important;
                            grid-template-areas: 
                                "image info"
                                "actions actions" !important;
                            gap: 12px 16px !important;
                            padding: 16px !important;
                        }

                        .product-image-wrapper {
                            grid-area: image !important;
                            width: 90px !important;
                            height: 90px !important;
                        }

                        .product-title {
                            font-size: 15px !important;
                            margin-bottom: 6px !important;
                        }

                        .product-unit-price {
                            font-size: 17px !important;
                        }

                        .product-actions-wrapper {
                            grid-area: actions !important;
                            flex-direction: row !important;
                            justify-content: space-between !important;
                            align-items: center !important;
                            width: 100% !important;
                            padding-top: 8px !important;
                            border-top: 1px solid #f0f0f0 !important;
                        }

                        .quantity-box {
                            padding: 6px 10px !important;
                            gap: 10px !important;
                        }

                        .qty-button {
                            width: 28px !important;
                            height: 28px !important;
                            font-size: 16px !important;
                        }

                        .qty-display {
                            font-size: 15px !important;
                            min-width: 25px !important;
                        }

                        .subtotal-actions {
                            gap: 12px !important;
                        }

                        .item-subtotal {
                            font-size: 16px !important;
                        }

                        .delete-button {
                            width: 32px !important;
                            height: 32px !important;
                        }

                        .size-selector-wrapper,
                        .color-selector-wrapper {
                            width: 100% !important;
                        }

                        .size-selector-wrapper select,
                        .color-selector-wrapper > div {
                            width: 100% !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .cart-item-card {
                            grid-template-columns: 75px 1fr !important;
                            gap: 10px 12px !important;
                            padding: 14px !important;
                        }

                        .product-image-wrapper {
                            width: 75px !important;
                            height: 75px !important;
                        }

                        .product-title {
                            font-size: 14px !important;
                        }

                        .product-unit-price {
                            font-size: 16px !important;
                        }

                        .quantity-box {
                            padding: 5px 8px !important;
                            gap: 8px !important;
                        }

                        .qty-button {
                            width: 26px !important;
                            height: 26px !important;
                            font-size: 15px !important;
                        }

                        .qty-display {
                            font-size: 14px !important;
                            min-width: 22px !important;
                        }

                        .item-subtotal {
                            font-size: 15px !important;
                        }

                        .delete-button {
                            width: 30px !important;
                            height: 30px !important;
                        }

                        .delete-button i {
                            font-size: 16px !important;
                        }
                    }
                `}</style>
            </section>

            <Footer />
        </>
    );
}

export default ViewCart;