// migrate_project_images_script.js
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const path = require('path');

const Project = require(path.resolve(__dirname, './dist/models/Project')).default;

// Helper function to safely derive public_id from a URL
function derivePublicId(url, projectId, index, type = 'image') {
  if (!url || typeof url !== 'string') {
    return `fallback_${type}_${projectId}_${index}_${Date.now()}`;
  }

  // Attempt to parse for Cloudinary-style public_id (e.g., .../upload/v123/folder/public_id.jpg)
  const cloudinaryMatch = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  if (cloudinaryMatch && cloudinaryMatch[1]) {
    // Cloudinary public_ids can include folders, e.g., 'myfolder/image'
    return cloudinaryMatch[1].replace(/\.[^/.]+$/, ''); // Remove extension if present
  }

  // Attempt to parse for generic filename as public_id (e.g., https://example.com/images/filename.jpg)
  const lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex !== -1 && lastSlashIndex < url.length - 1) {
    const filenameWithExtension = url.substring(lastSlashIndex + 1);
    const filenameParts = filenameWithExtension.split('.');
    if (filenameParts.length > 1) {
      // Return filename without extension
      return filenameParts[0];
    } else {
      // No extension, just return the whole filename part
      return filenameWithExtension;
    }
  }

  // Fallback if no specific pattern is matched
  return `fallback_${type}_${projectId}_${index}_${Date.now()}`;
}


