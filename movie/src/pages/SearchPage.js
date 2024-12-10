import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import SearchForm from '../components/SearchForm';
import '../components/SearchBar.css';


const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [genreNames, setGenreNames] = useState({});
    // Paginate
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0)

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

    if (!query.trim()) {
        return <div style={{width:'100%', textAlign:'center', minHeight: '100vh'}}>
                    <h1 className="search-title">Search Movies</h1>
                    <SearchForm onSearch={handleSearch} />
                    <div className="search-prompt">
                        What movie are you lookin for? Please enter a title movie
                    </div>
                </div>
    } else {
        return (
            <>
                <div style={{width:'100%', textAlign:'center', minHeight: '100vh'}}>
                    <h1 className="search-title">Search Movies</h1>
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
            </>
        );
    }
};

export default SearchPage;
