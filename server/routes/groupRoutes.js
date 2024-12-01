import express from 'express';
import { getGroups, createGroup } from '../controllers/groupController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Define routes
router.get('/', getGroups);
router.post('/', auth, createGroup);

export default router;