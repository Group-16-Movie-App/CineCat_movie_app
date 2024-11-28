import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// <------------------REGISTRATION ----------------------------------------->
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        
        // Check if all fields are provided
        if (!name || !email || !password) { 
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Check if email already exists
        const emailExists = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter' });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one number' });
        }
        
        // Hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO accounts (name, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, hashedPassword, false]);
        
        // Create access token
        const accessToken = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Create refresh token
        const refreshToken = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Save refresh token
        await pool.query('UPDATE accounts SET refresh_token = $1 WHERE id = $2', [refreshToken, result.rows[0].id]);

        res.json({ accessToken, refreshToken, message: 'Registration successful.' });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

// <------------------LOGIN ----------------------------------------->
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Create new refresh token
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // Save refresh token in db
        await pool.query('UPDATE accounts SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
};

// <------------------REFRESH TOKEN ----------------------------------------->
export const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Getting refresh token from db
    const result = await pool.query('SELECT * FROM accounts WHERE refresh_token = $1', [token]);
    if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
};

// <------------------LOGOUT ----------------------------------------->
export const logout = async (req, res) => {
    const userId = req.user.id; 
    await pool.query('UPDATE accounts SET refresh_token = NULL WHERE id = $1', [userId]);
    res.json({ message: 'Logged out successfully' });
};

// <------------------DELETE ACCOUNT ----------------------------------------->
export const deleteAccount = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); 
        
        await client.query('DELETE FROM favorites WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM shared_urls WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM reviews WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM members WHERE account_id = $1', [req.user.id]);
        await client.query('UPDATE ratings SET account_id = NULL WHERE account_id = $1', [req.user.id]);
        
        const result = await client.query('DELETE FROM accounts WHERE id = $1', [req.user.id]);
        
        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Account not found' });
        }
        
        await client.query('COMMIT'); 
        res.json({ message: 'Account deleted successfully' });
        
    } catch (error) {
        await client.query('ROLLBACK');  
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    } finally {
        client.release();  
    }
};
