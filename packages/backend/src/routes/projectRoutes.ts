// packages/backend/src/routes/projectRoutes.ts
import { Router } from 'express';
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '@controllers/projectController'; // Import project controllers
import { protect } from '@middleware/authMiddleware'; // Import the auth middleware (assuming it exists)
import upload from '@middleware/multerUpload'; // Import the multer upload middleware

const router = Router();

// Multer fields configuration for create and update project routes
// This specifies that the 'thumbnail' field is a single file,
// and the 'images' field can be an array of up to 10 files.
const projectImageUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 }, // Single file for thumbnail
    { name: 'images', maxCount: 10 }    // Up to 10 files for additional images
]);

// --- START: Temporary Debugging Middleware ---
// This middleware logs req.body and req.files immediately after Multer has run.
const debugMulterOutput = (req: any, res: any, next: any) => {
    console.log("--- DEBUG: After projectImageUpload Multer in projectRoutes.ts ---");
    console.log("DEBUG: req.body:", req.body);
    console.log("DEBUG: req.files:", req.files);
    console.log("-----------------------------------------------");
    next(); // IMPORTANT: Call next() to pass control to the next middleware/controller
};
// --- END: Temporary Debugging Middleware ---


// Public routes (these do not require authentication or handle file uploads directly)
router.get('/', getAllProjects); // Get all projects
router.get('/:id', getProjectById); // Get single project by ID

// Private routes (require authentication and now include file upload middleware)
// IMPORTANT: The 'projectImageUpload' middleware MUST come BEFORE 'createProject' and 'updateProject'
// as it parses the multipart/form-data and makes files available on req.files.
// The debugMulterOutput middleware is placed directly after projectImageUpload.
router.post('/', protect, projectImageUpload, debugMulterOutput, createProject); // Create project with image upload
router.put('/:id', protect, projectImageUpload, debugMulterOutput, updateProject); // Update project with image upload
router.delete('/:id', protect, deleteProject); // Delete project (no file upload needed here)

export default router;