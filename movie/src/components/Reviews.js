import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from 'react-icons/md';
import "./Reviews.css";
import { format } from 'date-fns';

const Reviews = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserEmail(payload.email);
        }
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/reviews/movie/${movieId}`
            );
            setReviews(response.data);
            window.dispatchEvent(new Event('reviewsUpdated'));
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to submit a review");
            setIsLoggedIn(false);
            return;
        }

        try {
            const reviewData = {
                movieId: parseInt(movieId),
                description: newReview,
                rating: parseInt(rating)
            };

            await axios.post(
                `http://localhost:5000/api/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await fetchReviews();
            setNewReview("");
            setRating("");
            setError("");
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in to submit a review");
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            } else {
                setError(`Failed to submit review: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleDeleteReview = async (reviewId) => {
      const token = localStorage.getItem("token");
      if (!token) {
          setError("Please log in to delete review");
          return;
      }
  
      try {
          console.log('Trying to delete review:', reviewId); // Логируем ID
  
          const response = await axios.delete(
              `http://localhost:5000/api/reviews/${reviewId}`,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              }
          );
  console.log('Delete response:', response); 
          await fetchReviews(); 
          setError(""); 
      } catch (error) {
          console.error("Delete error:", error.response || error); 
          if (error.response?.status === 401) {
              setError("Please log in to delete review");
              setIsLoggedIn(false);
              localStorage.removeItem("token");
          } else {
              setError(`Failed to delete review: ${error.response?.data?.message || error.message}`);
          }
      }
  };

    return (
      <div className="reviews-container">
          <h3 className="reviews-title">Reviews</h3>
  
          {error && <div className="error-message">{error}</div>}
  
          {isLoggedIn ? (
              <form onSubmit={handleSubmit} className="review-form">
                  <div>
                      <textarea
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          placeholder="Write your review..."
                          className="review-textarea"
                          required
                      />
                  </div>
                  <div className="form-footer">
                      <label className="rating-label">
                          Rating:
                          <select
                              value={rating}
                              onChange={(e) => setRating(Number(e.target.value))}
                              className="rating-select"
                          >
                              {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>
                                      {num}
                                  </option>
                              ))}
                          </select>
                      </label>
                      <button type="submit" className="submit-button">
                          Submit Review
                      </button>
                  </div>
              </form>
          ) : (
              <div className="login-message">
                  <p>Please log in to submit a review</p>
              </div>
          )}
  
          <div className="reviews-list">
              {reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
              ) : (
                  reviews.map((review) => (
                      <div key={review.id} className="review-card">
                          <div className="review-header">
                              <strong className="reviewer-name">
                                  {review.name || review.email || "Anonymous"}
                              </strong>
                              <div className="review-header-right">
                                  <span className="review-rating">
                                      Rating: {review.rating}/5
                                  </span>
                                
                                      <button 
                                          className="delete-button"
                                          onClick={() => handleDeleteReview(review.id)}
                                          title="Delete review"
                                      >
                                          <MdDelete size={18} />
                                      </button>
                               
                              </div>
                          </div>
                          <p className="review-content">{review.review}</p>
                          <small className="review-date">
                                {format(new Date(review.created), 'MMMM dd, yyyy, hh:mm a')}
                          </small>
                      </div>
                  ))
              )}
          </div>
      </div>
  );
};

export default Reviews;