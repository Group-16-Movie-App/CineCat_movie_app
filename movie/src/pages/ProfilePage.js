import React, { useState, useEffect } from 'react';
import FavoritesList from '../components/FavoritesList';
import Reviews from '../components/Reviews';
import './ProfilePage.css';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation
import './ProfilePage.css';

/* This component serves as the main profile page for logged-in users. It displays user information, statistics, and their favorite movies. */
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

                // Fetch profile data
                const endpoint = userId 
                    ? `http://localhost:5000/api/profile/${userId}`
                    : 'http://localhost:5000/api/favorites';
                
                const profileResponse = await axios.get(endpoint, { headers });
                
                if (userId) {
                    setProfileData(profileResponse.data);
                    setFavoritesCount(profileResponse.data.favorites?.length || 0);
                } else {
                    setFavoritesCount(profileResponse.data.length);
                }

                // Fetch user reviews
                if (userId) {
                    try {
                        console.log('Fetching reviews for user:', userId);
                        const reviewsResponse = await axios.get(
                            `http://localhost:5000/api/reviews/user/${userId}`
                        );
                        
                        console.log('Reviews Response:', reviewsResponse.data);
                        
                        setUserReviews(reviewsResponse.data);
                        setReviewsCount(reviewsResponse.data.length);
                    } catch (reviewError) {
                        console.error('Error fetching reviews:', reviewError);
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            }
        };

        if (userId) {
            fetchData();
        }
        
        // Add event listener for favorites updates
        const handleFavoritesUpdate = () => {
            fetchData();
        };

        // Add event listener for review updates
        const handleReviewsUpdate = () => {
            fetchData();
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        window.addEventListener('reviewsUpdated', handleReviewsUpdate);
        
        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
            window.removeEventListener('reviewsUpdated', handleReviewsUpdate);
        };
    }, [userId]);

    // Reviews Section Component
    const ReviewsSection = () => (
        <div className="profile-reviews-section">
            <h2>My Reviews</h2>
            <div className="profile-reviews-content">
                {userReviews.length === 0 ? (
                    <p>No reviews yet</p>
                ) : (
                    <div className="profile-reviews-grid">
                        {userReviews.map((review) => (
                            <div key={review.id} className="profile-review-card">
                                <h3>{review.movie_title}</h3>
                                <p className="profile-review-rating">Rating: {review.rating}/5</p>
                                <p className="profile-review-text">{review.review}</p>
                                <p className="profile-review-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Profile sharing component
    const ShareProfile = () => {
        const handleShareProfile = () => {
            const userId = localStorage.getItem('userId');
            const shareUrl = `${window.location.origin}/profile/${userId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Profile URL copied to clipboard!');
        };

        return isOwnProfile ? (
            <button className="share-button" onClick={handleShareProfile}>
                Share Profile
            </button>
        ) : null;
    };

    // Favorites sharing component
    const ShareFavorites = () => {
        const handleShareFavorites = () => {
            const userId = localStorage.getItem('userId');
            const shareUrl = `${window.location.origin}/favorites/${userId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Favorites list URL copied to clipboard!');
        };

        return isOwnProfile ? (
            <button className="share-button" onClick={handleShareFavorites}>
                Share Favorites
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
                        <div className="share-buttons">
                            <ShareProfile />
                            <ShareFavorites />
                        </div>
                    </div>
                </div>
                
                {/* This is the user Statistics Section on the profile page */}
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
                <div className="section-header">
                    <h2>My Favorites</h2>
                </div>
                <FavoritesList />
            </div>

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Groups Section */}
            <div className="favorites-section">
                <h2>My Groups</h2>
                <div className="groups-content">
                    <Link to="/groups" className="button">View My Groups</Link> {/* Link to the groups page */}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;