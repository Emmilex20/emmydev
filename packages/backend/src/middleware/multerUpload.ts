import multer from 'multer';
import { Request } from 'express'; // Import Request type for fileFilter callback

// Multer 2.x: When no storage is provided, Multer makes the file streams available
// on req.file.stream or req.files[index].stream.
const upload = multer({
    // Filter for image files
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        // Ensure mimetype is available and starts with 'image/'
        if (file.mimetype && file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept the file
        } else {
            // Reject the file and provide an error message
            // Note: In Multer 2.x, the 'MulterError' type might be more appropriate here.
            // For now, casting to 'any' for compatibility with older type definitions.
            cb(new Error('Only image files are allowed!') as any, false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB file size limit (adjust as needed)
    }
});

export default upload;