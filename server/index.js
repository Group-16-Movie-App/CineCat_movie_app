import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import finnkino from './routes/finnkino.js';
import tmdb from './routes/tmdb.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'; 
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


dotenv.config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie API",
      version: "1.0.0",
      description: "A simple movie API",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Ensure this matches the location of your route files
};

const swaggerSpec = swaggerJSDoc(options);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes




app.use('/api', auth);
app.use('/api', finnkino);
app.use('/api', tmdb);
app.use('/api', favoriteRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes); 


// Start server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});