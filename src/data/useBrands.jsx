import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_BRANDS_URL;

function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading, error };
}

export default useBrands;