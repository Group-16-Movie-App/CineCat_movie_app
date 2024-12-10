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

// Add a comment to a movie
export const addComment = async (req, res) => {
    const { movieId } = req.params;
    const { text } = req.body;
    const userId = req.user.id; // Assuming you have user authentication

    try {
        const result = await pool.query(
            'INSERT INTO comments (movie_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
            [movieId, userId, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

// Get comments for a movie
export const getComments = async (req, res) => {
    const { movieId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM comments WHERE movie_id = $1',
            [movieId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};