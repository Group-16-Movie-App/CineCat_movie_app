import express from 'express';
import { getTrendingMovies } from '../controllers/movieController.js';

const router = express.Router();

// Define the route for fetching trending movies
router.get('/movies/trending', getTrendingMovies);

export default router;