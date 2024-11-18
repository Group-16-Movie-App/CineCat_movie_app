import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import SearchForm from '../components/SearchForm';

const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [genreNames, setGenreNames] = useState({});

    const handleSearch = ({ query, year }) => {
        setQuery(query);
        setYear(year);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return;
            try {
                const response = await axios.get('http://localhost:5000/api/search/movies', {
                    params: { query, year: year || undefined },
                });
                setMovies(response.data.results || []);
                console.log('movie Data from search',response.data.results)
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        fetchMovies();
    }, [query, year]);

    // Fetch genre data
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/genre');
                const genreMap = response.data.genres.reduce((map, genre) => {
                    map[genre.id] = genre.name; // Map genre ID to name
                    return map;
                }, {});
                setGenreNames(genreMap);
                console.log('genreMap',genreMap);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    return (
        <div style={{width:'100%', textAlign:'center'}}>
            <h1 >Search Movies</h1>
            <SearchForm onSearch={handleSearch} />
            <MovieList movies={movies} genreNames={genreNames} />
        </div>
    );
};

export default SearchPage;
