import express from 'express';
import { searchMovies, filterMovies, getMovieDetails, getGenres } from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/search/movies', searchMovies);
router.get('/filter/movies', filterMovies);
router.get('/movies/:id', getMovieDetails);
router.get('/genre', getGenres);

export default router;