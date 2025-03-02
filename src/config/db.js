import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: DB_NAME, // <-- This explicitly sets the database name
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDb Error: ${error.message}`);
    process.exit(1); // Exit if connection fails
  }
};

export default connectDB;
