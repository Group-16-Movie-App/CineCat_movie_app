import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import finnkino from './routes/finnkino.js';
import tmdb from './routes/tmdb.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import groupRoutes from './routes/groupRoutes.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', auth);
app.use('/api', finnkino);
app.use('/api', tmdb);
app.use('/api', favoriteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/groups', groupRoutes);


// Start server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});