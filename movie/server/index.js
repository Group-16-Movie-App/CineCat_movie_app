const express = require('express');
const axios = require('axios');
const cors = require('cors');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());

// Finnkino XML API endpoints
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});