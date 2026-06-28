import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import Skeleton from '@mui/material/Skeleton';

function SubCategory() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchSubCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all products
        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SHOP_URL;
        const res = await fetch(API_URL);
        const data = await res.json();

        // Filter products by subcategory slug
        const subCategoryProducts = data.filter(p => p.sub_category_slug === slug);
        setProducts(subCategoryProducts);

        // Set price range
        if (subCategoryProducts.length > 0) {
          const prices = subCategoryProducts.map(p => parseFloat(p.selling_price) || parseFloat(p.price) || 0);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setPriceRange({ min, max });
          setMinPrice(min);
          setMaxPrice(max);

          // Set subcategory and parent category info
          setSubCategory({
            title: subCategoryProducts[0].sub_category || slug,
          });
          setParentCategory({
            title: subCategoryProducts[0].category || "Categories"
          });
        }

      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategoryProducts();
  }, [slug]);

  // Filter & Sort
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

    if (sortBy === "low_to_high") {
      filtered.sort((a, b) => (parseFloat(a.selling_price) || parseFloat(a.price) || 0) - (parseFloat(b.selling_price) || parseFloat(b.price) || 0));
    } else if (sortBy === "high_to_low") {
      filtered.sort((a, b) => (parseFloat(b.selling_price) || parseFloat(b.price) || 0) - (parseFloat(a.selling_price) || parseFloat(a.price) || 0));
    } else if (sortBy === "a_z") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "z_a") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
  }, [products, searchTerm, minPrice, maxPrice, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSortBy("");
  };

  return (
    <>
      <Header />

      <section className="pt-3 pt-md-5">
        <div className="container">
          <h1 className="text-capitalize">{subCategory?.title || slug}</h1>
          <p>{parentCategory?.title || "Categories"} / {subCategory?.title || slug}</p>
          <br />

          {/* Mobile Filter Toggle Button */}
          <div className="d-md-none mb-3">
            <button
              className="btn btn-dark w-100"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              {showMobileFilters ? "Hide Filters ▲" : "Show Filters ▼"}
            </button>
          </div>

          <div className="row">

            {/* MOBILE FILTER PANEL */}
            <div className="col-12 d-md-none">
              <div className={`mobile-filter-box ${showMobileFilters ? "open" : ""}`}>
                <aside className="shop-sidebar">
                  {/* --- FILTER CONTENT (same as desktop) --- */}
                  <div className="mb-3">
                    <label className="filter-title">Search</label>
                    <input 
                      type="search"
                      className="form-control"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="filter-title">Price (৳)</label>
                    <div className="d-flex gap-2 mb-2">
                      <input 
                        type="number"
                        className="form-control"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <input 
                        type="number"
                        className="form-control"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="filter-title">Sort</label>
                    <select 
                      className="form-control"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="">Relevance</option>
                      <option value="low_to_high">Price: Low → High</option>
                      <option value="high_to_low">Price: High → Low</option>
                      <option value="a_z">Name: A → Z</option>
                      <option value="z_a">Name: Z → A</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>

                  <div className="filter-actions mt-3">
                    <button className="btn btn-dark btn-modern w-100" onClick={() => setShowMobileFilters(false)}>Apply</button>
                    <button 
                      className="btn clear-btn btn-modern w-100"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </button>
                  </div>
                </aside>
              </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <div className="col-md-3 d-none d-md-block mb-4">
              <aside className="shop-sidebar sidebar-sticky">
                
                <div className="mb-3">
                  <label className="filter-title">Search</label>
                  <input 
                    type="search"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="filter-title">Price (৳)</label>
                  <div className="d-flex gap-2 mb-2">
                    <input 
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input 
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="filter-title">Sort</label>
                  <select 
                    className="form-control"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="">Relevance</option>
                    <option value="low_to_high">Price: Low → High</option>
                    <option value="high_to_low">Price: High → Low</option>
                    <option value="a_z">Name: A → Z</option>
                    <option value="z_a">Name: Z → A</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <div className="mb-3">
                  {/* <label className="filter-title">Stats</label> */}
                  <div className="stats-card">
                    <div className="d-flex justify-content-between mb-2 small">
                      <span className="text-muted">Total Products:</span>
                      <span className="fw-semibold">{products.length}</span>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Showing:</span>
                      <span className="fw-semibold">{filteredProducts.length}</span>
                    </div>
                  </div>
                </div>

                <div className="filter-actions mt-3">
                  <button className="btn btn-dark btn-modern w-100">Apply</button>
                  <button 
                    className="btn clear-btn btn-modern w-100"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                </div>

              </aside>
            </div>

            {/* PRODUCTS */}
            <div className="col-md-9 mb-4">
              <div id="productGridContainer">
                <div className="grid-container-4x">
                  {loading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
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
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <ProductCard key={index} product={product} />
                    ))
                  ) : (
                    <div className="col-12 empty-state">
                      <p className="text-center fw-bold text-muted w-100">
                        No products found!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .container-fluid { padding-left: 0; padding-right: 0; }
        .filter-actions { display:flex; gap:10px; }
        .shop-sidebar {
          background: #ffffff;
          border-radius: 12px;
          padding: 18px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, 
                      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
        }
        .clear-btn { 
          background: transparent; 
          border: 1px solid #ddd; 
          color: #333; 
        }
        .clear-btn:hover { 
          background: #333; 
          border: 1px solid #ddd; 
          color: #ffffffff;  
        }

        .filter-title {
          font-weight: 700;
          margin-bottom: .5rem;
        }

        .btn-modern {
          border-radius: 10px;
          padding: 8px 12px;
          font-size: .92rem;
        }

        .stats-card {
          background: #f9fafb;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .empty-state {
          text-align:center;
          padding: 40px 10px;
          color:#6b7280;
        }

        /* Mobile slide filter */
        .mobile-filter-box {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          border-radius: 12px;
          margin-bottom: 7px;
        }

        .mobile-filter-box.open {
          max-height: 1000px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, 
                      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px
        }

        @media (max-width: 768px) {
          .sidebar-sticky {
            position: static !important;
          }
        }
      `}</style>
    </>
  );
}

export default SubCategory;