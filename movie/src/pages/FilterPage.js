import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import './FilterPage.css';  // Make sure to import the CSS

const FilterPage = () => {
    const [movies, setMovies] = useState([]);
    const [genreNames, setGenreNames] = useState({});
    const [showGenres, setShowGenres] = useState(false);  // Add this state
    const [filters, setFilters] = useState({
        rating: '',
        genre: '',
        year: ''
    });
    // Pagination
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    // Add these new functions
    const handleGenreToggle = () => {
        setShowGenres(!showGenres);
    };

    const handleApply = () => {
        // Implement your apply logic here
        // For example, you might want to trigger the movie fetch
        fetchMovies();
    };

    const handleFilter = (filterData) => {
        setFilters((prev) => ({ ...prev, ...filterData }));
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/filter/movies', {
                params: {
                    rating: filters.rating,
                    genre: filters.genre,
                    year: filters.year,
                    page
                },
            });
            setPageCount(Math.min(response.data.total_pages, 500));
            setMovies(response.data.results || []);
        } catch (error) {
            console.error('Error fetching filtered results:', error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [filters, page]);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genre');
                const genreMap = response.data.genres.reduce((map, genre) => {
                    map[genre.id] = genre.name; // Map genre ID to name
                    return map;
                }, {});
                setGenreNames(genreMap);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    return (  
        <>
            <div style={{width:'100%', textAlign:'center'}}>
                <h1 className="discovery-title">Discovery Movies</h1>
                <div className="filter-controls">
                    <div className="input-group">
                        <label className="filter-label">Year</label>
                        <input
                            type="number"
                            value={filters.year}
                            onChange={(e) => handleFilter({ year: e.target.value })}
                            className="filter-input"
                            placeholder="Enter year..."
                        />
                    </div>
                    
                    <div className="input-group">
                        <label className="filter-label">Minimum Rating</label>
                        <input
                            type="number"
                            value={filters.rating}
                            onChange={(e) => handleFilter({ rating: e.target.value })}
                            className="filter-input"
                            placeholder="Enter minimum rating..."
                            step="0.1"
                            min="0"
                            max="10"
                        />
                    </div>

                    <div className="button-group">
                        <button 
                            onClick={handleGenreToggle} 
                            className={`filter-button ${showGenres ? 'active' : ''}`}
                        >
                            All Genres
                        </button>
                        <button 
                            onClick={handleApply}
                            className="filter-button"
                        >
                            Apply
                        </button>
                    </div>
                </div>
                <MovieList 
                    movies={movies} 
                    genreNames={genreNames}
                    pageCount={pageCount}
                    setPage={setPage}
                />
            </div>
        </>         
    );
};

export default FilterPage;
