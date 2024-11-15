import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [keywords, setKeywords] = useState([]);

    const API_KEY = '9c371464b5857d6498e853bd22bd1f2b'; 

    // Fetch data from multi search endpoint
    const fetchData = async (query) => {
        if (!query) {
            setResults([]);
            setKeywords([]);
            return;
        }

        const multiSearchEndpoint = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}&language=en-US&page=1`;

        try {
            const response = await fetch(multiSearchEndpoint);
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Error fetching multi-search data:', error);
        }

        fetchKeywords(query);
    };

    // Fetch data from keyword search endpoint
    const fetchKeywords = async (query) => {
        const keywordSearchEndpoint = `https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=${query}&language=en-US&page=1`;

        try {
            const response = await fetch(keywordSearchEndpoint);
            const data = await response.json();
            setKeywords(data.results || []);
        } catch (error) {
            console.error('Error fetching keyword data:', error);
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
                    placeholder="Search for a movie, TV show, person, or keyword..."
                    value={input}
                    onChange={handleInputChange}
                />
            </div>

            <div className="results">
                {/* <h3>Search Results:</h3> */}
                {results.map((item) => (
                    <div key={item.id} className="result-item">
                        <p>
                            {item.title || item.name} {/* Display title for movies or name for TV/person */}
                        </p>
                        <small>
                            Type: {item.media_type === 'movie' ? 'Movie' : item.media_type === 'tv' ? 'TV Show' : 'Person'}
                        </small>
                    </div>
                ))}

                {keywords.length > 0 && (
                    <>
                        <h3>Keywords:</h3>
                        {keywords.map((keyword) => (
                            <div key={keyword.id} className="result-item">
                                <p>{keyword.name}</p>
                                <small>Type: Keyword</small>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};