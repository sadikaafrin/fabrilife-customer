import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_SLIDER_URL;

function useSliders() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch sliders");

        const data = await res.json();

        // adjust based on API structure
        if (Array.isArray(data)) {
          setSliders(data);
        } else if (data.sliders) {
          setSliders(data.sliders);
        } else {
          setError("Invalid API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  return { sliders, loading, error };
}

export default useSliders;