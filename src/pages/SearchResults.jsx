import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import useProducts from '../data/useProducts';
import ProductCard from '../components/ProductCard';
import Skeleton from '@mui/material/Skeleton';

function SearchResults() {
    const { products } = useProducts();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            setLoading(false);
        }
    }, [products]);

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    // Filter products based on query (case insensitive)
    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header />

            {/* START MAIN AREA */}
            <div className="container py-5">
                <h1 className="mb-4">Search Results</h1>
                
                <div id="search-results">
                    {searchQuery ? (
                        <h3 className="pb-4">
                            Search Results for '<span style={{color: "blue"}}>{searchQuery}</span>'
                        </h3>
                    ) : (
                        <h3 className="pb-4">Showing All Products</h3>
                    )}

                    <div className="container grid-container py-5">
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
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        ) : (
                            <p>No products found for "<b>{searchQuery}</b>".</p>
                        )}
                    </div>
                </div>
                <br /><br />
            </div>
            {/* END MAIN AREA */}

            <Footer />
        </>
    );
}

export default SearchResults;