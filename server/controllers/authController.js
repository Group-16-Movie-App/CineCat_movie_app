// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../config/database.js';

// export const register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
        
//         // check if all fields are provided
//         if (!name || !email || !password) {
//             return res.status(400).json({ 
//                 error: 'All fields are required'
//             });
//         }

//         // if email already exists
//         const emailExists = await pool.query(
//             'SELECT * FROM accounts WHERE email = $1',
//             [email]
//         );

//         if (emailExists.rows.length > 0) {
//             return res.status(400).json({ 
//                 error: 'Email already exists'
//             });
//         }

//         // Password validation
//         if (password.length < 6) {
//             return res.status(400).json({ 
//                 error: 'Password must be at least 6 characters long'
//             });
//         }

//         if (!/[A-Z]/.test(password)) {
//             return res.status(400).json({ 
//                 error: 'Password must contain at least one uppercase letter'
//             });
//         }

//         if (!/[0-9]/.test(password)) {
//             return res.status(400).json({ 
//                 error: 'Password must contain at least one number'
//             });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         const result = await pool.query(
//             'INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3) RETURNING id',
//             [name, email, hashedPassword]
//         );
        
//         // Create token for immediate login after registration
//         const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET);
        
//         res.json({ 
//             token,
//             id: result.rows[0].id,
//             name,
//             email,
//             message: 'Registration successful'
//         });

//     } catch (error) {
//         console.error('Registration error details:', error);

//         if (error.code === '23505' && error.constraint === 'accounts_email_key') {
//             return res.status(400).json({ 
//                 error: 'Email already exists'
//             });
//         }

//         res.status(500).json({ 
//             error: 'Registration failed. Please try again.'
//         });
//     }
// };

// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         if (!email || !password) {
//             return res.status(400).json({ 
//                 error: 'Email and password are required'
//             });
//         }

//         const result = await pool.query(
//             'SELECT * FROM accounts WHERE email = $1',
//             [email]
//         );
        
//         if (result.rows.length === 0) {
//             return res.status(401).json({ 
//                 error: 'Invalid email or password'
//             });
//         }
        
//         const user = result.rows[0];
//         const validPassword = await bcrypt.compare(password, user.password);
        
//         if (!validPassword) {
//             return res.status(401).json({ 
//                 error: 'Invalid email or password'
//             });
//         }
        
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
//         res.json({ 
//             token,
//             id: user.id, 
//             name: user.name, 
//             email: user.email 
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ 
//             error: 'Login failed. Please try again.'
//         });
//     }
// };

// export const logout = (req, res) => {
//     res.json({ message: 'Logged out successfully' });
// };

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";

// Middleware to decode JWT and attach user data to req.user
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Token is missing or invalid." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  try {
    // Decode and verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to req.user
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const emailExists = await pool.query(
      "SELECT * FROM accounts WHERE email = $1",
      [email]
    );
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[0-9]/.test(password)) {
      return res
        .status(400)
        .json({ error: "Password must contain at least one number" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in the database
    const result = await pool.query(
      "INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hashedPassword]
    );

    // Generate JWT for immediate login
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      id: result.rows[0].id,
      name,
      email,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error details:", error);

    // Handle unique constraint error
    if (error.code === "23505" && error.constraint === "accounts_email_key") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// Add a review (requires authentication)
export const addReview = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please log in to add a review." });
    }

    const { movie_id, review } = req.body;
    const account_id = req.user.id;

    if (!movie_id || !review) {
      return res
        .status(400)
        .json({ error: "Movie ID and review content are required." });
    }

    const result = await pool.query(
      "INSERT INTO reviews (movie_id, account_id, review) VALUES ($1, $2, $3) RETURNING *",
      [movie_id, account_id, review]
    );

    res.status(201).json({
      message: "Review added successfully",
      review: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review. Please try again." });
  }
};

export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// Middleware to verify token and attach user to req
export const middleware = authMiddleware;
