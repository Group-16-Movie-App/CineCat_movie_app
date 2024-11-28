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
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserEmail(payload.email || "Anonymous");
            } catch (err) {
                console.error("Error parsing token:", err);
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/reviews/movie/${movieId}`
            );
            console.log("Fetched reviews:", response.data);
            setReviews(response.data || []);
            setError("");
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews.");
        }
    };

    useEffect(() => {
        if (!movieId) {
            console.error("Movie ID is missing.");
            setError("Invalid movie ID.");
            return;
        }
        fetchReviews();
    }, [movieId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to submit a review.");
            setIsLoggedIn(false);
            return;
        }

        const reviewData = {
            movieId: parseInt(movieId, 10),
            description: newReview.trim(),
            rating: parseInt(rating, 10),
        };

        console.log("Submitting review data:", reviewData);

        if (!reviewData.description || isNaN(reviewData.rating)) {
            setError("Please provide a valid review and rating.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Review submitted successfully:", response.data);
            await fetchReviews();
            setNewReview("");
            setRating("");
            setError("");
        } catch (error) {
            console.error("Error submitting review:", error.response?.data || error.message);
            setError(
                `Failed to submit review: ${error.response?.data?.message || error.message}`
            );
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please log in to delete a review.");
            return;
        }

        console.log("Attempting to delete review ID:", reviewId);

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/reviews/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Delete response:", response.data);
            await fetchReviews();
            setError("");
        } catch (error) {
            console.error("Error deleting review:", error.response || error.message);
            setError(
                `Failed to delete review: ${error.response?.data?.message || error.message}`
            );
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
                                <option value="" disabled>
                                    Select
                                </option>
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
                                {format(new Date(review.created), "MMMM dd, yyyy, hh:mm a")}
                            </small>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;
