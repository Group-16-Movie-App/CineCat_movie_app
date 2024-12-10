import React, { useState, useEffect } from 'react';
import FavoritesList from '../components/FavoritesList';
import GroupList from '../components/GroupList'
import './ProfilePage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProfilePage = () => {
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [groupsCount, setGroupsCount] = useState(0);
    const storedUserName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
  
  
    const isOwnProfile = !!userId;

    // Update userName logic to handle shared profiles
    const userName = isOwnProfile 
        ? (storedUserName && storedUserName !== 'null' ? storedUserName : 'User')
        : (profileData?.userName || 'User');
    const avatarLetter = userName.charAt(0).toUpperCase();

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
                        const reviewsResponse = await axios.get(
                            `http://localhost:5000/api/reviews/user/${userId}`,
                            { headers }
                        );
                        
                        setUserReviews(reviewsResponse.data);
                    } catch (reviewError) {
                        console.error('Error fetching reviews:', reviewError);
                    }
                }

                // Fetch groups created by the user
                if (userId) {
                    try {
                        const groupsResponse = await axios.get(
                            `http://localhost:5000/api/groups/created/${userId}`,
                            { headers }
                        );
                        console.log('Created Groups Response:', groupsResponse.data);
                        setMyGroups(groupsResponse.data);
                        setGroupsCount(groupsResponse.data.length);
                    } catch (groupError) {
                        console.error('Error fetching created groups:', groupError);
                    }
                }
    
            } catch (error) {
                console.error('Error fetching data:', error);
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

        // Add event listener for group updates
        const handleGroupsUpdate = () => {
            fetchData();
        };

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        window.addEventListener('reviewsUpdated', handleReviewsUpdate);
        window.addEventListener('groupsUpdated', handleGroupsUpdate);

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
            window.removeEventListener('reviewsUpdated', handleReviewsUpdate);
            window.removeEventListener('groupsUpdated', handleGroupsUpdate);
        };
    }, [userId]);

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
            <div className="profile-header">
                <div className="user-info">
                    <div className="avatar">
                        {avatarLetter}
                    </div>
                    <div className="user-details">
                        <h1>Welcome, {userName}!</h1>
                        <div className="share-buttons">
                            <ShareProfile />
                            <ShareFavorites />
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-number">{favoritesCount}</div>
                        <div className="stat-label">Favorite Movies</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{userReviews.length}</div>
                        <div className="stat-label">Reviews</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{groupsCount}</div>
                        <div className="stat-label">Groups Created</div>
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
            <div className="groups-section">
                <h2>My Created Groups</h2>
                {myGroups.length > 0 ? (
                    <div className="groups-grid">
                        {myGroups.map((group) => (
                            <div key={group.id} className="group-card">
                                <h3>{group.name}</h3>
                                <Link to={`/group/${group.id}`} className="group-card-link">View Group</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No groups created yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
