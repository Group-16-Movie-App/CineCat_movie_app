import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import crypto from 'crypto'; 
import sgMail from '@sendgrid/mail'; 


export const verifyEmail = async (req, res) => {
    const { token } = req.query;  

    try {
        const result = await pool.query(
            'SELECT * FROM accounts WHERE verification_token = $1',
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                error: 'Invalid or expired verification token'
            });
        }
        await pool.query(
            'UPDATE accounts SET is_verified = true, verification_token = null WHERE id = $1',
            [result.rows[0].id]
        );

       
        res.redirect('http://localhost:3000/verification-success');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
};

//validation
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
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 40%; border: none;">
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
            console.log('Verification email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending verification email:', error);
        });
};



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
        
        // generate a token for mail validation
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const result = await pool.query(
            'INSERT INTO accounts (name, email, password, token_version, verification_token) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, 0, verificationToken]
        );
         // Send the verification email
         sendVerificationEmail(email, verificationToken);
        
         // Create a JWT token for immediate login after registration
         const token = jwt.sign({ id: result.rows[0].id, token_version: result.rows[0].token_version}, 
                                 process.env.JWT_SECRET, 
                                 { expiresIn: '2h' });
         
         res.status(201).json({ 
             token,
             token_version: result.rows[0].token_version,
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

         if (error.code === '23505' && error.constraint === 'accounts_name_key') {
            return res.status(400).json({ 
                error: 'Username already exists'
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
            return res.status(404).json({ 
                error: 'Account not found or does not exist'
            });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Invalid email or password'
            });
        }
        
        const token = jwt.sign({ id: user.id, token_version: user.token_version },
                                 process.env.JWT_SECRET, 
                                 {expiresIn: '2h'});
        
        res.status(200).json({ 
            token,
            token_version: user.token_version,
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

export const logout = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE accounts SET token_version = token_version + 1 WHERE id = $1',
            [req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed. Please try again.' });
    }
};

export const deleteAccount = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); 
        
      
        await client.query('DELETE FROM favorites WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM shared_urls WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM posts WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM members WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM membership_requests WHERE account_id = $1', [req.user.id]);
        await client.query('DELETE FROM groups WHERE owner=$1', [req.user.id]);
        await client.query('DELETE FROM reviews WHERE account_id = $1', [req.user.id]);
        //await client.query('UPDATE ratings SET account_id = NULL WHERE account_id = $1', [req.user.id]);
        
      
        const result = await client.query('DELETE FROM accounts WHERE id = $1', [req.user.id]);
        
        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Account not found' });
        }
        await client.query('COMMIT'); 
        res.status(200).json({ message: 'Account deleted successfully' });
        
    } catch (error) {
        await client.query('ROLLBACK');  
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    } finally {
        client.release();  
    }
};