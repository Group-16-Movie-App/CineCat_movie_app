import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../config/middleware.js';

const router = express.Router();

// Get all favorites for logged-in user
router.get('/favorites', authenticateToken, getFavorites);

// Add a movie to favorites
router.post('/favorites', authenticateToken, addFavorite);

// Remove a movie from favorites
router.delete('/favorites/:movieId', authenticateToken, removeFavorite);

export default router; 