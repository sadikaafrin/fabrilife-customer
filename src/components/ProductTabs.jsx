import React, { useState } from "react";
import ReviewEmptyState from "./ReviewEmptyState";

function ProductTabs({ 
  product,
  filteredReviews,
  reviewsLoading,
  fetchError,
  user,
  productId,
  reviewForm,
  setReviewForm,
  handleReviewSubmit,
  submitting,
  submitError,
  hasUserReviewed
}) {
  const [activeTab, setActiveTab] = useState("description");

  const {
    long_description,
    regular_price,
    selling_price,
    avilable_stock,
    category,
    sub_category,
    product_code
  } = product || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="tabs-section">
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Additional Information
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({filteredReviews.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' ? (
          <div dangerouslySetInnerHTML={{ __html: long_description }} />
        ) : activeTab === 'info' ? (
          <table className="info-table">
            <tbody>
              <tr>
                <th>Regular Price</th>
                <td>৳ {regular_price}</td>
              </tr>
              <tr>
                <th>Selling Price</th>
                <td>৳ {selling_price}</td>
              </tr>
              <tr>
                <th>Available Stock</th>
                <td>{avilable_stock}</td>
              </tr>
              <tr>
                <th>Main Category</th>
                <td>{category}</td>
              </tr>
              <tr>
                <th>Sub Category</th>
                <td>{sub_category}</td>
              </tr>
              <tr>
                <th>SKU</th>
                <td>{product_code}</td>
              </tr>
            </tbody>
          </table>
        ) : activeTab === 'reviews' ? (
          <div className="reviews-container">
            <div className="reviews-content">
              {/* Review Form */}
              <div className="review-form-container">
                <h3><i className="ri-edit-2-line"></i> Write a Review</h3>
                
                {!productId ? (
                  <div className="alert alert-warning">
                    <i className="ri-alert-line me-2"></i>
                    Product not loaded yet. Please wait...
                  </div>
                ) : user && user.id && parseInt(user.id) !== 0 ? (
                  <>
                    {hasUserReviewed && (
                      <div className="alert alert-info mb-3 p-2">
                        <i className="ri-information-line me-2"></i>
                        You've already reviewed this product.
                      </div>
                    )}

                    <form onSubmit={handleReviewSubmit}>
                      <div className="form-group">
                        <label><i className="ri-star-line"></i> Your Rating *</label>
                        <div className="rating-input">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <React.Fragment key={star}>
                              <input
                                type="radio"
                                id={`star${star}`}
                                name="rating"
                                value={star}
                                checked={reviewForm.rating === star}
                                onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                disabled={submitting}
                              />
                              <label htmlFor={`star${star}`}>★</label>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label><i className="ri-chat-3-line"></i> Your Review *</label>
                        <textarea
                          className="form-control"
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Share your experience with this product..."
                          required
                          rows={4}
                          disabled={submitting}
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="submit-review-btn"
                        disabled={submitting || !productId}
                      >
                        <i className={submitting ? "ri-loader-4-line animate-spin" : "ri-send-plane-line"}></i>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>

                      {submitError && (
                        <div className="alert alert-danger mt-3 mb-0 p-2">
                          <i className="ri-error-warning-line me-2"></i>
                          {submitError}
                        </div>
                      )}
                    </form>
                  </>
                ) : (
                  <ReviewEmptyState />
                )}
              </div>

              {/* Reviews List */}
              <div className="reviews-list-container">
                <h3>
                  <i className="ri-chat-history-line"></i> 
                  Customer Reviews ({filteredReviews.length})
                </h3>
                
                {/* Rating summary */}
                <div className="rating-summary">
                  <div className="average-rating">
                    {filteredReviews.length > 0 
                      ? (filteredReviews.reduce((sum, r) => sum + (r.ratings || 0), 0) / filteredReviews.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= Math.round(
                          filteredReviews.length > 0 
                            ? filteredReviews.reduce((sum, r) => sum + (r.ratings || 0), 0) / filteredReviews.length
                            : 0
                        ) ? '' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="total-reviews">
                    Based on {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div><br />

                {!productId ? (
                  <div className="alert alert-warning">
                    <i className="ri-alert-line me-2"></i>
                    Loading product information...
                  </div>
                ) : reviewsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading reviews...</span>
                    </div>
                  </div>
                ) : fetchError ? (
                  <div className="alert alert-danger">
                    <i className="ri-error-warning-line me-2"></i>
                    {fetchError}
                  </div>
                ) : filteredReviews.length > 0 ? (
                  <div className="reviews-list">
                    {filteredReviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {getUserInitials(review.user_name)}
                            </div>
                            <div className="reviewer-details">
                              <h4>{review.user_name}</h4>
                              <span className="review-date">{formatDate(review.created_at)}</span>
                            </div>
                          </div>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star} 
                                className={`star ${star <= (review.ratings || 0) ? '' : 'empty'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="review-comment">{review.review_text}</div>
                        
                        {user && review.user_id && parseInt(review.user_id) === parseInt(user.id) && (
                          <div className="text-end mt-2">
                            <small className="text-muted">
                              <i className="ri-user-star-line me-1"></i>
                              Your review
                            </small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <i className="ri-chat-3-line"></i>
                    <h3 className="justify-content-center">No reviews yet</h3>
                    <p>Be the first to share your thoughts about this product!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductTabs;