import express from "express";
import {
  createReview,
  getReviews,
  getReviewsByMovie,
  deleteReview,
  getReviewsByUser
} from "../controllers/reviewController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getReviews);
router.get("/movie/:movieId", getReviewsByMovie);
router.get("/user/:userId", getReviewsByUser);

// Protected routes (require authentication)
router.post("/", auth, createReview);
router.delete("/:id", auth, deleteReview);

export default router;