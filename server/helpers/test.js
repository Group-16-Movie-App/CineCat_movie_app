import fs from 'fs';
import path from 'path';
import pool from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { sign } = jwt;


const __dirname = import.meta.dirname;

const initializeTestDb = async() => {
    const sql = fs.readFileSync(path.resolve(__dirname,'../movie.sql'),'utf-8');
    await pool.query(sql);
};

const insertTestUser = async (name, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3)', 
            [name, email, hashedPassword]);
    } catch (error) {
        console.error('Error inserting test user:', error);
        throw error;
    }
};

const insertTestReview = async (movie_id, account_id, review, rating) => {
    try {
        await pool.query('INSERT INTO reviews (movie_id, account_id, review, rating) VALUES ($1, $2, $3, $4)', 
            [movie_id, account_id, review, rating]);
    } catch (error) {
        console.error('Error inserting test review:', error);
        throw error;
    }
};

const getToken = async (email) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET_KEY is not set in environment variables");
    }

    const result = await pool.query('SELECT id FROM accounts WHERE email = $1', [email]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const userId = result.rows[0].id;
    return sign({ id: userId, email: email }, process.env.JWT_SECRET);
};

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
    return result.rows[0] || null;
};

// const getLoginResponse = async (email, password) => {
//     try {
//         await fetch('http://localhost:5000/api/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 email: email,
//                 password: password,
//             }),
//         });
//     } catch (error) {
//         console.error('Error logging in: ', error);
//         throw error;
//     }
// }

export { initializeTestDb, insertTestUser, insertTestReview, getToken, findUserByEmail }