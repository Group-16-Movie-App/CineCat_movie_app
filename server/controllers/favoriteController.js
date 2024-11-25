import pool from '../config/database.js';
import axios from 'axios';

export const getFavorites = async (req, res) => {
    try {
        // First, get all movie IDs that this user has favorited from our database
        const result = await pool.query(
            'SELECT movie_id FROM favorites WHERE account_id = $1',
            [req.user.id]
        );
        
        // For each favorited movie ID, fetch the full movie details from TMDB API
        // We use Promise.all to fetch all movies in parallel for better performance
        const favorites = await Promise.all(
            result.rows.map(async (row) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${row.movie_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.TMDB_Token}`
                        }
                    }
                );
                return response.data;
            })
        );
        
        // Send the complete movie details back to the client
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const { movie_id } = req.body;
        
        // Check if this movie is already in user's favorites to prevent duplicates
        const existing = await pool.query(
            'SELECT * FROM favorites WHERE account_id = $1 AND movie_id = $2',
            [req.user.id, movie_id]
        );
        
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Movie already in favorites' });
        }
        
        // If not already favorited, add it to the database
        await pool.query(
            'INSERT INTO favorites (account_id, movie_id) VALUES ($1, $2)',
            [req.user.id, movie_id]
        );
        
        res.json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        // Delete the favorite record for this user and movie
        await pool.query(
            'DELETE FROM favorites WHERE account_id = $1 AND movie_id = $2',
            [req.user.id, req.params.movieId]
        );
        
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
}; 