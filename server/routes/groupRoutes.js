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
    handleMembershipRequest,
    deleteGroup,
    getUserById,
    getCreatedGroups
} from '../controllers/groupController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGroups);
router.get('/:id', getGroupById);  
router.get('/:id/members', getGroupMembers);  
router.get('/:id/movies', getGroupMovies);  
router.get('/:id/schedules', getGroupSchedules);  
router.get('/:id/membership-requests', getMembershipRequests);  
router.post('/', auth, createGroup); 
router.post('/:groupId/movies', auth, addMovieToGroup);  
router.post('/:groupId/schedules', auth, addScheduleToGroup);  
router.post('/:groupId/members', auth, addMember);  
router.post('/:groupId/join-request', auth, requestToJoinGroup);  
router.post('/:groupId/comments', auth, addGroupComment);  
router.post('/:groupId/comments/:commentId/like', auth, likeComment);  
router.delete('/:groupId', auth, deleteGroup);  
router.delete('/:groupId/members/:memberId', auth, removeMember);  
router.get('/:groupId/comments', auth, getGroupComments); 
router.get('/:groupId/comments/:commentId/likes', auth, getCommentLikes);   
router.post('/:groupId/members/:memberId', auth, handleMembershipRequest);  
router.get('/users/:id', getUserById);
router.get('/created/:userId', getCreatedGroups);

export default router;
