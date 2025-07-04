// packages/backend/src/app.ts
import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import contactRoutes from '@routes/contactRoutes';
import projectRoutes from '@routes/projectRoutes';
import uploadRoutes from '@routes/uploadRoutes';
import { pageViewTracker } from '@middleware/pageViewTracker';

const app = express();

// --- REMOVE THESE TWO LINES FROM GLOBAL MIDDLEWARE ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// --- END REMOVAL ---

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Analytics / Page View Tracker Middleware
app.use(pageViewTracker);

// Basic Route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('Portfolio Backend API is running!');
});

// API Routes
// Apply express.json() and express.urlencoded() ONLY to routes that need them
// Routes that handle file uploads (like /api/projects, /api/upload) will have Multer handle body parsing.
app.use('/api/contact', express.json(), express.urlencoded({ extended: true }), contactRoutes);
app.use('/api/projects', projectRoutes); // Multer middleware handles body parsing here
app.use('/api/upload', uploadRoutes); // Multer middleware handles body parsing here

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;