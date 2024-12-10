import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroupComments from './GroupComments';

const GroupMovies = ({ groupId }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/movies`);
                setMovies(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load movies');
                setLoading(false);
            }
        };

        fetchMovies();
    }, [groupId]);

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="group-movies">
            <h3>Movies in this Group</h3>
            {movies.map(movie => (
                <div key={movie.id} className="movie-card">
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    <h4>{movie.title}</h4>
                    <p>Rating: {movie.rating}</p>
                    <GroupComments movieId={movie.id} />
                </div>
            ))}
        </div>
    );
};

export default GroupMovies;