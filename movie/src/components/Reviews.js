import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reviews.css";

const Reviews = ({ movieId, onLoginClick }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Initial check
    checkLoginStatus();

    // Set up an interval to check periodically
    const intervalId = setInterval(checkLoginStatus, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/movie/${movieId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [movieId]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to submit a review");
      setIsLoggedIn(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          movieId,
          description: newReview,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form and fetch updated reviews
      setNewReview("");
      setRating(5);
      const response = await axios.get(
        `http://localhost:5000/api/reviews/movie/${movieId}`
      );
      setReviews(response.data);
      setError("");
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 401) {
        setError("Please log in to submit a review");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      } else {
        setError("Failed to submit review");
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
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <strong className="reviewer-name">
                  {review.email || "Anonymous"}
                </strong>
                <span className="review-rating">Rating: {review.rating}/5</span>
              </div>
              <p className="review-content">{review.description}</p>
              <small className="review-date">
                {new Date(review.timestamp).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
