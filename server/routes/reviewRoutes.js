/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

import express from "express";
import {
  createReview,
  getReviews,
  getReviewsByMovie,
  deleteReview,
  getReviewsByUser,
} from "../controllers/reviewController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve all reviews in the system.
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 movie_id: "123"
 *                 user_email: "user@example.com"
 *                 description: "Amazing movie!"
 *                 rating: 5
 *                 created_at: "2024-12-13T12:00:00Z"
 *       500:
 *         description: Failed to fetch reviews.
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to fetch reviews"
 */
router.get("/", getReviews);

/**
 * @swagger
 * /reviews/movie/{movieId}:
 *   get:
 *     summary: Get reviews for a movie
 *     description: Retrieve reviews for a specific movie by its ID.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the movie.
 *     responses:
 *       200:
 *         description: A list of reviews for the movie.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 user_email: "user@example.com"
 *                 description: "Amazing movie!"
 *                 rating: 5
 *                 created_at: "2024-12-13T12:00:00Z"
 *       500:
 *         description: Failed to fetch reviews.
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to fetch reviews"
 */
router.get("/movie/:movieId", getReviewsByMovie);

/**
 * @swagger
 * /reviews/user/{userId}:
 *   get:
 *     summary: Get reviews by a user
 *     description: Retrieve all reviews submitted by a specific user.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: A list of user reviews.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 movie_id: "123"
 *                 description: "Loved it!"
 *                 rating: 5
 *                 created_at: "2024-12-13T12:00:00Z"
 *                 movie_title: "Inception"
 *       500:
 *         description: Failed to fetch user reviews.
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to fetch user reviews"
 */
router.get("/user/:userId", getReviewsByUser);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Submit a new review for a movie. Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               description:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *             required:
 *               - movieId
 *               - description
 *               - rating
 *           example:
 *             movieId: "123"
 *             description: "Fantastic movie!"
 *             rating: 5
 *     responses:
 *       201:
 *         description: Review added successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review added successfully"
 *               review:
 *                 id: 1
 *                 movie_id: "123"
 *                 description: "Fantastic movie!"
 *                 rating: 5
 *                 created_at: "2024-12-13T12:00:00Z"
 *       400:
 *         description: Bad request. Missing or invalid input.
 *         content:
 *           application/json:
 *             example:
 *               message: "Movie ID, description, and rating are required"
 *       500:
 *         description: Failed to create the review.
 *         content:
 *           application/json:
 *             example:
 *               message: "Failed to create review"
 */
router.post("/", auth, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete a review by its ID. Requires authentication.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the review.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review deleted successfully"
 *       404:
 *         description: Review not found or no permission to delete.
 *         content:
 *           application/json:
 *             example:
 *               message: "Review not found or you don't have permission to delete it"
 *       500:
 *         description: Failed to delete the review.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error"
 */
router.delete("/:id", auth, deleteReview);

export default router;
