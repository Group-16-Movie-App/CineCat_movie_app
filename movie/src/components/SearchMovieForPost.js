import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MovieListForPost from './MovieListForPost';
import SearchForm from './SearchForm';
import PostCreationModal from './PostCreationModal';

export const SearchMovieForPost = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [genreNames, setGenreNames] = useState({});
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleSearch = ({ query, year }) => {
        if (!query.trim()) {
            alert('Please enter a title');
            return;
        }
        setQuery(query);
        setYear(year);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return;
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:5000/api/search/movies', {
                    params: { query, year: year || undefined, page },
                });
                setMovies(response.data.results || []);
                setPageCount(response.data.total_pages);
            } catch (err) {
                setError('Failed to fetch movies. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [query, year, page]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genre');
                const genreMap = response.data.genres.reduce((map, genre) => {
                    map[genre.id] = genre.name;
                    return map;
                }, {});
                setGenreNames(genreMap);
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };
        fetchGenres();
    }, []);

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const handleShareToGroup = (movie) => {
        // Implement logic to open PostCreationModal with movie details
        setSelectedMovie(movie);
    };

    return (
        <div style={{ width: '100%', textAlign: 'center', minHeight: '100vh' }}>
            <h1>Search Movies</h1>
            <SearchForm onSearch={handleSearch} />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : !query.trim() ? (
                <div style={{ marginTop: '20px' }}>
                    What movie are you looking for? Please enter a title movie
                </div>
            ) : movies.length === 0 ? (
                <div>No movies found for your search query.</div>
            ) : (
                <MovieListForPost
                    movies={movies}
                    genreNames={genreNames}
                    pageCount={pageCount}
                    setPage={setPage}
                    onMovieClick={handleSelectMovie}
                    onShareToGroup={handleShareToGroup}
                />
            )}
            {selectedMovie && (
                <PostCreationModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    );
};

SearchMovieForPost.propTypes = {
    onSelectMovie: PropTypes.func.isRequired,
};

export default SearchMovieForPost;