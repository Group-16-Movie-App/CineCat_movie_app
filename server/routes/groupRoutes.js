import express from 'express';
import { 
    getGroups, 
    createGroup, 
    getGroupById, 
    getGroupMembers, 
    getGroupMovies, 
    getGroupSchedules, 
    getMembershipRequests 
} from '../controllers/groupController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Define routes
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.get('/:id/members', getGroupMembers);
router.get('/:id/movies', getGroupMovies);
router.get('/:id/schedules', getGroupSchedules);
router.get('/:id/membership-requests', getMembershipRequests);
router.post('/', auth, createGroup);

export default router;