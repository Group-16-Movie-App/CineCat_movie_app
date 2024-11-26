import axios from 'axios';

export const fetchGenres = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/genre');
        const allGenresOption = { id: 0, name: 'All Genres' };
        return [allGenresOption, ...response.data.genres];
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};
