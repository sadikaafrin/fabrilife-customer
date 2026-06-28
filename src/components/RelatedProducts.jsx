import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import useSizes from "../data/useSizes";
import useColors from "../data/useColors";
import SizeModal from "./SizeModal";

/* ── Inline Related Card — matches the screenshot style ── */
function RelatedCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { sizes } = useSizes();
  const { colors } = useColors();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productSizes = sizes.find((s) => s.product_slug === product.product_slug)?.sizes || [];
  const productColorsRaw = colors.find((c) => c.product_slug === product.product_slug)?.colors || [];
  const productColors = productColorsRaw.map((c) => ({
    id: c.id ?? c.value ?? null,
    name: (c.label || c.name || c.color || "").toString().trim(),
    hex: c.hex || c.hexCode || c.value || null,
    stock: Number(c.stock ?? c.qty ?? 0),
  }));

  const sellingPrice = parseFloat(product.selling_price) || 0;
  const regularPrice = parseFloat(product.regular_price) || 0;
  const discountPct =
    regularPrice > sellingPrice && regularPrice > 0
      ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (Number(product.avilable_stock) === 0) {
      Swal.fire({ icon: "error", title: "Out of Stock", text: "This product is currently out of stock." });
      return;
    }
    if (productSizes.length > 0 || productColors.length > 0) {
      setSelectedProduct(product);
      setModalOpen(true);
    } else {
      addToCart({ ...product, size: null, colorName: null, colorHex: null, colorObj: null, quantity: 1 });
    }
  };

  const handleSelectionComplete = (sizeLabel, colorObj) => {
    const nc = colorObj
      ? { id: colorObj.id, name: (colorObj.label || colorObj.name || "").toString().trim(), hex: colorObj.hex || null, stock: Number(colorObj.stock ?? 0) }
      : null;
    addToCart({ ...selectedProduct, size: sizeLabel || null, colorName: nc?.name || null, colorHex: nc?.hex || null, colorObj: nc, quantity: 1 });
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div style={cardStyle} onClick={() => navigate(product.link)}>
        {/* Image */}
        <div style={imgWrapStyle}>
          {!imgLoaded && (
            <Skeleton variant="rectangular"
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", bgcolor: "grey.200" }}
              animation="wave"
            />
          )}
          <img
            src={product.img}
            alt={product.title}
            style={{ ...imgStyle, opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        
        
        </div>

        {/* Price row */}
        <div style={priceRowStyle}>
          <span style={priceCurrentStyle}>৳{sellingPrice.toLocaleString()}</span>
          {regularPrice > sellingPrice && (
            <span style={priceOldStyle}>৳{regularPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart button — full width black */}
        <button
          style={{
            ...cartBtnStyle,
            opacity: Number(product.avilable_stock) === 0 ? 0.45 : 1,
            cursor: Number(product.avilable_stock) === 0 ? "not-allowed" : "pointer",
          }}
          onClick={handleAddToCart}
          disabled={Number(product.avilable_stock) === 0}
        >
          + Add to Cart
        </button>
      </div>

      <SizeModal
        product={selectedProduct}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedProduct(null); }}
        onSelectionComplete={handleSelectionComplete}
        productSizes={productSizes}
        productColors={productColors}
      />
    </>
  );
}

/* ── Styles (matching screenshot exactly) ── */
const cardStyle = {
  background: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  transition: "box-shadow 0.2s, transform 0.2s",
  display: "flex",
  flexDirection: "column",
};

const imgWrapStyle = {
  position: "relative",
  paddingBottom: "110%",
  overflow: "hidden",
  background: "#f5f5f5",
};

const imgStyle = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.38s ease",
};

const badgeStyle = {
  position: "absolute",
  top: 8, left: 8,
  background: "#e53935",
  color: "#fff",
  fontSize: "0.7rem",
  fontWeight: 700,
  padding: "2px 7px",
  borderRadius: "4px",
  zIndex: 2,
};

const wishBtnStyle = {
  position: "absolute",
  top: 8, right: 8,
  width: 30, height: 30,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.9)",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.95rem",
  color: "#bbb",
  zIndex: 2,
  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
};

const priceRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 10px 4px",
};

const priceCurrentStyle = {
  fontSize: "0.9rem",
  fontWeight: 800,
  color: "#111",
};

const priceOldStyle = {
  fontSize: "0.78rem",
  color: "#bbb",
  textDecoration: "line-through",
};

const cartBtnStyle = {
  width: "100%",
  padding: "10px 0",
  background: "#111",
  color: "#fff",
  border: "none",
  fontSize: "0.82rem",
  fontWeight: 700,
  letterSpacing: "0.03em",
  marginTop: "auto",
  transition: "background 0.15s",
};

/* ── Main RelatedProducts component ── */
function RelatedProducts({ products = [], slug, category_slug, sub_category_slug }) {
  const filteredProducts = products.filter(
    (p) =>
      p.product_slug !== slug &&
      (p.category_slug === category_slug || p.sub_category_slug === sub_category_slug)
  );

  return (
    <div className="container pb-5">
      <div style={{ borderBottom: "2px solid #eee", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
        <h5 style={{ fontWeight: 700, color: "#111", margin: 0 }}>You may also like</h5>
      </div>

      {filteredProducts.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={6}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={filteredProducts.length > 6}
          style={{ paddingBottom: "2.5rem" }}
          breakpoints={{
            1400: { slidesPerView: 6, spaceBetween: 12 },
            1100: { slidesPerView: 5, spaceBetween: 12 },
            900:  { slidesPerView: 4, spaceBetween: 10 },
            600:  { slidesPerView: 3, spaceBetween: 10 },
            0:    { slidesPerView: 2, spaceBetween: 8  },
          }}
        >
          {filteredProducts.map((p, index) => (
            <SwiperSlide key={index}>
              <RelatedCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-muted mt-4">No related products found.</p>
      )}
    </div>
  );
}

export default RelatedProducts;