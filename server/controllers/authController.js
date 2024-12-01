import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import pool from '../config/database.js';


dotenv.config(); 

// SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (email, token) => {
    const verificationUrl = `http://localhost:5000/api/verify-email?token=${token}`;

    const msg = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Email Verification',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h1>Welcome to Our Platform!</h1>
            <p>Thank you for registering. Please verify your email by clicking the button below:</p>
            
            <!-- Using a table for the button to ensure it works across email clients -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto; border: none;">
                <tr>
                    <td align="center" style="background-color: #007BFF; border-radius: 5px;">
                        <a href="${verificationUrl}" style="display: inline-block; background-color: #007BFF; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                            Verify Email
                        </a>
                    </td>
                </tr>
            </table>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}" style="color: #007BFF; text-decoration: none;">${verificationUrl}</a></p>
            
            <p>Best regards,<br>YourProjectName Team</p>
        </div>
        `,
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
        });
};

// <------------------REGISTRATION -----------------------------------------> 
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;  // Destructure the request body to get user input

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the email already exists in the database
        const emailExists = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Validate the password
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ error: 'Password must contain at least one number' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user into the database and get the new user's ID
        const result = await pool.query('INSERT INTO accounts (name, email, password, is_verified) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, hashedPassword, false]);

        // Generate a unique verification token for the email confirmation process
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Update the user with the generated verification token
        await pool.query('UPDATE accounts SET verification_token = $1 WHERE id = $2', [verificationToken, result.rows[0].id]);

        // Send the verification email with the generated token using EmailJS
        sendVerificationEmail(email, verificationToken);

        // Create an access token for the user session
        const accessToken = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Create a refresh token to maintain the session
        const refreshToken = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Store the refresh token in the database for later use
        await pool.query('UPDATE accounts SET refresh_token = $1 WHERE id = $2', [refreshToken, result.rows[0].id]);

        // Send a response with the tokens and a success message
        res.json({ accessToken, refreshToken, message: 'Registration successful. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Registration error details:', error);  // Log any errors that occur during registration
        res.status(500).json({ error: 'Registration failed. Please try again.' });  // Respond with an error message if registration fails
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

// <------------------VERIFY EMAIL ----------------------------------------->
export const verifyEmail = async (req, res) => {
    const { token } = req.query; 

    console.log('Token received:', token); 

    try {
        const result = await pool.query('SELECT * FROM accounts WHERE verification_token = $1', [token]);
        if (result.rows.length === 0) {
            console.log('Invalid token');
            return res.status(400).json({ error: 'Invalid token' });
        }

        
        await pool.query('UPDATE accounts SET is_verified = $1, verification_token = NULL WHERE id = $2', [true, result.rows[0].id]);

        console.log('Email successfully verified');
        res.json({ message: 'Email verified successfully!' }); 
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ error: 'Email verification failed. Please try again.' });
    }
};

