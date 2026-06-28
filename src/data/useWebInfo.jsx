import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_WEB_INFO_URL;

function useWebInfo() {
  const [webInfo, setWebInfo] = useState(null); // should be object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebInfo = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch web info");

        const json = await res.json();

        if (json.success) {
          setWebInfo(json.data); // only set the 'data' object
        } else {
          throw new Error(json.message || "Failed to fetch web info");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWebInfo();
  }, []);

  return { webInfo, loading, error };
}

export default useWebInfo;