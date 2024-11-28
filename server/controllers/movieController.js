import pool from '../config/database.js'; // Adjust the import based on your database setup

export const getTrendingMovies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies WHERE trending = true'); // Adjust the query as needed
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        res.status(500).json({ message: 'Failed to fetch trending movies' });
    }
};