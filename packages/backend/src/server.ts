// packages/backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from '@config/db';
import { configureCloudinary } from '@config/cloudinaryConfig'; // <-- Import Cloudinary config

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configure Cloudinary
configureCloudinary(); // <-- Call this function

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGO_URI ? 'Set' : 'Not set'}`);
});