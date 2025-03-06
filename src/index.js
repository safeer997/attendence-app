// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
//routes import
import studentRoutes from './routes/student.route.js';
import instructerRoutes from './routes/instructor.route.js';
import classSessionRoutes from './routes/classSession.route.js';
import markAttendanceRoutes from './routes/attendance.route.js';
import authRoutes from "./routes/auth.route.js"

// Load environment variables
dotenv.config();

connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*', // Allows all origins
    credentials: true, // Allows cookies to be sent
  })
);

app.use(cookieParser());

//defining base routes
app.use('/students', studentRoutes);
app.use('/instructer', instructerRoutes);
app.use('/classSession', classSessionRoutes);
app.use('/attendance', markAttendanceRoutes);
app.use('/auth', authRoutes );

// Define the PORT
const PORT = process.env.PORT || 7000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
