import express from "express";
import {
  shareProfile,
  getProfile,
  getSharedFavorites,
} from "../controllers/profileController.js";
import { authenticateToken } from "../config/middleware.js";

const router = express.Router();

/**
 * @swagger
 * /profile/share:
 *   post:
 *     summary: Generate or retrieve a shared profile URL
 *     description: Creates a new shared URL for the authenticated user or retrieves the existing one.
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: [] # Specifies that the endpoint requires a Bearer token for authentication.
 *     responses:
 *       200:
 *         description: Shared URL retrieved or generated successfully.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               url: "12345-1696782938472"
 *       401:
 *         description: Unauthorized. The request is missing a valid authentication token.
 *         content:
 *           application/json:
 *             example:
 *               error: "Access denied. No token provided."
 *       403:
 *         description: Forbidden. The token is invalid or expired.
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid or expired token."
 *       500:
 *         description: Internal server error. Failed to generate or retrieve the shared URL.
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to share profile."
 */

router.post("/share", authenticateToken, shareProfile);

/**
 * @swagger
 * /profile/{userId}:
 *   get:
 *     summary: Fetch a user's profile
 *     description: Retrieve the profile details (name, email, etc.) and their favorite movies.
 *     tags: [Profiles]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose profile is being fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               userName: "John Doe"
 *               favorites:
 *                 - id: 123
 *                   title: "Inception"
 *                   release_date: "2010-07-16"
 *                   overview: "A mind-bending thriller."
 *       404:
 *         description: Profile not found.
 *         content:
 *           application/json:
 *             example:
 *               error: "Profile not found"
 *       500:
 *         description: Failed to fetch profile.
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to fetch profile"
 */
router.get("/:userId", getProfile);

/**
 * @swagger
 * /profile/favorites/{userId}:
 *   get:
 *     summary: Fetch a user's shared favorites
 *     description: Retrieve the user's favorite movies based on their account ID.
 *     tags: [Profiles]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose favorites are being fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorites fetched successfully.
 *         content:
 *           application/json:
 *             example:
 *               - id: 123
 *                 title: "Inception"
 *                 release_date: "2010-07-16"
 *                 overview: "A mind-bending thriller."
 *       500:
 *         description: Failed to fetch shared favorites.
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to fetch shared favorites"
 */
router.get("/favorites/:userId", getSharedFavorites);

export default router;
