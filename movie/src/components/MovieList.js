import React from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './MovieList.css'

const MovieList = ({ movies, genreNames, pageCount, setPage }) => {
    console.log('Movies to render:', movies);
    console.log('Genre Mapping:', genreNames); // Debug genres

    const handlePageChange = (selectedPage) => {
        setPage(selectedPage.selected + 1);
    }

    if (!movies || movies.length === 0) {
        return <div>No movies found.</div>;
    }
    return (
        <div className="movie-list-container">
            <div className="pagination-container">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                />
            </div>
            <div className="movie-list-grid">
                {movies.map((movie) => {
                    // Extract the release year from release_date
                    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";

                    return (
                            <div key={movie.id} className="movie-card">
                                <Link to={`/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                                    <h3>{movie.title} ({releaseYear})</h3>
                                </Link>
                                <p className="rating">TMDB Rating: {movie.vote_average.toFixed(2)}</p>
                                <p className="genres">
                                    Genres:{" "}
                                    {movie.genre_ids
                                        .map(id => genreNames[id] || "Unknown")
                                        .join(', ')}
                                </p>
                            </div>
                    );
                })}
            </div>
        </div>
    )};

export default MovieList;
