import pool from '../config/database.js';
import axios from 'axios';

export const shareProfile = async (req, res) => {
    try {
        // Check if user already has a shared URL
        const existingUrl = await pool.query(
            'SELECT url FROM shared_urls WHERE account_id = $1',
            [req.user.id]
        );

        if (existingUrl.rows.length > 0) {
            return res.json({ url: existingUrl.rows[0].url });
        }

        // Generate a new shared URL
        const url = `${req.user.id}-${Date.now()}`;
        await pool.query(
            'INSERT INTO shared_urls (account_id, url) VALUES ($1, $2)',
            [req.user.id, url]
        );

        res.json({ url });
    } catch (error) {
        console.error('Error sharing profile:', error);
        res.status(500).json({ error: 'Failed to share profile' });
    }
};

export const getProfile = async (req, res) => {
    try {
        // Get user info (excluding password)
        const userResult = await pool.query(
            'SELECT id, name, email FROM accounts WHERE id = $1',
            [req.params.userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const user = userResult.rows[0];

        // Get user's favorites
        const favoritesResult = await Promise.all([
            pool.query('SELECT movie_id FROM favorites WHERE account_id = $1', [req.params.userId]),
            ...userResult.rows[0].movie_id.map(id => 
                axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.TMDB_Token}`
                    }
                })
            )
        ]);
        
        // Combine user data with favorites
        const profileData = {
            userName: user.name,
            favorites: favoritesResult.map(response => response.data)
        };

        res.json(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}; 