import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);

    const fetchData = async (query) => {
        if (!query) {
            setResults([]); // Clear results if input is empty
            return;
        }

        const API_KEY = '9c371464b5857d6498e853bd22bd1f2b'; // Replace with your actual TMDB API key
        const endpoint = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&language=en-US&page=1`;

        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);
        fetchData(value);
    };

    return (
        <div className="search-bar">
            <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    value={input}
                    onChange={handleInputChange}
                />
            </div>
            <div className="results">
                {results.map((item) => (
                    <div key={item.id} className="result-item">
                        <p>
                            {item.title || item.name} {/* title for movies, name for people */}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
