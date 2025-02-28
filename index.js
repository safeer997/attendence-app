// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Load environment variables
dotenv.config();

connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Define a test route
app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

// Define the PORT
const PORT = process.env.PORT || 7000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
