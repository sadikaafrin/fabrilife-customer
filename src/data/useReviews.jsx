import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useReviews(productId = null) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    average_rating: 0,
    total_reviews: 0
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL with product_id if provided
      let url = `${API_BASE_URL}reviews.php?action=get-review`;
      
      if (productId) {
        url += `&product_id=${productId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.reviews || []);
        setStats({
          average_rating: data.data.average_rating || 0,
          total_reviews: data.data.total_reviews || 0
        });
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const refreshReviews = () => {
    fetchReviews();
  };

  return {
    reviews,
    loading,
    error,
    stats,
    refreshReviews
  };
}

export default useReviews;