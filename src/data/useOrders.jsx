import { useEffect, useState } from "react";

function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if userId is not available yet
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const API_URL = 
          import.meta.env.VITE_API_BASE_URL + 
          import.meta.env.VITE_API_ORDER_HISTORY_URL + 
          userId;

        const res = await fetch(API_URL);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Handle different response formats
        // If your API returns { success: true, orders: [...] }
        if (data.success && data.orders) {
          setOrders(data.orders);
        } 
        // If your API returns just an array
        else if (Array.isArray(data)) {
          setOrders(data);
        }
        // If your API returns { data: [...] }
        else if (data.data && Array.isArray(data.data)) {
          setOrders(data.data);
        }
        else {
          setOrders([]);
        }
        
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Re-fetch when userId changes

  return { orders, loading, error };
}

export default useOrders;