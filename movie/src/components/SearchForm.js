import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        onSearch({ query, year });
    };

    return (
        <div>
            <h2>Search for Movies</h2>
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <div>
                <button onClick={() => navigate('/filter')}>Go to Filters</button>
            </div>
        </div>
    );
};

export default SearchForm;
