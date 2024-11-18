import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);


    useEffect(() => {
        axios.get(`http://localhost:5000/api/movies/${id}`)
            .then(response => setMovie(response.data))
            .catch(error => console.error('Error fetching movie details:', error));
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    console.log('Movie genres ',movie.genres)

    const genreNames = movie.genres.map(genre => genre.name || "Unknown");

    return (
        <div>
            <h2>{movie.title}</h2>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p>{movie.overview}</p>
            <p>Genre: {genreNames.join(', ')}</p>
            <p>Rating: {movie.vote_average}</p>
            <p>Release Date: {movie.release_date}</p>
        </div>
    );
};

export default MovieDetail;
