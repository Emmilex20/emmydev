// packages/backend/src/routes/contactRoutes.ts
import { Router } from 'express';
import { submitContactForm } from '@controllers/contactController'; // Import the controller

const router = Router();

// Define the POST route for contact form submission
router.post('/', submitContactForm);

export default router;