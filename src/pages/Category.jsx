import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import useCategories from "../data/useCategories";
import "../assets/css/shop.css";

const SPECIAL_OFFERS = [
  { label: "New Arrival",        key: "new_arrival" },
  { label: "Top Selling",        key: "top_selling" },
  { label: "Trending Products",  key: "trending" },
  { label: "Top Rated Products", key: "top_rated" },
];

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="fl-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton variant="rectangular" width="100%" height={220}
            sx={{ borderRadius: 2, bgcolor: "grey.200" }} animation="wave" />
          <Skeleton variant="text" width="82%" height={17}
            sx={{ mt: 1, bgcolor: "grey.200" }} animation="wave" />
          <Skeleton variant="text" width="55%" height={15}
            sx={{ bgcolor: "grey.200" }} animation="wave" />
        </div>
      ))}
    </div>
  );
}

function Category() {
  const { slug } = useParams();
  const { categories, loading: loadingCats } = useCategories();

  // ── original state (unchanged) ──
  const [products, setProducts]     = useState([]);
  const [category, setCategory]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice]     = useState("");
  const [maxPrice, setMaxPrice]     = useState("");
  const [sortBy, setSortBy]         = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // ── extra UI state ──
  const [selectedOffer, setSelectedOffer]         = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // ── original fetch (unchanged) ──
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SHOP_URL;
        const res  = await fetch(API_URL);
        const data = await res.json();

        const categoryProducts = data.filter(p => p.category_slug === slug);
        setProducts(categoryProducts);

        if (categoryProducts.length > 0) {
          const prices = categoryProducts.map(p => parseFloat(p.selling_price) || parseFloat(p.price) || 0);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setPriceRange({ min, max });
          setMinPrice(min);
          setMaxPrice(max);
          setCategory({
            title: categoryProducts[0].category || slug,
            description: `Browse our collection of ${categoryProducts[0].category || slug} products`,
          });
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [slug]);

  // ── original filter logic (unchanged) + offer filter ──
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(search) ||
        p.product_keyword?.toLowerCase().includes(search) ||
        p.short_description?.toLowerCase().includes(search)
      );
    }

    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    filtered = filtered.filter(p => {
      const price = parseFloat(p.selling_price) || parseFloat(p.price) || 0;
      return price >= min && price <= max;
    });

    if (selectedOffer === "new_arrival")  filtered = filtered.filter(p => p.product_type === "new_arrival");
    else if (selectedOffer === "top_selling") filtered = filtered.filter(p => p.product_type === "top_selling");
    else if (selectedOffer === "trending")    filtered = filtered.filter(p => p.product_type === "trending");
    else if (selectedOffer === "top_rated")   filtered = filtered.filter(p => p.product_type === "top_rated");

    if (sortBy === "low_to_high")
      filtered.sort((a, b) => (parseFloat(a.selling_price) || 0) - (parseFloat(b.selling_price) || 0));
    else if (sortBy === "high_to_low")
      filtered.sort((a, b) => (parseFloat(b.selling_price) || 0) - (parseFloat(a.selling_price) || 0));
    else if (sortBy === "a_z")
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "z_a")
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    else if (sortBy === "newest")
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return filtered;
  }, [products, searchTerm, minPrice, maxPrice, selectedOffer, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSortBy("");
    setSelectedOffer("");
  };

  // ── sidebar (shared desktop + mobile) ──
  const SidebarContent = () => (
    <div className="fl-sidebar">

      {/* Special Offers */}
      <p className="fl-section-title">Special Offers</p>
      <ul className="fl-offer-list">
        {SPECIAL_OFFERS.map(offer => (
          <li key={offer.key}>
            <span
              className={`fl-offer-item${selectedOffer === offer.key ? " active" : ""}`}
              onClick={() => setSelectedOffer(selectedOffer === offer.key ? "" : offer.key)}
            >
              <span className="fl-bolt" style={{ color: "#f39c12" }}>⚡</span>
              {offer.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="fl-sidebar-divider" />

      {/* Categories list — all categories, current one highlighted */}
      <p className="fl-cat-section-title">Categories</p>

{loadingCats ? (
  Array.from({ length: 4 }).map((_, i) => (
    <Skeleton key={i} variant="text" width="80%" height={28}
      sx={{ mx: "1.1rem", mb: 0.5, bgcolor: "grey.100" }} animation="wave" />
  ))
) : categories.map((cat, i) => {
  const isActive = cat.slug === slug || cat.link?.includes(slug);
  const subCats  = cat.sub_category || [];

  return (
    <div key={cat.id || i} className="fl-cat-group">
      {/* Main category row */}
      <a href={cat.link} style={{ textDecoration: "none" }}>
        <div className={`fl-main-cat${isActive ? " active" : ""}`}>
          <div className="fl-main-cat-left">
            {cat.img && (
              <img src={cat.img} alt=""
                style={{ width: 20, height: 20, borderRadius: 3, objectFit: "cover" }} />
            )}
            <span className="fl-main-cat-name">{cat.title}</span>
            {subCats.length > 0 && (
              <span className="fl-main-cat-count">{subCats.length}</span>
            )}
          </div>
          <i className="ri-arrow-right-s-line fl-main-cat-arrow"></i>
        </div>
      </a>

      {/* Subcategories — only show under active category */}
      {isActive && subCats.length > 0 && (
        <ul className="fl-subcat-list">
          {subCats.map((sub, j) => (
            <li key={sub.id || j} className="fl-subcat-item">
              <a href={sub.link} style={{ textDecoration: "none" }}>
                <div className="fl-subcat-row">
                  <span className="fl-subcat-name">{sub.title}</span>
                  {sub.product_count !== undefined && (
                    <span className="fl-subcat-count">{sub.product_count}</span>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
})}

      <div className="fl-sidebar-divider" />

      {/* Clear */}
      <div style={{ padding: "0.6rem 1.1rem" }}>
        <button onClick={handleClearFilters} style={{
          width: "100%", padding: "7px 0", background: "transparent",
          border: "1px solid #e0e0e0", borderRadius: 7, fontSize: "0.82rem",
          color: "#666", cursor: "pointer", transition: "border-color 0.2s",
        }}
          onMouseOver={e => e.target.style.borderColor = "#111"}
          onMouseOut={e  => e.target.style.borderColor = "#e0e0e0"}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="fl-shop-outer">
        <div className="fl-shop-page">

          {/* Desktop sidebar */}
          <div className="d-none d-md-block" style={{ flexShrink: 0 }}>
            <SidebarContent />
          </div>

          {/* Content */}
          <div className="fl-content">

            {/* Mobile toggle */}
            <button className="fl-mobile-toggle d-md-none" style={{ display: "flex" }}
              onClick={() => setShowMobileSidebar(p => !p)}>
              <i className={`ri-${showMobileSidebar ? "close" : "equalizer-2"}-line`}></i>
              {showMobileSidebar ? "Close Filters" : "Filters & Categories"}
            </button>
            <div className={`fl-mobile-sidebar d-md-none${showMobileSidebar ? " open" : ""}`}>
              <SidebarContent />
            </div>

            {/* Search */}
            <div className="fl-search-wrap">
              <i className="ri-search-line fl-search-icon"></i>
              <input type="search" className="fl-search-input"
                placeholder="Search a product"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category title pill — just the current category name, like Shop pills */}
            {/* All category titles as pills — current one selected */}
            <div className="fl-cat-pills">
              {loadingCats ? (
                [90,80,100,75,90].map((w, i) => (
                  <Skeleton key={i} variant="rectangular" width={w} height={34}
                    sx={{ borderRadius: "24px", bgcolor: "grey.200" }} animation="wave" />
                ))
              ) : categories.map((cat, i) => {
                const isActive = cat.slug === slug || cat.link?.includes(slug);
                const colours = ["pill-men","pill-women","pill-kids","pill-teens","pill-sports","pill-other"];
                return (
                  <a key={cat.id || i} href={cat.link} style={{ textDecoration: "none" }}>
                    <span className={`fl-cat-pill ${colours[i] || "pill-other"}${isActive ? " selected" : ""}`}>
                      {cat.title}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Topbar */}
            <div className="fl-topbar">
              <span className="fl-product-count">
                {loading
                  ? <Skeleton variant="text" width={100} />
                  : <><strong>{filteredProducts.length}</strong> Products</>}
              </span>
              <select className="fl-sort-select" value={sortBy}
                onChange={e => setSortBy(e.target.value)}>
                <option value="">Sort: Relevance</option>
                <option value="newest">Newest First</option>
                <option value="low_to_high">Price: Low → High</option>
                <option value="high_to_low">Price: High → Low</option>
                <option value="a_z">Name: A → Z</option>
                <option value="z_a">Name: Z → A</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? <SkeletonGrid count={12} /> : (
              <div className="fl-products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, i) => (
                    <ProductCard key={i} product={product} />
                  ))
                ) : (
                  <div className="fl-empty">
                    <i className="ri-inbox-line"></i>
                    <p>No products found.</p>
                    <button className="fl-empty-btn" onClick={handleClearFilters}>
                      Clear Filters
                    </button>
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

export default Category;