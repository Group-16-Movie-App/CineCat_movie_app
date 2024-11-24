import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: 'All fields are required'
            });
        }

        // if email already exists
        const emailExists = await pool.query(
            'SELECT * FROM accounts WHERE email = $1',
            [email]
        );

        if (emailExists.rows.length > 0) {
            return res.status(400).json({ 
                error: 'Email already exists'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long'
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter'
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one number'
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hashedPassword]
        );
        
        // Create token for immediate login after registration
        const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET);
        
        res.json({ 
            token,
            id: result.rows[0].id,
            name,
            email,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error details:', error);

        if (error.code === '23505' && error.constraint === 'accounts_email_key') {
            return res.status(400).json({ 
                error: 'Email already exists'
            });
        }

        res.status(500).json({ 
            error: 'Registration failed. Please try again.'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required'
            });
        }

        const result = await pool.query(
            'SELECT * FROM accounts WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Invalid email or password'
            });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Invalid email or password'
            });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
        res.json({ 
            token,
            id: user.id, 
            name: user.name, 
            email: user.email 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed. Please try again.'
        });
    }
};

export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

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