import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import FilterForm from '../components/FilterForm';

const FilterPage = () => {
    const [movies, setMovies] = useState([]);
    const [genreNames, setGenreNames] = useState({});
    const [filters, setFilters] = useState({
        rating: '',
        genre: '',
        year: ''
    });
    // Pagination
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const handleFilter = (filterData) => {
        setFilters((prev) => ({ ...prev, ...filterData }));
    };

    useEffect(() => {
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
                setPageCount(Math.min(response.data.total_pages, 500)); // Only shows 500 pages at maximum because tmdb api doesn't allow to access to pages higher than that
                setMovies(response.data.results || []);
            } catch (error) {
                console.error('Error fetching filtered results:', error);
            }
        };
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
                <h1>Discovery Movies</h1>
                <FilterForm onFilter={handleFilter} />
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
