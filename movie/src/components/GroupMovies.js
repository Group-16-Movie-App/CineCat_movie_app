import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupMovies = ({ groupId }) => {
    const [movies, setMovies] = useState([]);
    const [movieTitle, setMovieTitle] = useState('');
    const [movieDescription, setMovieDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/movies`);
            setMovies(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching group movies.');
            console.error('Error fetching group movies:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [groupId, fetchMovies]);

    const handleAddMovie = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/movies`, {
                title: movieTitle,
                description: movieDescription
            });
            // Reset form and refresh movies list
            setMovieTitle('');
            setMovieDescription('');
            fetchMovies();
        } catch (error) {
            setError('Failed to add movie');
            console.error('Error adding movie:', error);
        }
    };

    return (
        <div className="section-content">
            <h3 className="section-title">Group Movies</h3>
            {loading ? (
                <div>Loading movies...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="input-container">
                    <input
                        type="text"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        placeholder="Movie Title"
                        className="input-field"
                    />
                    <textarea
                        value={movieDescription}
                        onChange={(e) => setMovieDescription(e.target.value)}
                        placeholder="Movie Description"
                        className="input-field"
                        rows="3"
                    />
                    <button 
                        onClick={handleAddMovie}
                        className="action-button"
                    >
                        Add Movie
                    </button>
                </div>
            )}

            <div className="movies-list">
                {movies.map(movie => (
                    <div key={movie.id} className="list-item">
                        <div>
                            <h4>{movie.title}</h4>
                            <p>{movie.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupMovies;