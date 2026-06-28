import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import useSizes from '../data/useSizes';
import useColors from '../data/useColors';
import SizeModal from "./SizeModal";
import Swal from "sweetalert2";
import Skeleton from '@mui/material/Skeleton';
import '../assets/css/product-card.css';

function normalizeColorObject(c) {
  if (!c) return null;
  return {
    id: c.id ?? c.value ?? null,
    name: (c.label || c.name || c.color || "").toString().trim(),
    hex: (c.hex || c.hexCode || c.value || null),
    stock: Number(c.stock ?? c.qty ?? 0),
  };
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const { sizes } = useSizes();
  const { colors } = useColors();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGoToProduct = (link) => navigate(link);

  const productSizes =
    sizes.find((s) => s.product_slug === product.product_slug)?.sizes || [];

  const productColorsRaw =
    colors.find((c) => c.product_slug === product.product_slug)?.colors || [];
  const productColors = productColorsRaw.map(normalizeColorObject);

  const handleAddToCart = () => {
    if (Number(product.avilable_stock) === 0) {
      Swal.fire({ icon: "error", title: "Out of Stock", text: "This product is currently out of stock." });
      return;
    }

    if (productSizes.length > 0 || productColors.length > 0) {
      setSelectedProduct(product);
      setModalOpen(true);
    } else {
      addToCart({ 
        ...product, 
        size: null, 
        colorName: null,
        colorHex: null,
        colorObj: null,
        quantity: 1 
      });
    }
  };

  const handleSelectionComplete = (sizeLabel, colorObj) => {
    const normalizedColor = colorObj ? normalizeColorObject(colorObj) : null;



    const cartItem = {
      ...selectedProduct,
      size: sizeLabel || null,
      colorName: normalizedColor ? normalizedColor.name : null,
      colorHex: normalizedColor ? normalizedColor.hex : null,
      colorObj: normalizedColor,
      quantity: 1
    };

    addToCart(cartItem);

    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOrderNow = () => {
    navigate(product.link);
  };

  return (
    <>
      <div className="card">
        <div className="product-image-container">
          {!imgLoaded && (
            <Skeleton
              variant="rectangular"
              className="product-skeleton"
              sx={{ bgcolor: "grey.300" }}
              animation="wave"
            />
          )}
          <img
            onClick={() => handleGoToProduct(product.link)}
            src={product.img}
            className="product-image"
            alt={product.title}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6
              className="product-title"
              onClick={() => handleGoToProduct(product.link)}
            >
              {product.title}
            </h6>

            <i
              className="ri-heart-line wishlist-icon"
              onClick={() => addToWishlist(product)}
            ></i>
          </div>

          <p 
            className="product-category"
            onClick={() => handleGoToProduct(product.link)}
          >
            {product.category}
          </p>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 
              className="price-current" 
              onClick={() => handleGoToProduct(product.link)}
            >
              ৳ {product.selling_price}
            </h6>
            <h6 
              className="price-old" 
              onClick={() => handleGoToProduct(product.link)}
            >
              ৳ {product.regular_price}
            </h6>
          </div>

          {product.is_preorder == 1 && (
            <button 
              className="product-btn buy-btn w-100" 
              onClick={handleOrderNow} 
            >
              Pre-order Now
            </button>
          )}

          {product.is_preorder == 0 && (
            <div className="d-flex gap-1">
              <button 
                className="product-btn add-cart-btn" 
                onClick={handleAddToCart} 
                disabled={Number(product.avilable_stock) === 0}
              >
                Add to Cart
              </button>
              
              <button 
                className="product-btn buy-btn" 
                onClick={handleOrderNow} 
                disabled={Number(product.avilable_stock) === 0}
              >
                Buy Now
              </button>
            </div>
          )}
          

        </div>
      </div>

      <SizeModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSelectionComplete={handleSelectionComplete}
        productSizes={productSizes}
        productColors={productColors}
      />
    </>
  );
}

export default ProductCard;