import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to search for movies
app.get('/api/search/movies', async (req, res) => {
    try {
        const { query, year, genre, rating } = req.query;
        
        let searchEndpoint = "https://api.themoviedb.org/3/search/movie?api_key=" + process.env.TMDB_API_KEY + "&query=" + query;
        
        if (year) searchEndpoint += "&year=" + year;
        if (genre) searchEndpoint += "&with_genres=" + genre;
        if (rating) searchEndpoint += "&vote_average.gte=" + rating;

        const response = await axios.get(searchEndpoint);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies' });
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

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});