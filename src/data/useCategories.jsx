import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_CATEGORIES_URL;

function useCategories() {
  const [categories, setCategories] = useState([]); // renamed properly
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch categories"); // message fixed
        const data = await res.json();

        setCategories(data); // should match your API structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export default useCategories;