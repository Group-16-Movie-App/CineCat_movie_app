import React, { useEffect, useState } from 'react';
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
            console.error('Error fetching movies:', error);
            setError('Failed to load movies');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [groupId]);

    const handleAddMovie = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/movies`, {
                title: movieTitle,
                description: movieDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMovieTitle('');
            setMovieDescription('');
            // Refresh the movie list
            fetchMovies();
        } catch (error) {
            setError('Failed to add movie');
            console.error('Error adding movie:', error);
        }
    };

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <h3>Group Movies</h3>
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
                <button onClick={handleAddMovie} className="action-button">Add Movie</button>
            </div>
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>{movie.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default GroupMovies;