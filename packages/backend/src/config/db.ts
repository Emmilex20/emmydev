// packages/backend/src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables.');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) { // Use 'any' for error type or define a specific error type
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};