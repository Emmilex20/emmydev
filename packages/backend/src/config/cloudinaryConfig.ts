// packages/backend/src/config/cloudinaryConfig.ts
import { v2 as cloudinary } from 'cloudinary';

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Ensures URLs use HTTPS
  });
  console.log('Cloudinary configured.');
};

// You can optionally export the cloudinary object if you need to use its methods directly
export { cloudinary };