import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_FOOTER_CONTENT_URL;

function useFooterContent() {
  const [footerContent, setFooterContent] = useState(null); // should be object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch footer content");

        const json = await res.json();

        if (json.success) {
          setFooterContent(json.data); // only set the 'data' object
        } else {
          throw new Error(json.message || "Failed to fetch footer content");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterContent();
  }, []);

  return { footerContent, loading, error };
}

export default useFooterContent;