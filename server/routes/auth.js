import express from 'express';
import { register, login, logout, deleteAccount } from '../controllers/authController.js';
import { authenticateToken } from '../config/middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/account', authenticateToken, deleteAccount);

export default router;