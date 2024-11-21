import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './Pagination.css';
import MovieList from '../components/MovieList';
import SearchForm from '../components/SearchForm';


const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [genreNames, setGenreNames] = useState({});
    // Paginate
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0)
    const navigate = useNavigate();

    const handleSearch = ({ query, year }) => {
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

    return (
        <>
            <button onClick={() => navigate('/')}>Back to Home</button>
            <div style={{width:'100%', textAlign:'center'}}>
                <h1 >Search Movies</h1>
                <SearchForm onSearch={handleSearch} />
                <div className="pagination-container">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={(page) => setPage(page.selected + 1)}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                    />
                </div>
                <MovieList movies={movies} genreNames={genreNames} />
            </div>
        </>
    );
};

export default SearchPage;
