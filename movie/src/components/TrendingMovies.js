import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";
import "./TrendingMovies.css"; // Import the CSS file

const TrendingMovies = ({ setBackgroundImage }) => {
    const [time, setTime] = useState("day"); // Default time is "day"
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setError(null); // Clear any previous error

                // Fetch movies based on the selected time
                const response = await axios.get(`http://localhost:5000/api/trending/movies/${time}`);
                setMovies(response.data.results || []); // Adjust for API's actual response structure
                
                // Set random background image using the prop
                if (response.data.results && response.data.results.length > 0) {
                    const randomMovie = response.data.results[Math.floor(Math.random() * response.data.results.length)];
                    if (randomMovie.backdrop_path) {
                        const imageUrl = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
                        console.log('Setting background image:', imageUrl);
                        setBackgroundImage(imageUrl);
                    }
                }
            } catch (error) {
                console.error("Error fetching trending movies:", error);
                setError("Failed to fetch trending movies. Please try again later.");
            }
        };

        fetchTrending();
    }, [time, setBackgroundImage]);

    return (
        <div className="trending-movies">
            {/* Dynamic label based on selected time */}
            <h2 className="movies-label">
                {time === "day" ? "Movies of the Day" : "Movies of the Week"}
            </h2>
            {/* Dropdown for selecting time */}
            <div className="time-dropdown">
                <label htmlFor="time-select" className="time-label">Trending:</label>
                <select
                    id="time-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="time-select"
                >
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                </select>
            </div>

            {/* Error message */}
            {error && <p className="error-message">{error}</p>}

            {/* Horizontally scrollable movie list */}
            <div className="movie-list-container">
                <div className="movie-list">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <div key={movie.id} className="movie-item">
                                <Link to={`/movie/${movie.id}`}>
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title || "Movie Poster"}
                                            className="movie-poster"
                                        />
                                    ) : (
                                        <p className="poster-unavailable">[Poster Unavailable]</p>
                                    )}
                                    <h3 className="movie-title">
                                        {movie.title}{" "}
                                        {movie.release_date
                                            ? `(${movie.release_date.substring(0, 4)})`
                                            : ""}
                                    </h3>
                                </Link>
                            </div>
                        ))
                    ) : (
                        !error && <p className="loading-message">Loading movies...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrendingMovies;
