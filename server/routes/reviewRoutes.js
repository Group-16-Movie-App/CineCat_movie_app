// import express from "express";
// import {
//   addReviewController,
//   getAllReviewsController,
//   getReviewByIdController,
// } from "../controllers/reviewController.js";
// import authMiddleware from "../routes/auth.js";

// const router = express.Router();

// router.post("/", authMiddleware, addReviewController); // Auth required
// router.get("/", getAllReviewsController); // Public route
// router.get("/:id", getReviewByIdController); // Public route

// export default router;

// import express from "express";
// import { authenticateUser } from "../middleware/auth.js"; // Your authentication middleware
// import {
//   addReviewController,
//   getAllReviewsController,
//   getReviewByIdController,
// } from "../controllers/reviewController.js";

// const router = express.Router();

// // Apply authentication middleware only to routes that need it
// router.post("/", authenticateUser, addReviewController);
// router.get("/", getAllReviewsController);
// router.get("/:id", getReviewByIdController);

// export default router;

import express from "express";
import {
  createReview,
  getReviews,
  getReviewsByMovie,
  deleteReview 
} from "../controllers/reviewController.js";
import auth from "../middlewares/auth.js";


const router = express.Router();

// Public routes
router.get("/", getReviews);
router.get("/movie/:movieId", getReviewsByMovie);

// Protected routes (require authentication)
router.post("/", auth, createReview);
router.delete("/:id", auth, deleteReview); 

export default router;