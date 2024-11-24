import pool from "../config/db.js";

export const getAllReviews = async () => {
  const query = `
        SELECT * FROM reviews 
        ORDER BY timestamp DESC
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const getMovieReviews = async (movieId) => {
  const query = `
        SELECT * FROM reviews 
        WHERE movie_id = $1 
        ORDER BY timestamp DESC
    `;
  const result = await pool.query(query, [movieId]);
  return result.rows;
};

export const addReview = async (movieId, description, rating, email) => {
  const query = `
        INSERT INTO reviews (movie_id, description, rating, email) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;
  const values = [movieId, description, rating, email];
  const result = await pool.query(query, values);
  return result.rows[0];
};
