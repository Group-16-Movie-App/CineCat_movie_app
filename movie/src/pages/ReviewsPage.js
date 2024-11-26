import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import './ReviewsPage.css';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchRecentReviews = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/reviews');
                setReviews(response.data || []);
                console.log('Review Data from database', response.data.results)
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        fetchRecentReviews();
    }, []);

    return (
        <>
            <div className="container">
                {reviews.map((review) => {
                    return (
                        <>
                            <div key={review.id} className="review-card">
                                <Link to={`/movie/${review.movie_id}`}>
                                    <p>{review.name}</p>
                                    <p>just reviewed at {format(new Date(review.created), 'MMMM dd, yyyy, hh:mm a')}</p>
                                    <p>Rating: {review.rating}</p>
                                    <p>{review.review}</p>
                                        {review.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                                                alt={review.movie_title || "Movie Poster"}
                                                style={{ display: "block", marginBottom: "10px" }}
                                            />
                                        ) : (
                                            <p>[Poster Unavailable]</p>
                                        )}
                                        <h3>
                                            {review.movie_title} {review.release_date ? `(${review.release_date.substring(0, 4)})` : ""}
                                        </h3>
                                </Link>
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    )
};

export default ReviewsPage;