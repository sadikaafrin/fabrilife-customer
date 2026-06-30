import Skeleton from "@mui/material/Skeleton";

const SPECIAL_OFFERS = [
  { label: "New Arrival", key: "new_arrival" },
  { label: "Top Selling", key: "top_selling" },
  { label: "Trending Products", key: "trending" },
  { label: "Top Rated Products", key: "top_rated" },
];

function SidebarContent({
  // Categories data
  categories = [],
  loadingCategories = false,
  
  // Selected filters
  selectedMainCat,
  selectedSubCat,
  selectedOffer,
  
  // State setters
  setSelectedMainCat,
  setSelectedSubCat,
  setSelectedOffer,
  
  // Expanded category
  expandedCat,
  setExpandedCat,
  
  // Clear all filters
  clearAll,
  
  // Optional: hide clear button
  hideClearButton = false,
  
  // Additional className
  className = "",
}) {
  
  const handleMainCatClick = (catTitle) => {
    if (selectedMainCat === catTitle) {
      setSelectedMainCat("");
      setSelectedSubCat("");
      setExpandedCat("");
    } else {
      setSelectedMainCat(catTitle);
      setSelectedSubCat("");
      setExpandedCat(catTitle);
    }
    setSelectedOffer("");
  };

  const handleSubCatClick = (e, subTitle) => {
    e.stopPropagation();
    setSelectedSubCat(selectedSubCat === subTitle ? "" : subTitle);
  };

  return (
    <div className={`fl-sidebar ${className}`}>
      {/* Special Offers */}
      <p className="fl-section-title">Special Offers</p>
      <ul className="fl-offer-list">
        {SPECIAL_OFFERS.map((offer) => (
          <li key={offer.key}>
            <span
              className={`fl-offer-item${selectedOffer === offer.key ? " active" : ""}`}
              onClick={() => {
                setSelectedOffer(selectedOffer === offer.key ? "" : offer.key);
                setSelectedMainCat("");
                setSelectedSubCat("");
              }}
            >
              <span className="fl-bolt" style={{ color: "#f39c12" }}>⚡</span>
              {offer.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="fl-sidebar-divider" />

      {/* Categories */}
      <p className="fl-cat-section-title">Categories</p>

      {loadingCategories
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton 
              key={i} 
              variant="text" 
              width="80%" 
              height={28} 
              sx={{ mx: "1.1rem", mb: 0.5, bgcolor: "grey.100" }} 
              animation="wave" 
            />
          ))
        : categories.map((cat, idx) => {
            const isExpanded = expandedCat === cat.title;
            const isActive = selectedMainCat === cat.title;
            const subCats = cat.sub_category || [];
            return (
              <div key={cat.id || idx}>
                <div
                  className={`fl-main-cat${isActive ? " active" : ""}`}
                  onClick={() => handleMainCatClick(cat.title)}
                >
                  <div className="fl-main-cat-left">
                    {cat.img && (
                      <img 
                        src={cat.img} 
                        alt="" 
                        style={{ width: 20, height: 20, borderRadius: 3, objectFit: "cover" }} 
                      />
                    )}
                    <span className="fl-main-cat-name">{cat.title}</span>
                    {subCats.length > 0 && (
                      <span className="fl-main-cat-count">{subCats.length}</span>
                    )}
                  </div>
                  <i className="ri-arrow-right-s-line fl-main-cat-arrow"></i>
                </div>

                {/* Subcategories */}
                <div className={`fl-sub-list${isExpanded ? " open" : ""}`}>
                  {subCats.map((sub, si) => (
                    <span
                      key={sub.id || si}
                      className={`fl-sub-item${selectedSubCat === sub.title ? " active" : ""}`}
                      onClick={(e) => handleSubCatClick(e, sub.title)}
                    >
                      {sub.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

      <div className="fl-sidebar-divider" />

      {/* Clear All Button */}
      {!hideClearButton && (
        <div style={{ padding: "0.6rem 1.1rem" }}>
          <button
            onClick={clearAll}
            style={{
              width: "100%", 
              padding: "7px 0", 
              background: "transparent",
              border: "1px solid #e0e0e0", 
              borderRadius: 7, 
              fontSize: "0.82rem",
              color: "#666", 
              cursor: "pointer", 
              transition: "border-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.borderColor = "#111")}
            onMouseOut={(e) => (e.target.style.borderColor = "#e0e0e0")}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default SidebarContent;