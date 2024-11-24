import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import finnkinoRoutes from './routes/finnkino.js';
import tmdbRoutes from './routes/tmdb.js';
import reviewRoutes from './routes/reviewRoutes.js';        

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', finnkinoRoutes);
app.use('/api', tmdbRoutes);
app.use("/api/reviews", reviewRoutes);


app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});