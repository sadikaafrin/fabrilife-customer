import { useEffect, useState } from "react";

function useDiscounts(purchaseAmount) {
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!purchaseAmount) return; // don't fetch if no purchase amount

    const fetchDiscount = async () => {
      setLoading(true);
      setError(null);

      try {

        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_DISCOUNT_URL;

        const res = await fetch(
          `${API_URL}${purchaseAmount}`
        );

        if (!res.ok) throw new Error("Failed to fetch discount");

        const data = await res.json();

        // API returns a single object (not array now)
        setDiscount(data || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscount();
  }, [purchaseAmount]);

  return { discount, setDiscount, loading, error };
}

export default useDiscounts;