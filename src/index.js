// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
//routes import
import studentRoutes from './routes/student.route.js';
import instructerRoutes from './routes/instructor.route.js';

// Load environment variables
dotenv.config();

connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

//defining base routes
app.use('/students', studentRoutes);
app.use('/instructer', instructerRoutes);

// Define the PORT
const PORT = process.env.PORT || 7000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
