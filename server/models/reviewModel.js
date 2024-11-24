// import pool from "../config/database.js";

// // Add a new review
// export const addReview = async (movie_id, account_id, review) => {
//   const query = `
//     INSERT INTO reviews (movie_id, account_id, review)
//     VALUES ($1, $2, $3)
//     RETURNING *;
//   `;
//   const values = [movie_id, account_id, review];
//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// // Get all reviews
// export const getAllReviews = async () => {
//   const query = `
//     SELECT r.id, r.movie_id, r.review, r.created, a.email AS reviewer_email
//     FROM reviews r
//     JOIN accounts a ON r.account_id = a.id
//     ORDER BY r.created DESC;
//   `;
//   const result = await pool.query(query);
//   return result.rows;
// };

// // Get a specific review by ID
// export const getReviewById = async (id) => {
//   const query = `
//     SELECT r.id, r.movie_id, r.review, r.created, a.email AS reviewer_email
//     FROM reviews r
//     JOIN accounts a ON r.account_id = a.id
//     WHERE r.id = $1;
//   `;
//   const result = await pool.query(query, [id]);
//   return result.rows[0];
// };

import pool from "../config/database.js";

export const addReview = async (movieId, email, description, rating) => {
  const query = `
        INSERT INTO reviews (movie_id, email, description, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
  const values = [movieId, email, description, rating];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllReviews = async () => {
  const query = `
        SELECT r.*, a.name as reviewer_name
        FROM reviews r
        JOIN accounts a ON r.email = a.email
        ORDER BY r.timestamp DESC;
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const getMovieReviews = async (movieId) => {
  const query = `
        SELECT r.*, a.name as reviewer_name
        FROM reviews r
        JOIN accounts a ON r.email = a.email
        WHERE r.movie_id = $1
        ORDER BY r.timestamp DESC;
    `;
  const result = await pool.query(query, [movieId]);
  return result.rows;
};