const migrateImagesData = async () => {
  console.log('Starting MongoDB image data migration...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully.');

    const projectsToMigrate = await Project.find({}).lean(); // <-- Keep .lean()!

    console.log(`Found ${projectsToMigrate.length} projects to check for migration.`);

    for (const project of projectsToMigrate) {
      let needsUpdate = false;
      const updateFields = {};

      // --- Migrate Thumbnail ---
      const currentThumbnail = project.thumbnail;

      if (currentThumbnail) {
        let reconstructedUrl = null;
        let reconstructedPublicId = null;

        if (typeof currentThumbnail === 'string') {
          reconstructedUrl = currentThumbnail;
          console.log(`Migrating thumbnail (string) for project ${project._id}: ${reconstructedUrl}`);
        }
        else if (typeof currentThumbnail === 'object' && currentThumbnail !== null) {
          // If the object looks like a string-converted-to-object (e.g., { '0':'h', ...})
          if (Object.keys(currentThumbnail).every(k => !isNaN(Number(k)))) {
             reconstructedUrl = Object.values(currentThumbnail).join('');
             console.log(`Migrating malformed thumbnail (string-like object) for project ${project._id}, reconstructed URL: ${reconstructedUrl}`);
          } else {
             // Attempt to use existing partial info if available
             reconstructedUrl = (currentThumbnail.url && typeof currentThumbnail.url === 'string') ? currentThumbnail.url : null;
             reconstructedPublicId = (currentThumbnail.public_id && typeof currentThumbnail.public_id === 'string') ? currentThumbnail.public_id : null;
             if (!reconstructedUrl || !reconstructedPublicId) {
                console.log(`Migrating partially malformed thumbnail object for project ${project._id}:`, currentThumbnail);
             }
          }
        }

        // Now, process the (re)constructed URL and public_id
        if (!reconstructedUrl) {
            console.warn(`Warning: Thumbnail URL for project ${project._id} is missing or invalid. Setting placeholder.`);
            reconstructedUrl = 'https://via.placeholder.com/150x100?text=Placeholder+Thumb';
        }
        if (!reconstructedPublicId) { // Only derive if not already set or invalid
            reconstructedPublicId = derivePublicId(reconstructedUrl, project._id, 'thumb');
            if (reconstructedPublicId.startsWith('fallback')) {
                console.warn(`Warning: Thumbnail public_id for project ${project._id} is missing. Setting inferred/fallback public_id: ${reconstructedPublicId}`);
            }
        }

        const newThumbnail = { url: reconstructedUrl, public_id: reconstructedPublicId };

        // Only update if it's genuinely different from what's there (after reconstruction)
        // This prevents unnecessary updates if the data was already mostly correct
        if (!currentThumbnail || typeof currentThumbnail === 'string' || JSON.stringify(currentThumbnail) !== JSON.stringify(newThumbnail)) {
            updateFields.thumbnail = newThumbnail;
            needsUpdate = true;
        }

      } else if (project.thumbnail === null || project.thumbnail === undefined) {
          // If thumbnail is missing or null, and your schema requires it,
          // you MUST set a default here or it will fail validation.
          // Your schema says `required: true` for thumbnail.
          console.warn(`Thumbnail for project ${project._id} is null/undefined. Setting default placeholder.`);
          updateFields.thumbnail = {
              url: 'https://via.placeholder.com/150x100?text=No+Thumbnail',
              public_id: `no_thumb_${project._id}_${Date.now()}`
          };
          needsUpdate = true;
      }


      // --- Migrate Additional Images ---
      const newImagesArray = [];
      const currentImages = project.images;

      // Ensure currentImages is an array or make it an empty one to loop
      const imagesToProcess = Array.isArray(currentImages) ? currentImages : (currentImages ? [currentImages] : []);

      for (let i = 0; i < imagesToProcess.length; i++) {
        const img = imagesToProcess[i];
        let reconstructedUrl = null;
        let reconstructedPublicId = null;

        if (typeof img === 'string') {
          reconstructedUrl = img;
          console.log(`Migrating additional image (string) for project ${project._id}: ${reconstructedUrl}`);
        }
        else if (typeof img === 'object' && img !== null) {
          if (Object.keys(img).every(k => !isNaN(Number(k)))) {
            reconstructedUrl = Object.values(img).join('');
            console.log(`Migrating malformed additional image (string-like object) for project ${project._id}, reconstructed URL: ${reconstructedUrl}`);
          } else {
            reconstructedUrl = (img.url && typeof img.url === 'string') ? img.url : null;
            reconstructedPublicId = (img.public_id && typeof img.public_id === 'string') ? img.public_id : null;
            if (!reconstructedUrl || !reconstructedPublicId) {
                console.log(`Migrating partially malformed additional image object for project ${project._id}:`, img);
            }
          }
        }

        // Now, process the (re)constructed URL and public_id
        if (!reconstructedUrl) {
          console.warn(`Warning: Additional image URL for project ${project._id} at index ${i} is missing or invalid. Setting placeholder.`);
          reconstructedUrl = 'https://via.placeholder.com/150x100?text=Placeholder+Image';
        }
        if (!reconstructedPublicId) { // Only derive if not already set or invalid
            reconstructedPublicId = derivePublicId(reconstructedUrl, project._id, i, 'additional_image');
            if (reconstructedPublicId.startsWith('fallback')) {
                console.warn(`Warning: Additional image public_id for project ${project._id} at index ${i} is missing. Setting inferred/fallback public_id: ${reconstructedPublicId}`);
            }
        }
        newImagesArray.push({ url: reconstructedUrl, public_id: reconstructedPublicId });
      }

      // Check if the newImagesArray is different from the original (after processing)
      if (!arraysEqual(currentImages, newImagesArray)) {
        updateFields.images = newImagesArray;
        needsUpdate = true;
      }


      if (needsUpdate) {
        console.log(`Attempting to update project ${project._id} with fields:`, updateFields);
        await Project.updateOne({ _id: project._id }, { $set: updateFields }, { runValidators: true }); // Still using updateOne
        console.log(`Successfully migrated and updated project ${project._id}`);
      } else {
        console.log(`Project ${project._id} already in correct format or no changes needed.`);
      }
    }

    console.log('Image data migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    if (error instanceof mongoose.Error.ValidationError) { // Check for Mongoose validation error specifically
      for (const key in error.errors) {
        console.error(`Validation Error for ${key}:`, error.errors[key].message);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

// Helper function for shallow array equality check for ImageInfo objects
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        // Compare the url and public_id properties
        const objA = a[i];
        const objB = b[i];

        if (objA && objB && objA.url === objB.url && objA.public_id === objB.public_id) {
            continue; // Objects are equal
        } else if (!objA && !objB) {
            continue; // Both are null/undefined, considered equal for this purpose
        } else {
            return false; // Objects are different
        }
    }
    return true;
}


// Run the migration
migrateImagesData();