import axios from 'axios';
import xml2js from 'xml2js';

const FINNKINO_BASE_URL = 'https://www.finnkino.fi/xml';
const THEATRE_AREAS_URL = `${FINNKINO_BASE_URL}/TheatreAreas`;
const SCHEDULES_URL = `${FINNKINO_BASE_URL}/Schedule`;
const EVENTS_URL = `${FINNKINO_BASE_URL}/Events`;

const parser = new xml2js.Parser({ explicitArray: false });

export const getTheatres = async (req, res) => {
    try {
        const response = await axios.get(THEATRE_AREAS_URL, {
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
        console.error('Error fetching theatres:', error.message);
        res.status(500).json({ error: 'Failed to fetch theatre areas' });
    }
};

export const getSchedules = async (req, res) => {
    try {
        const response = await axios.get(`${SCHEDULES_URL}?area=${req.params.theatreId}`, {
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
        console.error('Error fetching schedules:', error.message);
        res.status(500).json({ error: 'Failed to fetch schedules' });
    }
};

export const getEventDetails = async (req, res) => {
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
};