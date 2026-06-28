import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_BASE_URL + 
                import.meta.env.VITE_API_ADD_REVIEW_URL;

function useSubmitReview() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reviewId, setReviewId] = useState(null);

  // Simple function to get current user ID from localStorage
  const getCurrentUserId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return user && user.id ? parseInt(user.id) : null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };

  // Create user if doesn't exist (auto-create guest)
  const ensureUserExists = () => {
    const existingUser = getCurrentUserId();
    if (existingUser) return existingUser;

    // Create new guest user
    const guestUser = {
      id: Math.floor(Math.random() * 10000) + 1, // Random ID between 1-10000
      name: `User_${Math.floor(Math.random() * 10000)}`,
      created_at: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    return guestUser.id;
  };

  // Main submit function
  const submitReview = async (productId, rating, reviewText = '') => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    setReviewId(null);

    try {
      // 1. Ensure user exists (create if not)
      const userId = ensureUserExists();
      
      if (!userId || userId <= 0) {
        throw new Error('Invalid user ID. Please refresh the page.');
      }

      // 2. Validate inputs
      if (!productId || productId <= 0) {
        throw new Error('Invalid product ID');
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // 3. Prepare form data
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('user_id', userId);
      formData.append('ratings', rating);
      formData.append('review_text', reviewText.trim());

      // 4. Submit to API
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      // 5. Handle response
      if (result.success) {
        setSuccess(true);
        setReviewId(result.review_id);
        return {
          success: true,
          reviewId: result.review_id,
          message: result.message,
          data: result.data
        };
      } else {
        throw new Error(result.message || 'Failed to submit review');
      }
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        message: err.message
      };
    } finally {
      setSubmitting(false);
    }
  };

  // Reset state
  const reset = () => {
    setSubmitting(false);
    setError(null);
    setSuccess(false);
    setReviewId(null);
  };

  return {
    submitReview,
    submitting,
    error,
    success,
    reviewId,
    reset,
    getCurrentUserId
  };
}

export default useSubmitReview;