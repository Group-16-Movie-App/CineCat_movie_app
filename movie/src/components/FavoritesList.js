import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FavoritesList.css';

/*This component handles the display and management of a user's favorite movies.*/
const FavoritesList = () => {
    // State management
    const [favorites, setFavorites] = useState([]); // Stores the list of favorite movies
    const [loading, setLoading] = useState(true);   // Tracks loading state
    const [error, setError] = useState(null);       // Stores any error messages

    // Fetch favorites when component mounts
    useEffect(() => {
        fetchFavorites();
    }, []);

    /**
     * Fetches the user's favorite movies from the backend
     * Requires authentication token from localStorage
     */
    const fetchFavorites = async () => {
        try {
            // Get authentication token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Make API call to fetch favorites
            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFavorites(response.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    /*Removes a movie from the user's favorites
     * @param {number} movieId - The ID of the movie to remove
     */
    const removeFavorite = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            
            // Make API call to remove the movie
            await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update state to remove the movie from the UI
            setFavorites(favorites.filter(movie => movie.id !== movieId));
            
            //   // dispatchEvent: this is a custom event to communicate between components
            window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (err) {
            console.error('Error removing favorite:', err);
            setError('Failed to remove favorite');
        }
    };

    // Loading state display
    if (loading) return (
        <div className="favorites-loading">
            <div className="loading-spinner"></div>
            <p>Loading your favorites...</p>
        </div>
    );

    // Error in case of error state display
    if (error) return (
        <div className="favorites-error">
            <p>❌ {error}</p>
        </div>
    );

    // this handles mpty state display
    if (favorites.length === 0) return (
        <div className="empty-favorites">
            <p>You haven't added any favorites yet!</p>
            <Link to="/search" className="search-movies-btn">
                Search movies
            </Link>
        </div>
    );

    // Render favorites grid
    return (
        <div className="favorites-grid">
            {favorites.map(movie => (
                <div key={movie.id} className="favorite-item">
                    {/* Movie poster and details */}
                    <Link to={`/movie/${movie.id}`}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="favorite-content">
                            <h3>{movie.title}</h3>
                            {/* Extract and display year from release date */}
                            <p>{movie.release_date?.split('-')[0]}</p>
                        </div>
                    </Link>
                    {/* Remove from favorites button */}
                    <button 
                        className="remove-favorite-btn"
                        onClick={() => removeFavorite(movie.id)}
                    >
                        Remove from Favorites
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FavoritesList; 