import express from 'express';
import { getTrendingMovies, addComment, getComments } from '../controllers/movieController.js';

const router = express.Router();

// Define the route for fetching trending movies
router.get('/movies/trending', getTrendingMovies);

// Add routes for comments
router.post('/:movieId/comments', addComment);
router.get('/:movieId/comments', getComments);

export default router;