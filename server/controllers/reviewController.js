// import {
//   addReview,
//   getAllReviews,
//   getReviewById,
// } from "../models/reviewModel.js";

// // Add a new review
// export const addReviewController = async (req, res, next) => {
//   try {
//     // Check if the user is authenticated
//     if (!req.user || !req.user.id) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized. Please log in to add a review." });
//     }

//     const { movie_id, review } = req.body;
//     const account_id = req.user.id; // Safely access the user id
//     console.log("account_id", account_id);

//     if (!movie_id || !review) {
//       return res
//         .status(400)
//         .json({ error: "Movie ID and review content are required." });
//     }

//     const result = await pool.query(
//       "INSERT INTO reviews (movie_id, account_id, review) VALUES ($1, $2, $3) RETURNING *",
//       [movie_id, account_id, review]
//     );

//     res.status(201).json({
//       message: "Review added successfully",
//       review: result.rows[0],
//     });
//   } catch (error) {
//     console.error("Error adding review:", error.message);
//     next(error);
//   }
// };


// // Get all reviews
// export const getAllReviewsController = async (req, res, next) => {
//   try {
//     const reviews = await getAllReviews();
//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error("Error fetching reviews:", error.message);
//     next(error);
//   }
// };

// // Get a review by ID
// export const getReviewByIdController = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const review = await getReviewById(id);

//     if (!review) {
//       return res.status(404).json({ error: "Review not found" });
//     }

//     res.status(200).json(review);
//   } catch (error) {
//     console.error("Error fetching review:", error.message);
//     next(error);
//   }
// };
import {
  addReview,
  getAllReviews,
  getMovieReviews,
} from "../models/reviewModel.js";

export const createReview = async (req, res) => {
  try {
    const { movieId, description, rating } = req.body;
    const email = req.user.email; // From auth middleware

    // Validate input
    if (!movieId || !description || !rating || !email) {
      return res.status(400).json({
        message: "Movie ID, description, and rating are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const newReview = await addReview(movieId, email, description, rating);
    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

export const getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await getMovieReviews(movieId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    res.status(500).json({
      message: "Failed to fetch movie reviews",
      error: error.message,
    });
  }
};