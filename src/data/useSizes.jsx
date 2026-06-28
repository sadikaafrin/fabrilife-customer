import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SIZES_URL;

function useSizes() {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch sizes");
        const data = await res.json();
        setSizes(data); // response structure should match your static demo
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSizes();
  }, []);

  return { sizes, loading, error };
}

export default useSizes;