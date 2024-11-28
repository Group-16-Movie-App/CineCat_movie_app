import express from 'express';
import { register,login, logout, deleteAccount, refreshToken  } from '../controllers/authController.js';
import auth from '../middlewares/auth.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken)
router.post('/logout', auth, logout);
router.delete('/auth/account', auth, deleteAccount); 

export default router;
