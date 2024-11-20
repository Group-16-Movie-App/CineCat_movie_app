import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import xml2js from 'xml2js';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };
  

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

//*************Finnkino XML API endpoints***************/ 
const FINNKINO_BASE_URL = 'https://www.finnkino.fi/xml';
const THEATRE_AREAS_URL = `${FINNKINO_BASE_URL}/TheatreAreas`;
const SCHEDULES_URL = `${FINNKINO_BASE_URL}/Schedule`;
const EVENTS_URL = `${FINNKINO_BASE_URL}/Events`;

// XML parser instance
const parser = new xml2js.Parser({ explicitArray: false });

// Get theatre areas
app.get('/api/theatres', async (req, res) => {
    try {
      const response = await axios.get(THEATRE_AREAS_URL, {
        headers: {
          'Accept': 'application/xml',
          'User-Agent': 'Mozilla/5.0'
        }
      });
  
      // Parse XML to JSON
      parser.parseString(response.data, (err, result) => {
        if (err) {
          throw new Error('Failed to parse XML data');
        }
        res.json(result);
      });
    } catch (error) {
      console.error('Error fetching theatres:', error.message);
      res.status(500).json({ error: 'Failed to fetch theatre areas' });
    }
});
  
// Get schedules for a specific theatre
app.get('/api/schedules/:theatreId', async (req, res) => {
    try {
      const response = await axios.get(`${SCHEDULES_URL}?area=${req.params.theatreId}`, {
        headers: {
          'Accept': 'application/xml',
          'User-Agent': 'Mozilla/5.0'
        }
      });
  
      // Parse XML to JSON
      parser.parseString(response.data, (err, result) => {
        if (err) {
          throw new Error('Failed to parse XML data');
        }
        res.json(result);
      });
    } catch (error) {
      console.error('Error fetching schedules:', error.message);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
});
  
// Add a new route for movie details
app.get('/api/events/:eventId', async (req, res) => {
    try {
      const response = await axios.get(`${EVENTS_URL}?eventID=${req.params.eventId}&includeVideos=true&includeGallery=true&includePictures=true`, {
        headers: {
          'Accept': 'application/xml',
          'User-Agent': 'Mozilla/5.0'
        }
      });
  
      parser.parseString(response.data, (err, result) => {
        if (err) {
          throw new Error('Failed to parse XML data');
        }
        res.json(result);
      });
    } catch (error) {
      console.error('Error fetching event details:', error.message);
      res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

/******* TMDB ENDPOINTS **************/

// Endpoint to search for movies
app.get('/api/search/movies', async (req, res) => {
    try {
        const { query, year, page = 1 } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required.' });
        }

        let searchEndpoint = "https://api.themoviedb.org/3/search/movie";
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_Token}`,
                'Content-Type': 'application/json'
            },
            params: {
                query,
                ...(year && { year }),
                page,
            },
        };
        const response = await axios.get(searchEndpoint, config);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});
      
// Endpoint to filter movies
app.get('/api/filter/movies', async (req, res) => {
    try {
        const { genre, rating, year, page = 1, sort_by = 'popularity.desc' } = req.query;

        let searchEndpoint = "https://api.themoviedb.org/3/discover/movie";
        const config = {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_Token}`,
                'Content-Type': 'application/json'
            },
            params: {
                ...(year && {'primary_release_year' : year}),
                ...(genre && { 'with_genres': genre }),
                ...(rating && { 'vote_average.gte': rating }),
                page,
                sort_by,
            },
        };
        console.log('Calling TMDB with:', config.params);
        const response = await axios.get(searchEndpoint, config);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to filter movies' });
    }
});

// Endpoint to get movie details
app.get('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(
            "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + process.env.TMDB_API_KEY
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

// Endpoint to get genre list
app.get('/api/genre', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movie genres' });
    }
});

/******* AUTHENTICATION ENDPOINTS **************/

// Register new user
app.post('/api/register', async (req, res) => {
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
      
      res.json({ 
        id: result.rows[0].id, 
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
});


// Login user
app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      //check if all fields are provided
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
});

/******* ENDPOINTS FOR USERS FAVORITE MOVIES**************/  

// Get user's favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
        // Get favorites for the authenticated user
        const result = await pool.query(
            'SELECT movie_id FROM favorites WHERE account_id = $1',
            [req.user.id]
        );
        
        // Get full movie details for each favorite
        const favorites = await Promise.all(
            result.rows.map(async (row) => {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${row.movie_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.TMDB_Token}`
                        }
                    }
                );
                return response.data;
            })
        );
        
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Add movie to favorites
app.post('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const { movie_id } = req.body;
        
        // Check if already in favorites
        const existing = await pool.query(
            'SELECT * FROM favorites WHERE account_id = $1 AND movie_id = $2',
            [req.user.id, movie_id]
        );
        
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Movie already in favorites' });
        }
        
        // Add to favorites
        await pool.query(
            'INSERT INTO favorites (account_id, movie_id) VALUES ($1, $2)',
            [req.user.id, movie_id]
        );
        
        res.json({ message: 'Added to favorites' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

// Remove from favorites
app.delete('/api/favorites/:movieId', authenticateToken, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM favorites WHERE account_id = $1 AND movie_id = $2',
            [req.user.id, req.params.movieId]
        );
        
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});





// Logout user
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});