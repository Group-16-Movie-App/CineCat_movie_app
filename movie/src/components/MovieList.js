import React from 'react';
import { Link } from 'react-router-dom';

//Debug
const MovieList = ({ movies, genreNames }) => {
    console.log('Movies to render:', movies);
    console.log('Genre Mapping:', genreNames); // Debug genres
    if (!movies || movies.length === 0) {
        return <div>No movies found. Please type something</div>;
    }
    return (
    <div>
        {movies.map((movie) => {
            // Extract the release year from release_date
            const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";

            return (
                <div key={movie.id} style={{ marginBottom: '20px' }}>
                    <Link to={`/movie/${movie.id}`}>
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                        <h3>{movie.title} ({releaseYear})</h3>
                    </Link>
                    <p>Rating: {movie.vote_average}</p>
                    <p>
                        Genres:{" "}
                        {movie.genre_ids
                            .map(id => genreNames[id] || "Unknown")
                            .join(', ')}
                    </p>
                </div>
            );
        })}
    </div>
    )};

export default MovieList;
