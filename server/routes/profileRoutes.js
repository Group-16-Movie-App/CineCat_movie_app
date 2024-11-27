import express from 'express';
import { shareProfile, getProfile, getSharedFavorites } from '../controllers/profileController.js';
import { authenticateToken } from '../config/middleware.js';

const router = express.Router();

// Generate or get a shared URL for a user's profile
router.post('/share', authenticateToken, shareProfile);

// Get shared profile data
router.get('/:userId', getProfile);

// Add new route for shared favorites
router.get('/favorites/:userId', getSharedFavorites);

export default router; 