import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { authenticateToken } from '../config/middleware.js';

const router = express.Router();

// Get all favorites for logged-in user
router.get('/favorites', authenticateToken, getFavorites);
/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all favorites for the logged-in user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of favorite movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The movie ID from TMDB.
 *                     example: 550
 *                   title:
 *                     type: string
 *                     description: The title of the movie.
 *                     example: Fight Club
 *                   overview:
 *                     type: string
 *                     description: A brief summary of the movie.
 *                     example: A depressed man forms an underground fight club.
 *                   release_date:
 *                     type: string
 *                     description: The release date of the movie.
 *                     example: 1999-10-15
 *       500:
 *         description: Failed to fetch favorites.
 */


// Add a movie to favorites
router.post('/favorites', authenticateToken, addFavorite);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a movie to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: string
 *                 description: The ID of the movie to add to favorites.
 *                 example: 550
 *     responses:
 *       200:
 *         description: Movie added to favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Added to favorites
 *       400:
 *         description: Movie already in favorites.
 *       500:
 *         description: Failed to add favorite.
 */
// Remove a movie from favorites
router.delete('/favorites/:movieId', authenticateToken, removeFavorite);

/**
 * @swagger
 * /favorites/{movieId}:
 *   delete:
 *     summary: Remove a movie from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to remove from favorites.
 *         example: 550
 *     responses:
 *       200:
 *         description: Movie removed from favorites.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Removed from favorites
 *       404:
 *         description: Movie not found in favorites.
 *       500:
 *         description: Failed to remove favorite.
 */
export default router; 