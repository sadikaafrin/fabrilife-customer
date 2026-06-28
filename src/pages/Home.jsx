import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useSliders from "../data/useSliders";
import useBanners from "../data/useBanners";
import useCategories from "../data/useCategories";
import useProducts from "../data/useProducts";
import ProductCard from "../components/ProductCard";
import InfoArea from "../components/InfoArea";

// ===== REUSABLE STYLE OBJECTS =====
const styles = {
  section: {
    padding: "1rem 0",
    "@media (min-width: 768px)": {
      padding: "3rem 0",
    },
  },
  sectionWithBg: {
    padding: "1rem 0",
    backgroundColor: "#f8f9fa",
    "@media (min-width: 768px)": {
      padding: "3rem 0",
    },
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#1a1a1a",
  },
  titleUnderline: {
    marginBottom: "5px",
    width: "80px",
    height: "4px",
    background: "linear-gradient(90deg, #000 0%, #666 100%)",
  },
  navigationButton: {
    width: "50px",
    height: "50px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    border: "2px solid #e5e5e5",
    background: "#fff",
    color: "#1a1a1a",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  navigationIcon: {
    fontSize: "22px",
  },
  categoryCard: {
    background: "#f8f9fa",
    borderRadius: "16px",
    padding: "10px",
    border: "1px solid #c9c9c9",
    transition: "all 0.3s ease",
    overflow: "hidden",
    position: "relative",
  },
  categoryImageWrapper: {
    position: "relative",
    paddingBottom: "100%",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#fff",
  },
  categoryImage: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  categoryTitle: {
    color: "#1a1a1a",
    fontSize: "0.95rem",
    lineHeight: "1.4",
    marginTop: "0.75rem",
    marginBottom: "0",
    fontWeight: "600",
  },
  banner: {
    borderRadius: "10px",
    boxShadow: "0 2px 4px #0000001a",
    objectFit: "cover",
    height: "100%",
  },
  carouselImage: {
    objectFit: "cover",
  },
  appBadge: {
    background: "#2d2d2d",
    padding: "5px 14px",
    borderRadius: "4px",
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#ffffff",
    textDecoration: "none",
  },
  appBadgeIcon: {
    fontSize: "16px",
  },
  promoBanner: {
    background: "#f5f5f5",
    padding: "12px 0",
    textAlign: "center",
    fontSize: "14px",
    borderBottom: "1px solid #e5e5e5",
    color: "#333",
    marginTop: "10px",
    marginBottom: "10px",
  },
  promoBannerLink: {
    color: "#000",
    fontWeight: "600",
    textDecoration: "underline",
    marginLeft: "5px",
    cursor: "pointer",
  },
  newArrivalBadge: {
    background: "#000",
    color: "#fff",
    padding: "4px 16px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "1px",
    display: "inline-block",
    marginBottom: "10px",
  },
  categorySectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  seeAllLink: {
    color: "#000",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  },
};

// ===== SKELETON HEIGHT CONFIGURATIONS =====
const skeletonHeights = {
  mainSlider: {
    xs: "200px",
    sm: "280px",
    md: "350px",
    lg: "450px",
    xl: "620px",
  },
  banner: {
    xs: "95px",
    sm: "135px",
    md: "167px",
    lg: "220px",
    xl: "300px",
  },
  category: {
    xs: 120,
    sm: 140,
    md: 160,
    lg: 180,
    xl: 200,
  },
  product: {
    xs: 180,
    sm: 200,
    md: 220,
    lg: 240,
    xl: 260,
  },
};

// ===== REUSABLE COMPONENTS =====

// Promo Banner Component
const PromoBanner = () => (
  <div style={styles.promoBanner}>
    <div className="container">
      <span>
        Event T-shirt ► T-shirt/Clothing with your brand logo or design? We are
        delivering worldwide at unbeatable prices.
        <a href="#" style={styles.promoBannerLink}>
          Click here
        </a>
      </span>
    </div>
  </div>
);

// Section Header Component
const SectionHeader = ({
  title,
  subtitle,
  showNavigation = false,
  onPrev,
  onNext,
  seeAllLink,
  showBadge = false,
}) => (
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
    <div className="title-align-left">
      {showBadge && <div style={styles.newArrivalBadge}>NEW ARRIVAL</div>}
      <h1 style={styles.sectionTitle}>{title}</h1>
      <div style={styles.titleUnderline}></div>
      <p>{subtitle}</p>
    </div>

    {showNavigation && (
      <div className="category-navigation-group">
        <div className="d-flex gap-2">
          <NavigationButton direction="prev" onClick={onPrev} />
          <NavigationButton direction="next" onClick={onNext} />
        </div>
        {seeAllLink && (
          <div className="text-end mt-md-3">
            <Link to={seeAllLink}>
              <button className="btn btn-dark btn-see-all">
                See All <i className="ri-arrow-right-line"></i>
              </button>
            </Link>
          </div>
        )}
      </div>
    )}
  </div>
);

// Navigation Button Component
const NavigationButton = ({ direction, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...styles.navigationButton,
    ...(isHovered && {
      background: "#1a1a1a",
      color: "#fff",
      borderColor: "#1a1a1a",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }),
  };

  return (
    <button
      onClick={onClick}
      className="btn"
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={direction === "prev" ? "Previous" : "Next"}
    >
      <i
        className={`ri-arrow-${direction === "prev" ? "left" : "right"}-line`}
        style={styles.navigationIcon}
      ></i>
    </button>
  );
};

// Category List Component - Row wise with Shop Now
const CategoryList = ({ categories, isLoading }) => {
  const [showPromo, setShowPromo] = useState(false);

  if (isLoading) {
    return (
      <ul className="category-list-row">
        {[1, 2, 3, 4, 5, 6].map((_, idx) => (
          <li key={idx} className="category-list-item-row">
            <Skeleton
              variant="text"
              width="80px"
              height={20}
              animation="wave"
            />
          </li>
        ))}
      </ul>
    );
  }

  const handleShopNowClick = () => {
    setShowPromo(true);
  };

  return (
    <div>
      <ul className="category-list-row">
        <li className="category-list-item-row shop-now">
          <Link
            to="/shop"
            className="category-list-link-row"
            onClick={handleShopNowClick}
          >
            Shop Now
          </Link>
        </li>
        {categories.map((category, index) => (
          <li key={index} className="category-list-item-row">
            <Link
              to={category.link || "/shop"}
              className="category-list-link-row"
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>

      {showPromo && <PromoBanner />}
    </div>
  );
};

// Category Skeleton Loader Component
const CategorySkeletonLoader = ({ count = 6 }) => {
  const getVisibleCount = () => {
    if (typeof window === "undefined") return count;
    const width = window.innerWidth;
    if (width < 480) return 2;
    if (width < 768) return 3;
    if (width < 992) return 4;
    if (width < 1200) return 5;
    return 6;
  };

  const [visibleSkeletons, setVisibleSkeletons] = useState(getVisibleCount());

  useState(() => {
    const handleResize = () => setVisibleSkeletons(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="row g-3 g-md-4">
      {Array.from({ length: visibleSkeletons }).map((_, idx) => (
        <div key={idx} className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="d-flex flex-column align-items-center">
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{
                bgcolor: "grey.300",
                borderRadius: "16px",
                height: skeletonHeights.category,
                aspectRatio: "1/1",
              }}
              animation="wave"
            />
            <Skeleton
              variant="text"
              width="70%"
              height={24}
              sx={{ marginTop: "12px", bgcolor: "grey.200" }}
              animation="wave"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Product Skeleton Grid Component
const ProductSkeletonGrid = ({ count = 5 }) => {
  const getVisibleCount = () => {
    if (typeof window === "undefined") return count;
    const width = window.innerWidth;
    if (width < 601) return 2;
    if (width < 1001) return 3;
    if (width < 1290) return 4;
    return 5;
  };

  const [visibleSkeletons, setVisibleSkeletons] = useState(getVisibleCount());

  useState(() => {
    const handleResize = () => setVisibleSkeletons(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="row g-3">
      {Array.from({ length: visibleSkeletons }).map((_, idx) => (
        <div key={idx} className="col-6 col-sm-4 col-md-3 col-lg-2">
          <Skeleton
            variant="rectangular"
            width="100%"
            sx={{
              borderRadius: 2,
              bgcolor: "grey.300",
              height: skeletonHeights.product,
            }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="80%"
            height={20}
            sx={{ margin: "12px 0", bgcolor: "grey.200" }}
            animation="wave"
          />
          <Skeleton
            variant="text"
            width="60%"
            height={18}
            sx={{ margin: "8px 0", bgcolor: "grey.200" }}
            animation="wave"
          />
        </div>
      ))}
    </div>
  );
};

// Product Swiper Section Component
const ProductSwiperSection = ({
  title,
  subtitle,
  products,
  isLoading,
  swiperRef,
  seeAllLink,
  bgClass = "",
  showBadge = false,
}) => (
  <section className={`new-arrival py-3 py-md-5 ${bgClass}`}>
    <div className="container">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        showNavigation={true}
        onPrev={() => swiperRef.current?.swiper.slidePrev()}
        onNext={() => swiperRef.current?.swiper.slideNext()}
        seeAllLink={seeAllLink}
        showBadge={showBadge}
      />
      <br />

      {isLoading ? (
        <ProductSkeletonGrid count={5} />
      ) : (
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay]}
          spaceBetween={15}
          slidesPerView={2}
          speed={600}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            601: { slidesPerView: 3, spaceBetween: 17 },
            1001: { slidesPerView: 4, spaceBetween: 20 },
            1290: { slidesPerView: 5, spaceBetween: 22 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  </section>
);

// ===== MAIN COMPONENT =====
function Home() {
  const { products, loading: isProductsLoading } = useProducts();
  const { categories, loading: isCategoriesLoading } = useCategories();
  const { banners, loading: isBannersLoading } = useBanners();
  const { sliders, loading: isSliderLoading } = useSliders();

  const newArrivalSwiperRef = useRef(null);
  const topSellingSwiperRef = useRef(null);
  const trendingSwiperRef = useRef(null);
  const topRatedSwiperRef = useRef(null);
  const categorySectionRefs = useRef({});

  const [visibleCount, setVisibleCount] = useState(10);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <>
      <Header />

      {/* Carousel Slider Area */}
      <div className="pt-4 bg-gray1">
        <div className="container-fluid">
          {isSliderLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{
                borderRadius: 2,
                bgcolor: "grey.300",
                height: skeletonHeights.mainSlider,
              }}
              animation="wave"
            />
          ) : (
            <div
              id="carouselExampleAutoplaying"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner rounded">
                {sliders.map((slider, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <img
                      src={slider.img}
                      className="d-block w-100"
                      style={styles.carouselImage}
                      alt="Slide IMG"
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Section - Row wise with Shop Now */}
      <section className="category py-4 bg-gray1">
        <div className="container">
          <CategoryList
            categories={categories}
            isLoading={isCategoriesLoading}
          />
        </div>
      </section>

      {/* New Arrival Products - With badge */}
      <ProductSwiperSection
        title="New Arrival Products"
        subtitle="Explore all the new products"
        products={products.filter((p) => p.product_type === "new_arrival")}
        isLoading={isProductsLoading}
        swiperRef={newArrivalSwiperRef}
        seeAllLink="/shop"
        showBadge={true}
      />

      {/* Top Selling Products */}
      <ProductSwiperSection
        title="Top Selling Products"
        subtitle="Explore all the top selling products"
        products={products.filter((p) => p.product_type === "top_selling")}
        isLoading={isProductsLoading}
        swiperRef={topSellingSwiperRef}
        seeAllLink="/shop"
        bgClass="bg-gray1"
      />

      {/* Trending Products */}
      <ProductSwiperSection
        title="Trending Products"
        subtitle="Explore all the trending products"
        products={products.filter((p) => p.product_type === "trending")}
        isLoading={isProductsLoading}
        swiperRef={trendingSwiperRef}
        seeAllLink="/shop"
      />

      {/* Top Rated Products */}
      <ProductSwiperSection
        title="Top Rated Products"
        subtitle="Explore all the top rated products"
        products={products.filter((p) => p.product_type === "top_rated")}
        isLoading={isProductsLoading}
        swiperRef={topRatedSwiperRef}
        seeAllLink="/shop"
        bgClass="bg-gray1"
      />

      {/* Category-wise Product Sections */}
      {!isCategoriesLoading &&
        !isProductsLoading &&
        categories.map((category, catIndex) => {
          const categoryProducts = products.filter(
            (product) =>
              product.category === category.title ||
              product.category_id === category.id,
          );

          if (categoryProducts.length === 0) return null;

          return (
            <section
              key={catIndex}
              className={`new-arrival py-3 py-md-5 ${catIndex % 2 === 0 ? "" : "bg-gray1"}`}
            >
              <div className="container">
                <SectionHeader
                  title={category.title}
                  subtitle={`Explore all products in ${category.title}`}
                  showNavigation={true}
                  onPrev={() =>
                    categorySectionRefs.current[catIndex]?.swiper.slidePrev()
                  }
                  onNext={() =>
                    categorySectionRefs.current[catIndex]?.swiper.slideNext()
                  }
                  seeAllLink={
                    category.link || `/shop?category=${category.title}`
                  }
                />
                <br />

                <Swiper
                  ref={(el) => (categorySectionRefs.current[catIndex] = el)}
                  modules={[Navigation, Autoplay]}
                  spaceBetween={15}
                  slidesPerView={2}
                  speed={600}
                  loop={categoryProducts.length > 5}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  breakpoints={{
                    601: { slidesPerView: 3, spaceBetween: 17 },
                    1001: { slidesPerView: 4, spaceBetween: 20 },
                    1290: { slidesPerView: 5, spaceBetween: 22 },
                  }}
                >
                  {categoryProducts.slice(0, 10).map((product, index) => (
                    <SwiperSlide key={index}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          );
        })}

      {/* Banner Area */}
      <section className="py-4">
        <div className="container">
          <div className="row">
            {isBannersLoading
              ? Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="col-md-6 mt-3 mt-md-0">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      sx={{
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px #0000001a",
                        bgcolor: "grey.300",
                        height: {
                          xs: 150,
                          sm: 180,
                          md: 220,
                          lg: 250,
                        },
                      }}
                      animation="wave"
                    />
                  </div>
                ))
              : banners.map((banner, index) => (
                  <div key={index} className="col-md-6 mt-3 mt-md-0">
                    <img
                      src={banner.img}
                      alt="Banner IMG"
                      className="img-fluid"
                      style={{
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px #0000001a",
                      }}
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="new-arrival py-3 py-md-5 bg-gray1">
        <div className="container">
          <div className="grid-container-2x">
            <div className="title-align-left">
              <h1 style={styles.sectionTitle}>All Products</h1>
              <div style={styles.titleUnderline}></div>
              <p>Explore all the products</p>
            </div>
            <div className="btn-align-end">
              <Link to="/shop">
                <button className="btn btn-dark btn-see-all">
                  See All <i className="ri-arrow-right-line"></i>
                </button>
              </Link>
            </div>
          </div>
          <br />

          <div className="grid-container new-arrival-products">
            {isProductsLoading
              ? Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} style={{ padding: 8 }}>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      sx={{
                        borderRadius: 2,
                        bgcolor: "grey.300",
                        height: skeletonHeights.product,
                      }}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={20}
                      sx={{ margin: "12px 0", bgcolor: "grey.200" }}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={18}
                      sx={{ margin: "8px 0", bgcolor: "grey.200" }}
                      animation="wave"
                    />
                  </div>
                ))
              : products
                  .slice(0, visibleCount)
                  .map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
          </div>

          {!isProductsLoading && visibleCount < products.length && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-dark py-3 px-5"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      <InfoArea />
      <Footer />
    </>
  );
}

export default Home;
