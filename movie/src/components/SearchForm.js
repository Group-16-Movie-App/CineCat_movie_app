import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ query, year });
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="input-wrapper">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                />
            </div>
            
            <div className="input-wrapper">
                <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                />
            </div>
            
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
};

export default SearchForm;
