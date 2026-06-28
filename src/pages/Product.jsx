import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RelatedProducts from "../components/RelatedProducts";
import ProductTabs from "../components/ProductTabs";
import useWebInfo from "../data/useWebInfo";
import Swal from "sweetalert2";
import Skeleton from '@mui/material/Skeleton';

// Product Data
import useProducts from '../data/useProducts';
import useSizes from '../data/useSizes';
import useColors from '../data/useColors';
import { dataLayerPush } from "../assets/js/main";

// Custom Hooks
import useSubmitReview from '../data/useSubmitReview';
import useReviews from '../data/useReviews';
import useVariants from '../data/useVariants';

function normalizeColorObject(c) {
  if (!c) return null;
  return {
    id: c.id ?? c.value ?? null,
    name: (c.label || c.name || c.color || "").toString().trim(),
    hex: (c.hex || c.hexCode || c.value || null),
    stock: Number(c.stock ?? c.qty ?? 0),
  };
}

function Product() {
  const { sizes } = useSizes();
  const { colors } = useColors();
  const { products } = useProducts();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState(null);
  const { webInfo } = useWebInfo();

  // Review states
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  // Find product by slug
  const product = products.find(p => p.product_slug === slug) || {};

  // Use custom hooks with product ID
  const { submitReview, submitting, error: submitError } = useSubmitReview();
  const {
    reviews: productReviews,
    loading: reviewsLoading,
    error: fetchError,
    stats: reviewStats,
    refreshReviews
  } = useReviews(product?.id);

  // Fetch variants for the current product
  const { variants, loading: variantsLoading, error: variantsError } = useVariants(product?.id);

  // User state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Current SKU based on variant selection
  const [currentSKU, setCurrentSKU] = useState("");

  const orderNow = (product) => {
    addToCart(product, false);
    navigate("/checkout");
  };

  const {
    id: productId,
    img, img2, img3, img4,
    title, category, category_slug,
    sub_category, sub_category_slug,
    regular_price, selling_price,
    avilable_stock, is_preorder, preorder_available_date, preorder_note, product_code,
    Product_keyword, short_description,
    long_description
  } = product;

  const loggedRef = useRef(false);

  useEffect(() => {
    loggedRef.current = false;
  }, [slug]);

  useEffect(() => {
    if (loggedRef.current) return;
    if (!product || !product.id) return;

    dataLayerPush("view_item", {
      code: product.id,
      name: product.title,
      price: product.selling_price,
      category: product.category,
      subCategory: product.sub_category,
    });

    loggedRef.current = true;
  }, [product, slug]);

  // User authentication
  useEffect(() => {
    const checkUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && parsedUser.id && parseInt(parsedUser.id) > 0) {
            setUser(parsedUser);
            setIsLoggedIn(true);
            return;
          }
        }

        createNewUser();
      } catch (error) {
        console.error('Error checking user:', error);
        createNewUser();
      }
    };

    const createNewUser = () => {
      setUser("");
      setIsLoggedIn(false);
    };

    checkUser();
  }, []);

  // Filter reviews based on user_id != 0 condition
  const filteredReviews = Array.isArray(productReviews)
    ? productReviews.filter(review =>
      review.user_id && parseInt(review.user_id) !== 0
    )
    : [];

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!product || !product.id) {
      Swal.fire({
        icon: 'error',
        title: 'Product not found',
        text: 'Unable to submit review for this product.'
      });
      return;
    }

    if (!user || !user.id || parseInt(user.id) === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please refresh the page to get a valid user ID.'
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      Swal.fire({
        icon: "error",
        title: "Review Required",
        text: "Please write your review before submitting.",
      });
      return;
    }

    const result = await submitReview(
      product.id,
      reviewForm.rating,
      reviewForm.comment
    );

    if (result.success) {
      setReviewForm({ rating: 5, comment: "" });
      refreshReviews();

      Swal.fire({
        icon: "success",
        title: "Review Submitted!",
        text: result.message,
        timer: 2000
      });

    } else {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: result.message || submitError || "Failed to submit review"
      });
    }
  };

  const productSizes = sizes.find(s => s.product_slug === slug)?.sizes || [];
  const productColors = colors.find(c => c.product_slug === slug)?.colors || [];
  const [mainImage, setMainImage] = useState("");
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  // FIXED: Reset all selections when slug changes (product navigation)
  useEffect(() => {
    setSize("");
    setColor(null);
    setQuantity(1);
    setCurrentSKU("");
    setMainImage(""); // Reset main image first
    setMainImgLoaded(false); // Reset loading state
  }, [slug]);

  // FIXED: Improved image initialization logic - runs after reset
  useEffect(() => {
    if (product && product.img) {
      // Build thumbnails array
      const thumbnails = [product.img, product.img2, product.img3, product.img4].filter(Boolean);

      // Set the first available thumbnail as main image
      if (thumbnails.length > 0) {
        setMainImage(thumbnails[0]);
        setMainImgLoaded(false); // Will be set to true when image loads
      }
    }

    // Set default color if available
    if (productColors.length > 0 && !color) {
      const firstColor = normalizeColorObject(productColors[0]);
      // Optionally set default color: setColor(firstColor);
    }
  }, [product.img, slug]); // Depend on product.img and slug

  // Update SKU when size or color changes
  useEffect(() => {
    if (!variants || variants.length === 0) {
      setCurrentSKU("");
      return;
    }

    const selectedColorName = color?.name || "";
    const selectedSize = size || "";

    // Find matching variant
    const matchingVariant = variants.find(variant => {
      const variantSize = (variant.size || "").toString().trim();
      const variantColor = (variant.color || "").toString().trim();

      // Match based on what's selected
      const sizeMatch = selectedSize === "" || variantSize === "" || variantSize.toLowerCase() === selectedSize.toLowerCase();
      const colorMatch = selectedColorName === "" || variantColor === "" || variantColor.toLowerCase() === selectedColorName.toLowerCase();

      return sizeMatch && colorMatch;
    });

    if (matchingVariant && matchingVariant.sku) {
      setCurrentSKU(matchingVariant.sku);
    } else {
      setCurrentSKU("");
    }
  }, [size, color, variants]);

  // Variant validation logic
  const getAvailableSizes = () => {
    if (!variants || variants.length === 0) return productSizes;

    const selectedColorName = color?.name || "";

    if (!selectedColorName) {
      // No color selected, return all sizes that have variants
      const availableSizeLabels = [...new Set(
        variants
          .filter(v => v.size && v.size.toString().trim() !== "")
          .map(v => v.size.toString().trim())
      )];

      return productSizes.filter(s =>
        availableSizeLabels.some(label =>
          label.toLowerCase() === (s.label || "").toString().trim().toLowerCase()
        )
      );
    }

    // Color is selected, filter sizes based on available variants
    const availableSizeLabels = [...new Set(
      variants
        .filter(variant => {
          const variantColor = (variant.color || "").toString().trim();
          const variantSize = (variant.size || "").toString().trim();

          // Match color (or variant has no color restriction)
          const colorMatch = variantColor === "" || variantColor.toLowerCase() === selectedColorName.toLowerCase();

          return colorMatch && variantSize !== "";
        })
        .map(v => v.size.toString().trim())
    )];

    return productSizes.filter(s =>
      availableSizeLabels.some(label =>
        label.toLowerCase() === (s.label || "").toString().trim().toLowerCase()
      )
    );
  };

  const getAvailableColors = () => {
    if (!variants || variants.length === 0) return productColors;

    const selectedSize = size || "";

    if (!selectedSize) {
      // No size selected, return all colors that have variants
      const availableColorLabels = [...new Set(
        variants
          .filter(v => v.color && v.color.toString().trim() !== "")
          .map(v => v.color.toString().trim())
      )];

      return productColors.filter(c => {
        const colorLabel = (c.label || c.name || c.color || "").toString().trim();
        return availableColorLabels.some(label =>
          label.toLowerCase() === colorLabel.toLowerCase()
        );
      });
    }

    // Size is selected, filter colors based on available variants
    const availableColorLabels = [...new Set(
      variants
        .filter(variant => {
          const variantSize = (variant.size || "").toString().trim();
          const variantColor = (variant.color || "").toString().trim();

          // Match size (or variant has no size restriction)
          const sizeMatch = variantSize === "" || variantSize.toLowerCase() === selectedSize.toLowerCase();

          return sizeMatch && variantColor !== "";
        })
        .map(v => v.color.toString().trim())
    )];

    return productColors.filter(c => {
      const colorLabel = (c.label || c.name || c.color || "").toString().trim();
      return availableColorLabels.some(label =>
        label.toLowerCase() === colorLabel.toLowerCase()
      );
    });
  };

  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();

  const getSizeStock = (sizeLabel) => {
    if (!variants || variants.length === 0) {
      const s = productSizes.find(x => x.label === sizeLabel);
      return s ? Number(s.stock || 0) : 0;
    }
    const selectedColorName = color?.name || "";
    const matchingVariants = variants.filter(v => {
      const vSize = (v.size || "").toString().trim();
      const vColor = (v.color || "").toString().trim();
      const sizeMatch = vSize.toLowerCase() === sizeLabel.toLowerCase() || vSize === "";
      const colorMatch = selectedColorName === "" || vColor === "" || vColor.toLowerCase() === selectedColorName.toLowerCase();
      return sizeMatch && colorMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + Number(v.available_stock || 0), 0);
  };

  const getColorStock = (colorObj) => {
    const colorName = (colorObj.label || colorObj.name || colorObj.color || "").toString().trim();
    if (!variants || variants.length === 0) {
      const c = productColors.find(x => {
        const xName = (x.label || x.name || x.color || "").toString().trim();
        return xName.toLowerCase() === colorName.toLowerCase();
      });
      return c ? Number(c.stock || 0) : 0;
    }
    const selectedSizeLabel = size || "";
    const matchingVariants = variants.filter(v => {
      const vSize = (v.size || "").toString().trim();
      const vColor = (v.color || "").toString().trim();
      const colorMatch = vColor.toLowerCase() === colorName.toLowerCase() || vColor === "";
      const sizeMatch = selectedSizeLabel === "" || vSize === "" || vSize.toLowerCase() === selectedSizeLabel.toLowerCase();
      return sizeMatch && colorMatch;
    });
    return matchingVariants.reduce((sum, v) => sum + Number(v.available_stock || 0), 0);
  };

  // Check if a specific size is available based on current color selection
  const isSizeAvailable = (sizeLabel) => {
    return availableSizes.some(s =>
      (s.label || "").toString().trim().toLowerCase() === sizeLabel.toLowerCase()
    );
  };

  // Check if a specific color is available based on current size selection
  const isColorAvailable = (colorObj) => {
    const colorLabel = (colorObj.label || colorObj.name || colorObj.color || "").toString().trim();
    return availableColors.some(c => {
      const cLabel = (c.label || c.name || c.color || "").toString().trim();
      return cLabel.toLowerCase() === colorLabel.toLowerCase();
    });
  };

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const scale = 2.5;

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const imgEl = imgRef.current;
    if (!container || !imgEl) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    imgEl.style.transformOrigin = `${x}% ${y}%`;
    imgEl.style.transform = `scale(${scale})`;
  };

  const handleMouseLeave = () => {
    const imgEl = imgRef.current;
    if (!imgEl) return;
    imgEl.style.transform = "scale(1)";
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

  const isProductLoading = !product || !product.title;

  const discountPercent = regular_price && selling_price
    ? Math.round(((regular_price - selling_price) / regular_price) * 100)
    : 0;

  const hasUserReviewed = user && productId ?
    filteredReviews.some(review => parseInt(review.user_id) === parseInt(user.id)) :
    false;

  const isColorSelected = (rawColor) => {
    if (!color || !rawColor) return false;
    const sel = normalizeColorObject(color);
    const r = normalizeColorObject(rawColor);
    if (!sel || !r) return false;
    if (sel.id && r.id) return String(sel.id) === String(r.id);
    return sel.name.toLowerCase() === r.name.toLowerCase();
  };

  const getColorHex = (c) => {
    return c?.hex || c?.value || c?.hexCode || "#cccccc";
  };

  const handleSizeClick = (sizeLabel) => {
    if (size === sizeLabel) {
      setSize("");
    } else {
      setSize(sizeLabel);
    }
  };

  const handleColorClick = (colorObj) => {
    const normalizedColor = normalizeColorObject(colorObj);
    const isSame = color && normalizedColor &&
      (color.id === normalizedColor.id ||
        color.name.toLowerCase() === normalizedColor.name.toLowerCase());

    if (isSame) {
      setColor(null);
    } else {
      setColor(normalizedColor);
    }
  };

  const validateSelections = () => {
    if (productSizes.length > 0 && !size) {
      Swal.fire({
        icon: "warning",
        title: "Select a Size",
        text: "Please select a size before proceeding.",
      });
      return false;
    }

    if (productColors.length > 0 && !color) {
      Swal.fire({
        icon: "warning",
        title: "Select a Color",
        text: "Please select a color before proceeding.",
      });
      return false;
    }

    if (size && getSizeStock(size) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `Selected size is currently out of stock.`,
      });
      return false;
    }

    if (!isPreOrder && color && getColorStock(color) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `${color.name} is currently out of stock.`,
      });
      return false;
    }

    return true;
  };

  const handleAddToCart = () => {
    if (productSizes.length > 0 && !size) {
      Swal.fire({
        icon: "warning",
        title: "Select a Size",
        text: "Please select a size before adding to cart.",
      });
      return;
    }

    if (productColors.length > 0 && !color) {
      Swal.fire({
        icon: "warning",
        title: "Select a Color",
        text: "Please select a color before adding to cart.",
      });
      return;
    }

    if (size && getSizeStock(size) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `Selected size is currently out of stock.`,
      });
      return;
    }

    if (color && getColorStock(color) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `${color.name} is currently out of stock.`,
      });
      return;
    }

    addToCart({
      ...product,
      size: size || null,
      colorObj: color,
      colorName: color?.name || null,
      colorHex: color?.hex || null,
      quantity,
      sku: currentSKU || product_code,
      availableSizes: productSizes, // Pass available sizes from database
      availableColors: productColors, // Pass available colors from database
  });
  };

  const handleBuyNow = () => {
    if (productSizes.length > 0 && !size) {
      Swal.fire({
        icon: "warning",
        title: "Select a Size",
        text: "Please select a size before ordering.",
      });
      return;
    }

    if (productColors.length > 0 && !color) {
      Swal.fire({
        icon: "warning",
        title: "Select a Color",
        text: "Please select a color before ordering.",
      });
      return;
    }

    if (size && getSizeStock(size) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `Selected size is currently out of stock.`,
      });
      return;
    }

    if (color && getColorStock(color) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: `${color.name} is currently out of stock.`,
      });
      return;
    }

    orderNow({
      ...product,
      size: size || null,
      colorObj: color,
      colorName: color?.name || null,
      colorHex: color?.hex || null,
      quantity,
      sku: currentSKU || product_code,
      availableSizes: productSizes, // Pass available sizes from database
      availableColors: productColors, // Pass available colors from database
  });
  };

  // Pre-order handler: clears cart first to avoid mixing with regular items
  const handlePreOrderNow = () => {
    if (!validateSelections()) return;

    clearCart();

    orderNow({
      ...product,
      size: size || null,
      colorObj: color,
      colorName: color?.name || null,
      colorHex: color?.hex || null,
      quantity,
      sku: currentSKU || product_code
    });
  };

  // FIXED: Handle thumbnail click with proper image loading reset
  const handleThumbnailClick = (thumb) => {
    if (thumb !== mainImage) {
      setMainImgLoaded(false);
      setMainImage(thumb);
    }
  };

  const isPreOrder = Number(is_preorder) === 1;

  return (
    <>
      <Header />

      <section className="modern-product-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="product-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/category/${category_slug}`}>{category}</Link>
            <span>/</span>
            <Link to={`/sub-category/${sub_category_slug}`}>{sub_category}</Link>
            <span>/</span>
            <span>{title}</span>
          </div>

          <div className="modern-product-container">
            {/* Product Gallery */}
            <div className="product-gallery">
              <div className="main-image-wrapper" ref={containerRef}>
                {discountPercent > 0 && (
                  <div className="discount-badge">-{discountPercent}%</div>
                )}

                {!mainImgLoaded && mainImage && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: "absolute", top: 0, left: 0 }}
                    animation="wave"
                  />
                )}
                {mainImage && (
                  <img
                    ref={imgRef}
                    className="img-zoom"
                    src={mainImage}
                    alt="Product"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ display: mainImgLoaded ? "block" : "none" }}
                    onLoad={() => setMainImgLoaded(true)}
                    onError={() => setMainImgLoaded(true)}
                  />
                )}
              </div>

              <div className="thumbnail-grid">
                {product &&
                  [product.img, product.img2, product.img3, product.img4]
                    .filter(Boolean)
                    .map((thumb, i) => (
                      <div
                        key={`${slug}-thumb-${i}`}
                        className={`thumbnail ${mainImage === thumb ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(thumb)}
                      >
                        <img src={thumb} alt={`Thumbnail ${i + 1}`} />
                      </div>
                    ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              {isProductLoading ? (
                <>
                  <Skeleton variant="text" width="80%" height={50} />
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2 }} />
                </>
              ) : (
                <>
                  <h1 className="mb-3">{title}</h1>

                  <div className="d-flex gap-2">
                    <p
                      style={{ borderRight: '1px solid #ccc', paddingRight: '15px' }}
                    >
                      <b>Availability :</b>

                      <span
                        className="p-1 px-2 mx-1 rounded"
                        style={{
                          backgroundColor: (isPreOrder || Number(avilable_stock) > 0) ? '#dcfce7' : '#fee2e2',
                          color: (isPreOrder || Number(avilable_stock) > 0) ? '#29a34a' : '#dc2626',
                        }}
                      >
                        {isPreOrder ? 'Pre-Order' : (Number(avilable_stock) > 0 ? 'In Stock' : 'Out of Stock')}
                      </span>
                    </p>
                    <p><b>SKU:</b> {currentSKU || product_code}</p>
                  </div>

                  <div className="d-flex gap-2 mt-3 mb-4">
                    <b>Category: </b>
                    <Link to={`/category/${category_slug}`}>{category}</Link>
                    <span>/</span>
                    <Link to={`/sub-category/${sub_category_slug}`}>{sub_category}</Link>
                  </div>

                  {short_description && (
                    <div className="product-description my-3 py-2" dangerouslySetInnerHTML={{ __html: short_description }} />
                  )}

                  <div className="price-section">
                    <div className="price-row">
                      <div className="current-price">৳ {selling_price}</div>
                      {regular_price > selling_price && (
                        <div className="original-price">৳ {regular_price}</div>
                      )}
                    </div>
                    {regular_price > selling_price && (
                      <div className="save-amount">
                        You save ৳ {regular_price - selling_price} ({discountPercent}% OFF)
                      </div>
                    )}
                  </div>

                  {/* Pre-Order Banner */}
                  {isPreOrder && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #86cbff2b, #8acbfd1d)',
                        border: '1px solid #0bcaf5',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <i className="ri-time-line" style={{ color: '#0bcaf5', fontSize: '1rem' }}></i>
                        <span style={{ fontWeight: 700, color: '#0bcaf5', fontSize: '0.9rem' }}>Pre-Order Product</span>
                      </div>
                      {preorder_available_date && new Date(preorder_available_date) >= new Date(new Date().toDateString()) && (
                        <p style={{ margin: '2px 0', fontSize: '0.82rem', color: '#0bcaf5' }}>
                          <b>Available From:</b> {preorder_available_date}
                        </p>
                      )}
                      {preorder_note && (
                        <p style={{ margin: '2px 0', fontSize: '0.82rem', color: '#0bcaf5' }}>
                          <b>Note:</b> {preorder_note}
                        </p>
                      )}
                    </div>
                  )}

                  {productSizes.length > 0 && (
                    <div className="size-selector">
                      <label className="size-label">Select Size: <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="size-grid">
                        {productSizes.map((s) => {
                          const available = isSizeAvailable(s.label);
                          const sizeStock = getSizeStock(s.label);
                          
                          if (!available) return null;

                          return (
                            <button
                              key={s.id}
                              className={`size-btn ${size === s.label ? 'active' : ''}`}
                              disabled={sizeStock === 0}
                              onClick={() => handleSizeClick(s.label)}
                              style={{
                                opacity: sizeStock === 0 ? 0.3 : 1,
                                cursor: sizeStock === 0 ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {productColors.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        marginBottom: '0.75rem',
                        color: '#1f2937'
                      }}>
                        Select Color: <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        {productColors.map((c) => {
                          const isSelected = isColorSelected(c);
                          const colorHex = getColorHex(c);
                          const stock = getColorStock(c);
                          const normalizedColor = normalizeColorObject(c);
                          const available = isColorAvailable(c);

                          if (!available) return null;

                          return (
                            <div
                              key={c.id ?? c.label}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <div
                                onClick={() => stock > 0 && handleColorClick(c)}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '50%',
                                  backgroundColor: colorHex,
                                  cursor: stock > 0 ? 'pointer' : 'not-allowed',
                                  border: isSelected ? '3.5px solid #000' : '2.5px solid #e0e0e0',
                                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.08)',
                                  transition: 'all 0.2s',
                                  transform: isSelected ? 'scale(1.06)' : 'none',
                                  opacity: stock > 0 ? 1 : 0.3
                                }}
                                title={`${c.label || c.name}${stock <= 0 ? ' - Out of stock' : ''}`}
                              />
                              <span style={{
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? '#000' : '#666'
                              }}>
                                {c.label || c.name || 'Color'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="quantity-section">
                    <span className="quantity-label">Quantity:</span>
                    <div className="quantity-control">
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      >
                        −
                      </button>
                      <div className="quantity-display">{quantity}</div>
                      <button
                        className="quantity-btn"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="action-buttons">
                    {/* Add to Cart — hidden for pre-order products */}
                    {!isPreOrder && (
                      <button
                        className="primary-btn add-to-cart-btn rounded-pill text-white"
                        style={{ background: 'linear-gradient(135deg, #000000ff, #505050ff)' }}
                        onClick={handleAddToCart}
                        disabled={Number(avilable_stock) === 0}
                      >
                        <i className="ri-shopping-cart-2-line"></i>
                        Add to Cart
                      </button>
                    )}

                    {/* Buy Now / Pre-order Now */}
                    <button
                      className="primary-btn buy-now-btn rounded-pill"
                      onClick={isPreOrder ? handlePreOrderNow : handleBuyNow}
                      disabled={!isPreOrder && Number(avilable_stock) === 0}
                      style={isPreOrder ? {
                        background: '#000',
                        border: 'none',
                        width: '100%',
                        color: '#fff'
                      } : {}}
                    >
                      <i className={isPreOrder ? "ri-time-line" : "ri-shopping-bag-line"}></i>
                      {isPreOrder ? 'Pre-order Now' : 'Buy Now'}
                    </button>
                  </div>

                  <div className="contact-section">
                    <div className="contact-title">Need Help? Contact Us:</div>
                    <div className="contact-buttons">
                      <button
                        className="contact-btn phone"
                        onClick={() => callBDNumber(`${webInfo?.wp_api_num}`)}
                      >
                        <i className="ri-phone-line"></i>
                        Call
                      </button>
                      <button
                        className="contact-btn whatsapp"
                        onClick={() => goToWhatsApp(`${webInfo?.wp_api_num}`)}
                      >
                        <i className="ri-whatsapp-line"></i>
                        WhatsApp
                      </button>
                      <button
                        className="contact-btn messenger"
                        onClick={() => goToMessenger(`${webInfo?.messenger_username}`)}
                      >
                        <i className="ri-messenger-line"></i>
                        Messenger
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <ProductTabs
            product={product}
            filteredReviews={filteredReviews}
            reviewsLoading={reviewsLoading}
            fetchError={fetchError}
            user={user}
            productId={productId}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            handleReviewSubmit={handleReviewSubmit}
            submitting={submitting}
            submitError={submitError}
            hasUserReviewed={hasUserReviewed}
          />

        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts
        products={products}
        slug={slug}
        category_slug={category_slug}
        sub_category_slug={sub_category_slug}
      />

      <Footer />
    </>
  );
}

export default Product;