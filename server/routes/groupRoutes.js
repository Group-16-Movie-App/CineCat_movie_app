import express from 'express';
import { getGroups } from '../controllers/groupController.js';

const router = express.Router();

// Define the route for fetching groups
router.get('/groups', getGroups);

export default router;