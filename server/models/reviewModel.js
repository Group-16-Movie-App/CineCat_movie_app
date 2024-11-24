import pool from "../config/database.js";


export const addReview = async (movieId, email, description) => {
  
    const accountQuery = `
        SELECT id FROM accounts WHERE email = $1
    `;
    const accountResult = await pool.query(accountQuery, [email]);
    const accountId = accountResult.rows[0].id;

    const query = `
        INSERT INTO reviews (movie_id, account_id, review)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [movieId, accountId, description];
    const result = await pool.query(query, values);
    return result.rows[0];
};


export const getAllReviews = async () => {
    const query = `
        SELECT r.*, a.email, a.name
        FROM reviews r
        JOIN accounts a ON r.account_id = a.id
        ORDER BY r.created DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};


export const getMovieReviews = async (movieId) => {
    const query = `
        SELECT r.*, a.email, a.name
        FROM reviews r
        JOIN accounts a ON r.account_id = a.id
        WHERE r.movie_id = $1
        ORDER BY r.created DESC;
    `;
    const result = await pool.query(query, [movieId]);
    return result.rows;
};