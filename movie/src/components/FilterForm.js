import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterForm = ({ onFilter }) => {
    const [year, setYear] = useState('');
    const [rating, setRating] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);

    useEffect(() => {
        // Fetch genres from backend API
        axios.get('http://localhost:5000/api/genre')
            .then(response => {
                // Add "All Genres" option at the beginning of the genres list
                const allGenresOption = { id: 0, name: 'All Genres' };
                setGenres([allGenresOption, ...response.data.genres]);
            })
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

    const handleGenreSelect = (genreId) => {
        console.log('Selected Genre ID: ' + genreId);
        setSelectedGenre(genreId === 0 ? '' : genreId.toString()); // Set to '' for "All Genres"// genreId is required to be a string
        setShowGenreDropdown(false); // Close the dropdown after selection
    };

    const handleFilter = () => {
        console.log('Applying Filters:', { year, rating, genre: selectedGenre });
        // Call onFilter with the updated filter data (no query parameter)
        onFilter({ year, rating, genre: selectedGenre });
    };

    return (
        <div >
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={() => setShowGenreDropdown(!showGenreDropdown)}>
                    {selectedGenre ? genres.find(genre => genre.id === parseInt(selectedGenre))?.name : 'All Genres'}
                </button>
                {showGenreDropdown && (
                    <div style={{
                        position: 'absolute', top: '100%', left: 0, backgroundColor: '#fff', border: '1px solid #ddd', zIndex: 1, maxHeight: '200px', overflowY: 'auto'
                    }}>
                        {genres.map((genre) => (
                            <div
                                key={genre.id}
                                onClick={() => handleGenreSelect(genre.id)}
                                style={{
                                    padding: '8px', cursor: 'pointer', backgroundColor: selectedGenre === genre.id ? '#ddd' : '#fff', color: 'black'
                                }}
                            >
                                {genre.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="Minimum Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            
            <button onClick={handleFilter}>Apply</button>
        </div>
    );
};

export default FilterForm;
