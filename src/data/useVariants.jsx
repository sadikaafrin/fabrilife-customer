import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_ALL_VARIANTS_BY_PRODUCT_URL;

function useVariants(productId) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when productId changes
    setVariants([]);
    setLoading(true);
    setError(null);

    // Don't fetch if productId is not available
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchVariants = async () => {
      try {
        const res = await fetch(API_URL + productId);
        if (!res.ok) throw new Error("Failed to fetch variants");
        const data = await res.json();
        
        // Ensure data is an array
        setVariants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching variants:", err);
        setError(err.message);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [productId]); // Re-fetch when productId changes

  return { variants, loading, error };
}

export default useVariants;