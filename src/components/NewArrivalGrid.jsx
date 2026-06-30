import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";



export default function NewArrivalGrid({ products = [], isLoading = false, title = "" }) {

  if (isLoading) {
    return (
      <>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>{title}</h2>
          <div style={s.titleUnderline}></div>
        </div>
        <div style={s.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{ aspectRatio: "1/1", borderRadius: "10px", bgcolor: "grey.300" }}
                animation="wave"
              />
              <Skeleton variant="text" width="80%" height={18} sx={{ mt: 1, bgcolor: "grey.200" }} animation="wave" />
              <Skeleton variant="text" width="50%" height={16} sx={{ mt: 0.5, bgcolor: "grey.200" }} animation="wave" />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── Section header ── */}
      <div style={s.sectionHeader}>
        <h2 style={s.sectionTitle}>{title}</h2>
        <div style={s.titleUnderline}></div>
      </div>

      {/* ── Product grid ── */}
      <div style={s.grid}>
        {products.map((product, i) => {
          const disc =
            product.regular_price && product.selling_price
              ? Math.round(
                  ((product.regular_price - product.selling_price) / product.regular_price) * 100
                )
              : 0;

          return (
            <Link
              key={product.id ?? i}
              to={`/product/${product.product_slug}`}
              style={s.cardLink}
              className="na-card"
            >
              {/* Image */}
              <div style={s.cardImgWrap}>
                {disc > 0 && <span style={s.cardDisc}>{disc}%</span>}
                <img
                  src={product.img}
                  alt={product.title}
                  style={s.cardImg}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>

              {/* Info */}
              <div style={s.cardBody}>
                <p style={s.cardName}>{product.title}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={s.cardPrice}>৳{product.selling_price}</span>
                  {product.regular_price > product.selling_price && (
                    <span style={s.cardOldPrice}>৳{product.regular_price}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Inline hover styles — no JS needed */}
      <style>{`
        .na-card {
          text-decoration: none !important;
          color: inherit;
          display: block;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .na-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          border-color: #ccc;
          color: inherit;
        }
        .na-card:hover img {
          transform: scale(1.04);
        }
      `}</style>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = {
  sectionHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: "700",
    letterSpacing: "4px",
    color: "#C8813A",
    marginBottom: "10px",
  },
  titleUnderline: {
    width: "60px",
    height: "3px",
    background: "#C8813A",
    margin: "0 auto",
    borderRadius: "2px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "12px",
  },
  // cardLink: base styles now live in .na-card CSS class above (hover needs CSS)
  cardLink: {
    // keeps React inline style for non-hover defaults
    textDecoration: "none",
    color: "inherit",
  },
  cardImgWrap: {
    position: "relative",
    overflow: "hidden",
    background: "#f8f9fa",
  },
  cardImg: {
    display: "block",
    width: "100%",
    aspectRatio: "1 / 1",
    objectFit: "cover",
    transition: "transform 0.35s ease",
  },
  cardDisc: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    padding: "2px 7px",
    borderRadius: "4px",
    zIndex: 1,
    letterSpacing: "0.5px",
  },
  cardBody: {
    padding: "10px 12px 12px",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "5px",
    margin: "0 0 5px 0",
  },
  cardPrice: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#C8813A",
  },
  cardOldPrice: {
    fontSize: "11px",
    color: "#9ca3af",
    textDecoration: "line-through",
  },
};