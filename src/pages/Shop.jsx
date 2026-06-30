import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SidebarContent from "../components/SidebarContent";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import useSizes from "../data/useSizes";
import useColors from "../data/useColors";
import useCategories from "../data/useCategories";
import SizeModal from "../components/SizeModal";
import Swal from "sweetalert2";
import "../assets/css/shop.css";

/* ─────────────────────────────────────────
   Tiny inline product card (Fabrilife style)
   ───────────────────────────────────────── */
function FlProductCard({ product }) {
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
  const saved = regularPrice > sellingPrice ? Math.round(regularPrice - sellingPrice) : 0;
  const discountPct =
    regularPrice > 0 && sellingPrice < regularPrice
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
    const nc = colorObj ? { id: colorObj.id, name: (colorObj.label || colorObj.name || "").toString().trim(), hex: colorObj.hex || null, stock: Number(colorObj.stock ?? 0) } : null;
    addToCart({ ...selectedProduct, size: sizeLabel || null, colorName: nc?.name || null, colorHex: nc?.hex || null, colorObj: nc, quantity: 1 });
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="fl-product-card" onClick={() => navigate(product.link)}>
        <div className="fl-card-img-wrap">
          {!imgLoaded && (
            <Skeleton variant="rectangular" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", bgcolor: "grey.200" }} animation="wave" />
          )}
          <img
            src={product.img}
            alt={product.title}
            className="fl-card-img"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
          {discountPct > 0 && <span className="fl-discount-badge">-{discountPct}%</span>}
          <button
            className="fl-card-cart-btn fl-card-wish-btn"
            onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
            title="Add to wishlist"
          >
            <i className="ri-heart-line"></i>
          </button>
        </div>
        <div className="fl-card-body">
          <p className="fl-card-title">{product.title}</p>
          {saved > 0 && (
            <span className="fl-save-badge">
              <i className="ri-tag-line"></i> Save ৳{saved}
            </span>
          )}
          <div className="fl-price-row">
            <span className="fl-price-current">৳{sellingPrice.toLocaleString()}</span>
            {regularPrice > sellingPrice && (
              <>
                <span className="fl-price-old">৳{regularPrice.toLocaleString()}</span>
                {discountPct > 0 && <span className="fl-price-pct">-{discountPct}%</span>}
              </>
            )}
          </div>
        </div>
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

/* ─────────────────────────────────────────
   Skeleton grid
   ───────────────────────────────────────── */
function SkeletonGrid({ count = 12 }) {
  return (
    <div className="fl-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton variant="rectangular" width="100%" height={220} sx={{ borderRadius: 2, bgcolor: "grey.200" }} animation="wave" />
          <Skeleton variant="text" width="82%" height={17} sx={{ mt: 1, bgcolor: "grey.200" }} animation="wave" />
          <Skeleton variant="text" width="55%" height={15} sx={{ bgcolor: "grey.200" }} animation="wave" />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SPECIAL OFFERS config
   ───────────────────────────────────────── */
const SPECIAL_OFFERS = [
  { label: "New Arrival", key: "new_arrival" },
  { label: "Top Selling", key: "top_selling" },
  { label: "Trending Products", key: "trending" },
  { label: "Top Rated Products", key: "top_rated" },
];

/* pill colours per category index */
const PILL_COLOURS = [
  "pill-men", "pill-women", "pill-kids", "pill-teens",
  "pill-sports", "pill-other", "pill-other", "pill-other",
];

/* ─────────────────────────────────────────
   MAIN SHOP PAGE
   ───────────────────────────────────────── */
function Shop() {
  /* --- data --- */
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { categories, loading: loadingCats } = useCategories();

  /* --- filter state --- */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMainCat, setSelectedMainCat] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  /* expanded main categories in sidebar */
  const [expandedCat, setExpandedCat] = useState("");

  /* mobile sidebar */
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  /* --- fetch products --- */
  useEffect(() => {
    (async () => {
      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SHOP_URL;
        const res = await fetch(API_URL);
        const data = await res.json();
        setProducts(data);
        if (data.length > 0) {
          const prices = data.map((p) => parseFloat(p.selling_price)).filter(Boolean);
          setPriceRange({ min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) });
          setMinPrice(Math.floor(Math.min(...prices)));
          setMaxPrice(Math.ceil(Math.max(...prices)));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  /* --- filtered products --- */
  const filteredProducts = useMemo(() => {
    let f = [...products];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      f = f.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.product_keyword?.toLowerCase().includes(s) ||
          p.short_description?.toLowerCase().includes(s)
      );
    }

    if (selectedMainCat) f = f.filter((p) => p.category === selectedMainCat);
    if (selectedSubCat) f = f.filter((p) => p.sub_category === selectedSubCat);

    if (selectedOffer === "new_arrival")
      f = f.filter((p) => p.product_type === "new_arrival");
    else if (selectedOffer === "top_selling")
      f = f.filter((p) => p.product_type === "top_selling");
    else if (selectedOffer === "trending")
      f = f.filter((p) => p.product_type === "trending");
    else if (selectedOffer === "top_rated")
      f = f.filter((p) => p.product_type === "top_rated");

    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    f = f.filter((p) => {
      const price = parseFloat(p.selling_price) || 0;
      return price >= min && price <= max;
    });

    if (sortBy === "low_to_high") f.sort((a, b) => parseFloat(a.selling_price) - parseFloat(b.selling_price));
    else if (sortBy === "high_to_low") f.sort((a, b) => parseFloat(b.selling_price) - parseFloat(a.selling_price));
    else if (sortBy === "a_z") f.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "z_a") f.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    else if (sortBy === "newest") f.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return f;
  }, [products, searchTerm, selectedMainCat, selectedSubCat, selectedOffer, minPrice, maxPrice, sortBy]);

  const clearAll = () => {
    setSearchTerm("");
    setSelectedMainCat("");
    setSelectedSubCat("");
    setSelectedOffer("");
    setSortBy("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
  };

  /* ── category pills from API data ── */
  const pillCategories = useMemo(() => {
    return categories.map((cat, idx) => ({
      title: cat.title,
      colourClass: PILL_COLOURS[idx] || "pill-other",
    }));
  }, [categories]);

  return (
    <>
      <Header />

      <div className="fl-shop-outer">
        <div className="fl-shop-page">
          {/* ── Desktop Left Sidebar ── */}
          <div className="d-none d-md-block" style={{ flexShrink: 0 }}>
            <SidebarContent
              categories={categories}
              loadingCategories={loadingCats}
              selectedMainCat={selectedMainCat}
              selectedSubCat={selectedSubCat}
              selectedOffer={selectedOffer}
              setSelectedMainCat={setSelectedMainCat}
              setSelectedSubCat={setSelectedSubCat}
              setSelectedOffer={setSelectedOffer}
              expandedCat={expandedCat}
              setExpandedCat={setExpandedCat}
              clearAll={clearAll}
            />
          </div>

          {/* ── Right Content ── */}
          <div className="fl-content">
            {/* Mobile sidebar toggle */}
            <button
              className="fl-mobile-toggle d-md-none"
              style={{ display: "flex" }}
              onClick={() => setShowMobileSidebar((p) => !p)}
            >
              <i className={`ri-${showMobileSidebar ? "close" : "equalizer-2"}-line`}></i>
              {showMobileSidebar ? "Close Filters" : "Filters & Categories"}
            </button>

            {/* Mobile sidebar panel */}
            <div className={`fl-mobile-sidebar d-md-none${showMobileSidebar ? " open" : ""}`}>
              <SidebarContent
                categories={categories}
                loadingCategories={loadingCats}
                selectedMainCat={selectedMainCat}
                selectedSubCat={selectedSubCat}
                selectedOffer={selectedOffer}
                setSelectedMainCat={setSelectedMainCat}
                setSelectedSubCat={setSelectedSubCat}
                setSelectedOffer={setSelectedOffer}
                expandedCat={expandedCat}
                setExpandedCat={setExpandedCat}
                clearAll={clearAll}
              />
            </div>

            {/* Search bar */}
            <div className="fl-search-wrap">
              <i className="ri-search-line fl-search-icon"></i>
              <input
                type="search"
                className="fl-search-input"
                placeholder="Search a product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category pills */}
            {pillCategories.length > 0 && (
              <div className="fl-cat-pills">
                <span
                  className={`fl-cat-pill pill-all${!selectedMainCat ? " selected" : ""}`}
                  onClick={() => { setSelectedMainCat(""); setSelectedSubCat(""); setExpandedCat(""); }}
                >
                  All
                </span>
                {pillCategories.map((pill, i) => (
                  <span
                    key={i}
                    className={`fl-cat-pill ${pill.colourClass}${selectedMainCat === pill.title ? " selected" : ""}`}
                    onClick={() => {
                      if (selectedMainCat === pill.title) {
                        setSelectedMainCat(""); setSelectedSubCat(""); setExpandedCat("");
                      } else {
                        setSelectedMainCat(pill.title); setSelectedSubCat(""); setExpandedCat(pill.title);
                      }
                      setSelectedOffer("");
                    }}
                  >
                    {pill.title}
                  </span>
                ))}
              </div>
            )}

            {/* Topbar */}
            <div className="fl-topbar">
              <span className="fl-product-count">
                {loadingProducts ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <><strong>{filteredProducts.length}</strong> Products</>
                )}
              </span>
              <select
                className="fl-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort: Relevance</option>
                <option value="newest">Newest First</option>
                <option value="low_to_high">Price: Low → High</option>
                <option value="high_to_low">Price: High → Low</option>
                <option value="a_z">Name: A → Z</option>
                <option value="z_a">Name: Z → A</option>
              </select>
            </div>

            {/* Product grid */}
            {loadingProducts ? (
              <SkeletonGrid count={12} />
            ) : (
              <div className="fl-products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, i) => (
                    <FlProductCard key={i} product={product} />
                  ))
                ) : (
                  <div className="fl-empty">
                    <i className="ri-inbox-line"></i>
                    <p>No products found matching your filters.</p>
                    <button className="fl-empty-btn" onClick={clearAll}>Clear Filters</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Shop;