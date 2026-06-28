import { useEffect, useState } from "react";

function useCoupon(couponCode) {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!couponCode) return; // don't fetch if no coupon code

    const fetchCoupon = async () => {
      setLoading(true);
      setError(null);

      try {

        const API_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_COUPON_URL;
        
        const res = await fetch(
          `${API_URL}${couponCode}`
        );

        if (!res.ok) throw new Error("Failed to fetch coupon");

        const data = await res.json();

        // Your API returns an array, but ideally you might want the first match
        setCoupon(data[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [couponCode]);

  return { coupon, setCoupon, loading, error };
}

export default useCoupon;