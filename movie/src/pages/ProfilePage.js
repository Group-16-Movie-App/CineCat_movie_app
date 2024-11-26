import React, { useState, useEffect } from 'react';
import FavoritesList from '../components/FavoritesList';
import Reviews from '../components/Reviews';
import './ProfilePage.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';


/* This component serves as the main profile page for logged-in users.It displays user information, statistics, and their favorite movies.*/
const ProfilePage = () => {
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewsCount, setReviewsCount] = useState(0);
    const storedUserName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const isOwnProfile = !!userId;

    console.log('User ID:', userId);
    
    // Update userName logic to handle shared profiles
    const userName = isOwnProfile 
        ? (storedUserName && storedUserName !== 'null' ? storedUserName : 'User')
        : (profileData?.userName || 'User');
    const avatarLetter = userName.charAt(0).toUpperCase();

    // Modified useEffect to fetch both profile and review data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Test the API connection
                console.log('Attempting to connect to:', `http://localhost:5000/api/profile/${userId}`);

                // Fetch profile data
                const endpoint = userId 
                    ? `http://localhost:5000/api/profile/${userId}`
                    : 'http://localhost:5000/api/favorites';
                
                const profileResponse = await axios.get(endpoint, { 
                    headers,
                    timeout: 5000 // Add timeout
                });
                
                console.log('Profile Response:', profileResponse.data);

                if (userId) {
                    setProfileData(profileResponse.data);
                    setFavoritesCount(profileResponse.data.favorites?.length || 0);
                } else {
                    setFavoritesCount(profileResponse.data.length);
                }

                // Fetch user reviews
                console.log('Attempting to fetch reviews for user:', userId);
                
                const reviewsResponse = await axios.get(
                    `http://localhost:5000/api/reviews/user/${userId}`,
                    { 
                        headers,
                        timeout: 5000 // Add timeout
                    }
                );
                
                console.log('Reviews Response:', reviewsResponse.data);
                
                setUserReviews(reviewsResponse.data);
                setReviewsCount(reviewsResponse.data.length);

            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error message:', error.message);
                }
            }
        };

        if (userId) {
            fetchData();
        }
        
        if (isOwnProfile) {
            window.addEventListener('favoritesUpdated', fetchData);
            return () => {
                window.removeEventListener('favoritesUpdated', fetchData);
            };
        }
    }, [userId, isOwnProfile]);

    // Reviews Section Component
    const ReviewsSection = () => (
        <div className="favorites-section">
            <h2>My Reviews</h2>
            <div className="reviews-content">
                {userReviews.length === 0 ? (
                    <p>No reviews yet</p>
                ) : (
                    <div className="reviews-grid">
                        {userReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <h3>{review.movie_title}</h3>
                                <p className="review-rating">Rating: {review.rating}/5</p>
                                <p className="review-text">{review.review}</p>
                                <p className="review-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Add share button component (only show on own profile)
    const ShareButton = () => {
        const handleShare = () => {
            const userId = localStorage.getItem('userId');
            const shareUrl = `${window.location.origin}/profile/${userId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Profile URL copied to clipboard!');
        };

        return isOwnProfile ? (
            <button className="share-button" onClick={handleShare}>
                Share Profile
            </button>
        ) : null;
    };

    return (
        <div className="profile-container">
            {/* Profile Header Section */}
            <div className="profile-header">
                {/* User Information Display */}
                <div className="user-info">
                    {/* User Avatar - displays first letter of username */}
                    <div className="avatar">
                        {avatarLetter}
                    </div>
                    {/* User Details Section */}
                    <div className="user-details">
                        <h1>Welcome, {userName}!</h1>
                        <ShareButton />
                    </div>
                </div>
                
                {/* This is the user Statistics Section on ther profile page */}
                <div className="profile-stats">
                    {/* Favorites Count */}
                    <div className="stat-card">
                        <div className="stat-number">
                            {favoritesCount}
                        </div>
                        <div className="stat-label">Favorite Movies</div>
                    </div>
                    {/* Reviews Count */}
                    <div className="stat-card">
                        <div className="stat-number">{reviewsCount}</div>
                        <div className="stat-label">Reviews</div>
                    </div>
                    {/* Groups Count */}
                    <div className="stat-card">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Groups</div>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            <div className="favorites-section">
                <h2>My Favorites</h2>
                <FavoritesList />
            </div>

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Groups Section */}
            <div className="favorites-section">
                <h2>My Groups</h2>
                <div className="groups-content">
                    {/* I have hard-coded groups for now */}
                    <p>Groups...</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 