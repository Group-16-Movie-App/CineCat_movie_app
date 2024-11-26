import {
  addReview,
  getAllReviews,
  getMovieReviews,
} from "../models/reviewModel.js";
import pool from '../config/database.js'; 

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

export const deleteReview = async (req, res) => {
  try {
      const { id } = req.params;
      const accountId = req.user.id; 

      const result = await pool.query(
          'DELETE FROM reviews WHERE id = $1 AND account_id = $2 RETURNING *',
          [id, accountId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({
              message: "Review not found or you don't have permission to delete it"
          });
      }

      res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
      console.error('Error in deleteReview:', error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            'SELECT r.*, m.title as movie_title FROM reviews r ' +
            'JOIN movies m ON r.movie_id = m.id ' +
            'WHERE r.account_id = $1 ' +
            'ORDER BY r.created_at DESC',
            [userId]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({
            message: "Failed to fetch user reviews",
            error: error.message
        });
    }
};