// packages/backend/src/routes/uploadRoutes.ts
import { Router, Request, Response } from 'express';
import upload from '@middleware/multerUpload'; // Multer middleware
import { uploadImageToCloudinary } from '@utils/imageUpload'; // Upload utility
import { protect } from '@middleware/authMiddleware'; // Admin protection (assuming it exists)
import asyncHandler from 'express-async-handler'; // Import asyncHandler

const router = Router();

/**
 * @desc    Upload a single image to Cloudinary
 * @route   POST /api/upload/single
 * @access  Private (Admin API Key required)
 */
router.post('/single', protect, upload.single('image'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided.');
  }

  // req.file.buffer contains the image data
  const { url, public_id } = await uploadImageToCloudinary(req.file.buffer, 'portfolio-general-uploads'); // Specific folder for general uploads

  res.status(200).json({
    message: 'Image uploaded successfully!',
    imageUrl: url,
    publicId: public_id,
    fileName: req.file.originalname,
    fileSize: req.file.size
  });
}));

// You can add a route for multiple image uploads later if needed
// router.post('/multiple', protect, upload.array('images', 10), asyncHandler(async (req: Request, res: Response) => { /* ... */ }));

export default router;