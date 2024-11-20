import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FavoritesList = () => {
    // State management for the component
    const [favorites, setFavorites] = useState([]); // Stores the list of favorite movies
    const [loading, setLoading] = useState(true);   // Tracks loading state
    const [error, setError] = useState(null);       // Stores any error messages

    // When component mounts, fetch user's favorites
    useEffect(() => {
        fetchFavorites();
    }, []);

    // Function to fetch all favorite movies from our backend
    const fetchFavorites = async () => {
        try {
            // Get the authentication token from browser storage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Make API call to our backend to get favorites
            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update state with the fetched favorites
            setFavorites(response.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites');
        } finally {
            // Always set loading to false when done
            setLoading(false);
        }
    };

    // Function to remove a movie from favorites
    const removeFavorite = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            // Make API call to remove the movie
            await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update the UI by filtering out the removed movie
            setFavorites(favorites.filter(movie => movie.id !== movieId));
        } catch (err) {
            console.error('Error removing favorite:', err);
            setError('Failed to remove favorite');
        }
    };

    // Show loading state while fetching data
    if (loading) return <div>Loading favorites...</div>;
    // Show error message if something went wrong
    if (error) return <div>{error}</div>;

    // Render the grid of favorite movies
    return (
        <div className="favorites-grid">
            {favorites.map(movie => (
                <div key={movie.id} className="favorite-item">
                    {/* Link to the movie detail page */}
                    <Link to={`/movie/${movie.id}`}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <h3>{movie.title}</h3>
                    </Link>
                    {/* Button to remove from favorites */}
                    <button onClick={() => removeFavorite(movie.id)}>
                        Remove from Favorites
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FavoritesList; 