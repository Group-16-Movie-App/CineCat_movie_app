import express from 'express';
import { searchMovies, filterMovies, getMovieDetails, getGenres, getTrendingMovies } from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/search/movies', searchMovies);
router.get('/filter/movies', filterMovies);
router.get('/movies/:id', getMovieDetails);
router.get('/genre', getGenres);
router.get('/trending/movies/:time', getTrendingMovies);

export default router;