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
        year: '',
        page: 1,
    });

    const handleFilter = (filterData) => {
        setFilters((prev) => ({ ...prev, ...filterData }));
    };

    useEffect(() => {
        const fetchMovies = async () => {
            if (!Object.values(filters).some((value) => value)) return; // Skip if no filters
            try {
                const response = await axios.get('http://localhost:5000/api/filter/movies', {
                    params: {
                        rating: filters.rating || undefined,
                        genre: filters.genre || undefined,
                        year: filters.year || undefined,
                        page: filters.page || 1,
                    },
                });
                setMovies(response.data.results || []);
            } catch (error) {
                console.error('Error fetching filtered results:', error);
            }
        };
        fetchMovies();
    }, [filters]);

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
        <div style={{width:'100%', textAlign:'center'}}>
            <h1>Discovery Movies</h1>
            <FilterForm onFilter={handleFilter} />
            <MovieList movies={movies} genreNames={genreNames} />
        </div>
    );
};

export default FilterPage;
