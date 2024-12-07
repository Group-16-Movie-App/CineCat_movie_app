import express from 'express';
import { register, login, logout, deleteAccount, verifyEmail  } from '../controllers/authController.js';
import auth from '../middlewares/auth.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.delete('/auth/account', auth, deleteAccount); 
router.get('/verify-email', verifyEmail);

export default router;