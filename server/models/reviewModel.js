import pool from "../config/database.js";
import axios from 'axios';

export const addReview = async (movieId, email, description, rating) => {
  
    const accountQuery = `
        SELECT id FROM accounts WHERE email = $1
    `;
    const accountResult = await pool.query(accountQuery, [email]);
    const accountId = accountResult.rows[0].id;

    const query = `
        INSERT INTO reviews (movie_id, account_id, review, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [movieId, accountId, description, rating];
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

    // Fetch movie details for each review in parallel
    const reviews = await Promise.all(
        result.rows.map(async (review) => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${review.movie_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.TMDB_Token}`
                        }
                    }
                );
                // Merge the movie details with the review data
                return {
                    ...review,
                    poster_path: response.data.poster_path,
                    movie_title: response.data.title,
                    release_date: response.data.release_date,
                };
            } catch (error) {
                console.error(`Error fetching movie details for movie_id ${review.movie_id}:`, error);
                // If API call fails
                return {
                    ...review,
                    movie_title: "Unknown Title",
                    release_date: null,
                    poster_path: null
                };
            }
        })
    );

    return reviews;
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