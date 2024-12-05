import express from 'express';
import {
    getGroups,
    createGroup,
    getGroupById,
    getGroupMembers,
    getGroupMovies,
    getGroupSchedules,
    addMovieToGroup,
    addScheduleToGroup,
    getMembershipRequests,
    acceptMember,
    rejectMember,
    addMember,
    removeMember,
    getGroupComments,
    addGroupComment
} from '../controllers/groupController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Define routes
router.get('/', getGroups);
router.post('/', auth, createGroup);
router.get('/:id', getGroupById);
router.get('/:groupId/members', getGroupMembers);
router.get('/:groupId/movies', getGroupMovies);
router.get('/:groupId/schedules', getGroupSchedules);
router.post('/:groupId/movies', auth, addMovieToGroup);
router.post('/:groupId/schedules', auth, addScheduleToGroup);
router.get('/:groupId/membership-requests', getMembershipRequests);
router.post('/:groupId/members', auth, addMember);
router.delete('/:groupId/members/:memberId', auth, removeMember);

// New routes for comments
router.get('/:groupId/comments', auth, getGroupComments);
router.post('/:groupId/comments', auth, addGroupComment);

export default router;