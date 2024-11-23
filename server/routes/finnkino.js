import express from 'express';
import { getTheatres, getSchedules, getEventDetails } from '../controllers/finnkinoController.js';

const router = express.Router();

router.get('/theatres', getTheatres);
router.get('/schedules/:theatreId', getSchedules);
router.get('/events/:eventId', getEventDetails);

export default router;