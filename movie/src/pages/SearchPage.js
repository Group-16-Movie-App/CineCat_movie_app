import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import SearchForm from '../components/SearchForm';

export const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [genreNames, setGenreNames] = useState({});
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const handleSearch = ({ query, year }) => {
        if (!query.trim()) {
            alert('Please, enter a title');
            return;
        }
        setQuery(query);
        setYear(year);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return;
            try {
                const response = await axios.get('http://localhost:5000/api/search/movies', {
                    params: { query, year: year || undefined, page },
                });
                setMovies(response.data.results || []);
                setPageCount(response.data.total_pages)
                console.log('movie Data from search',response.data.results)
            } catch (error) {
                console.error('Error fetching search results:', error);
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
                console.log('genreMap',genreMap);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    if (!query.trim()) {
        return (
            <div className="search-page-container">
                <h2 className="search-title">Search Movies</h2>
                <SearchForm onSearch={handleSearch} />
                <div className="search-prompt">
                What movie are you looking for? <br /> Please, write the title.
                </div>
            </div>
        );
    } else {
        return (
            <div className="search-page-container">
                <h2 className="search-title">Search Movies</h2>
                <SearchForm onSearch={handleSearch} />
                <button type="submit" className="search-button">
                    Search
                </button>
                <MovieList 
                    movies={movies} 
                    genreNames={genreNames}
                    pageCount={pageCount}
                    setPage={setPage}
                />
            </div>
        );
    }
};

export default SearchPage;
