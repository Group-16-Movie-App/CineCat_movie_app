import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');

    const handleSearch = () => {
        onSearch({ query, year });
    };

    return (
        <div style={{width:'fit-content', margin:'auto', padding: 8, display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
};

export default SearchForm;
