// packages/backend/src/utils/imageUpload.ts
import { v2 as cloudinary } from 'cloudinary'; // Assuming you import v2 and rename to cloudinary
import { IImageInfo } from '@models/Project'; // Import IImageInfo from your Project model

// IMPORTANT: Replace with your actual Cloudinary configuration
// This should ideally be loaded from environment variables in your cloudinaryConfig.ts
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

/**
 * Uploads an image buffer to Cloudinary using a stream.
 * @param buffer The image buffer (from multer's req.file.buffer).
 * @param folder The folder in Cloudinary to upload to (defaults to 'portfolio-projects').
 * @returns Promise<IImageInfo> - resolves with url and public_id.
 * @throws Error if upload fails or Cloudinary response is incomplete.
 */
export const uploadImageToCloudinary = async (
  buffer: Buffer,
  folder: string = 'portfolio-projects' // Default folder
): Promise<IImageInfo> => {
  // Basic validation for the buffer
  if (!buffer || buffer.length === 0) {
    console.error('uploadImageToCloudinary Error: Received empty or null buffer.');
    throw new Error('No image data provided for upload.');
  }

  return new Promise((resolve, reject) => {
    // Using upload_stream for efficiency with buffers
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image', // Ensure it's treated as an image
        folder: folder,         // Cloudinary folder
        // Add any other Cloudinary upload options here (e.g., tags, transformations)
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload_stream error:', error);
          return reject(new Error(`Failed to upload image to Cloudinary: ${error.message}`));
        }

        // Validate the Cloudinary result
        if (!result || !result.secure_url || !result.public_id) {
          console.error('Cloudinary upload_stream result missing required data:', result);
          return reject(new Error('Cloudinary upload did not return expected URL or Public ID.'));
        }

        console.log(`Cloudinary Upload Success: ${result.public_id} - ${result.secure_url}`);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // End the stream with the image buffer
    uploadStream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary using its public_id.
 * @param publicId The public_id of the image to delete.
 * @returns Promise<void>
 * @throws Error if deletion fails (unless not found, which is warned).
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) {
    console.warn('deleteImageFromCloudinary Warning: Attempted to delete image with empty public_id.');
    return Promise.resolve(); // Resolve silently if no public ID is provided
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error(`Cloudinary deletion error for ${publicId}:`, error);
        return reject(new Error(`Failed to delete image ${publicId} from Cloudinary: ${error.message}`));
      }

      // Cloudinary returns result.result = 'not found' if the image doesn't exist
      if (result && result.result === 'not found') {
        console.warn(`Cloudinary: Image with public_id ${publicId} not found for deletion.`);
        resolve(); // Consider "not found" as a successful "deletion" (it's gone)
      } else if (result && result.result === 'ok') {
        console.log(`Cloudinary: Image with public_id ${publicId} deleted successfully.`);
        resolve();
      } else {
        // Unexpected result from Cloudinary deletion
        console.error(`Cloudinary deletion for ${publicId} returned an unexpected result:`, result);
        reject(new Error(`Unexpected result when deleting image ${publicId}.`));
      }
    });
  });
};