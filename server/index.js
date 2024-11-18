import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import xml2js from 'xml2js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

/******* TMDB ENPOINTS **************/

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
      
// Endpoint to filter movies. year is release year int, genre is genre_id, rating is vote_average.gte int.
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
})
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});