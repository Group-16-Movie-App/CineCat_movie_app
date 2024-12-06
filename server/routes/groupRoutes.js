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
    addGroupComment,
    likeComment,
    getCommentLikes,
    requestToJoinGroup,
    handleMembershipRequest
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
router.post('/:groupId/comments/:commentId/like', auth, likeComment);
router.get('/:groupId/comments/:commentId/likes', auth, getCommentLikes);

router.post('/:groupId/join-request', auth, requestToJoinGroup);
router.post('/:groupId/members/:memberId', auth, handleMembershipRequest);

export default router;

