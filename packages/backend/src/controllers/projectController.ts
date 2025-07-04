import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Project, { IProject, IImageInfo } from '@models/Project';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@utils/imageUpload';
import asyncHandler from 'express-async-handler';
// NO STATIC IMPORT FOR 'get-stream' HERE. It's not needed when using memoryStorage.
// type GetStreamModule and dynamic import are also removed.

/**
 * Helper function to safely delete an array of images from Cloudinary.
 * @param images An array of IImageInfo objects (containing public_id).
 */
const deleteProjectImages = async (images?: IImageInfo[]) => {
    if (images && images.length > 0) {
        // Use Promise.allSettled to ensure all deletions are attempted, even if some fail
        const results = await Promise.allSettled(
            images.map(img => deleteImageFromCloudinary(img.public_id))
        );
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Failed to delete image ${images[index]?.public_id || 'unknown'} from Cloudinary:`, result.reason);
            }
        });
    }
};

/**
 * Helper to get current line number for debugging.
 * @returns string
 */
function getLineNumber() {
    try {
        throw new Error();
    } catch (e: any) {
        const stack = e.stack?.split('\n');
        if (stack && stack.length >= 3) {
            // Explicitly type 'line' as string
            const relevantLine = stack.find((line: string) => !line.includes('getLineNumber') && line.includes('.ts:'));
            if (relevantLine) {
                const match = relevantLine.match(/:(\d+):\d+\)$/);
                return match ? match[1] : 'unknown';
            }
        }
        return 'unknown';
    }
}


/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
    // Sort projects by 'order' ascending, then by 'createdAt' descending
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json(projects);
});

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid project ID format.');
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found.');
    }

    res.status(200).json(project);
});

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin API Key required)
 * This route now expects 'multipart/form-data' due to file uploads.
 */
export const createProject = asyncHandler(async (req: Request, res: Response) => {
    // get-stream related code removed as we're using Multer's memoryStorage

    // Initialize variables to store image info for potential cleanup on error
    let thumbnailInfo: IImageInfo | undefined;
    const imagesInfo: IImageInfo[] = [];

    // --- Debugging logs for received files from Multer (Initial State) ---
    console.log(`--- createProject: Multer Data on entry (Line ${getLineNumber()}) ---`);
    console.log('Raw req.files:', req.files);
    console.log('Raw req.body:', req.body);
    console.log('-------------------------------------------------------');

    // Type assertion for req.files is good practice when Multer is used
    // When using memoryStorage, the file object has a `buffer` property.
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    // --- SAFELY ACCESS req.body and its properties ---
    // If req.body is undefined, default it to an empty object to prevent destructuring errors.
    const body = req.body || {};

    console.log(`--- DEBUG: About to destructure req.body (Line ${getLineNumber()}) ---`);
    console.log('DEBUG: `body` variable content (after defaulting):', body); // Log the defaulted 'body'

    // Destructure from the 'body' variable (which is guaranteed to be an object)
    const {
        title,
        description,
        githubLink,
        liveLink,
        category
    } = body;

    // --- Initial Text Field Validation ---
    if (!title || !description || !category || body.order === undefined || body.order === null) {
        res.status(400);
        console.error(`Validation Error (Line ${getLineNumber()}): Missing required text fields.`, { title, description, category, order: body.order });
        throw new Error('Please provide title, description, category, and display order.');
    }

    // Ensure technologies is an array, trimming and filtering empty strings
    const technologies: string[] = Array.isArray(body.technologies)
        ? body.technologies.map((tech: string) => String(tech).trim()).filter(Boolean)
        : typeof body.technologies === 'string' && body.technologies.length > 0
            ? body.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
            : []; // Default to empty array if not provided or invalid

    const order = parseInt(body.order as string);
    if (isNaN(order)) {
        res.status(400);
        console.error(`Validation Error (Line ${getLineNumber()}): Display order must be a valid number. Received:`, body.order);
        throw new Error('Display order must be a valid number.');
    }

    // --- 1. Handle Thumbnail Upload ---
    console.log(`--- Thumbnail Processing (Line ${getLineNumber()}) ---`);
    // Check for `file.buffer` property
    console.log('Thumbnail file check:', !!files?.thumbnail && files.thumbnail.length > 0 && !!files.thumbnail[0].buffer);

    // Validate existence of thumbnail file and its buffer data
    if (!files?.thumbnail || files.thumbnail.length === 0 || !files.thumbnail[0].buffer) {
        res.status(400);
        console.error(`Validation Error (Line ${getLineNumber()}): Thumbnail image file is required or missing buffer data.`);
        throw new Error('Thumbnail image file is required and must contain data.');
    }
    // This try-catch is specific for cleanup if Cloudinary fails for thumbnail
    try {
        // DIRECTLY USE THE BUFFER FROM MULTER
        const thumbnailBuffer = files.thumbnail[0].buffer;
        console.log(`Uploading thumbnail to Cloudinary: ${files.thumbnail[0].originalname} (Buffer length: ${thumbnailBuffer?.length})`);
        thumbnailInfo = await uploadImageToCloudinary(thumbnailBuffer, 'portfolio-projects');
        console.log('Thumbnail upload successful:', thumbnailInfo);
    } catch (error: any) {
        console.error(`Failed to upload thumbnail to Cloudinary (Line ${getLineNumber()}):`, error);
        res.status(500);
        throw new Error('Failed to upload thumbnail image.');
    }

    // --- 2. Handle Additional Images Upload (if provided) ---
    console.log(`--- Additional Images Processing (Line ${getLineNumber()}) ---`);
    console.log('Number of additional image files received:', files?.images?.length || 0);

    if (files.images && files.images.length > 0) {
        for (const file of files.images) {
            // Check for `file.buffer` property
            if (file.buffer) {
                try {
                    // DIRECTLY USE THE BUFFER FROM MULTER
                    const imageBuffer = file.buffer;
                    console.log(`Uploading additional image ${file.originalname} to Cloudinary (Buffer length: ${imageBuffer?.length})`);
                    const image = await uploadImageToCloudinary(imageBuffer, 'portfolio-projects');
                    imagesInfo.push(image);
                    console.log('Additional image upload successful:', image);
                } catch (error: any) {
                    console.warn(`Warning (Line ${getLineNumber()}): Failed to upload additional image ${file.originalname}:`, error);
                }
            } else {
                console.warn(`Warning (Line ${getLineNumber()}): Skipping additional image ${file.originalname} due to missing buffer data.`);
            }
        }
    }

    console.log('--- createProject: Final Cloudinary Upload Results ---');
    console.log('Final thumbnailInfo:', thumbnailInfo);
    console.log('Final imagesInfo:', imagesInfo);
    console.log('-----------------------------------------------');

    console.log(`--- Creating Project in DB (Line ${getLineNumber()}) ---`);
    const newProject: IProject = await Project.create({
        title,
        description,
        technologies,
        githubLink: githubLink || undefined, // Store undefined if empty string
        liveLink: liveLink || undefined,     // Store undefined if empty string
        category,
        order,
        thumbnail: thumbnailInfo, // This must be a valid IImageInfo object
        images: imagesInfo,      // This must be an array of valid IImageInfo objects
    });

    console.log(`Project created successfully (Line ${getLineNumber()}):`, newProject._id);
    res.status(201).json({ message: 'Project created successfully!', project: newProject });
});

/**
 * @desc    Update an existing project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin API Key required)
 * This route now expects 'multipart/form-data'.
 */
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
    // get-stream related code removed as we're using Multer's memoryStorage

    const projectId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(projectId)) {
        res.status(400);
        throw new Error('Invalid project ID format.');
    }

    // Type assertion for req.files (Multer 2.x buffer access)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const updateFields: any = {}; // Object to build dynamic updates

    // SAFELY ACCESS req.body and its properties for update
    const body = req.body || {};

    // Fetch the current project to get old image public_ids for deletion
    const currentProject = await Project.findById(projectId);
    if (!currentProject) {
        res.status(404);
        throw new Error('Project not found.');
    }

    console.log(`--- updateProject: Multer Data on entry (Line ${getLineNumber()}) ---`);
    console.log('Raw req.files:', req.files);
    console.log('Raw req.body:', req.body);
    console.log('`body` variable content (after defaulting):', body);
    console.log('---------------------------------------------------------');

    // Parse and update basic fields if they exist in `body`
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.category !== undefined) updateFields.category = body.category;

    if (body.technologies !== undefined) {
        // Ensure technologies is an array of trimmed, non-empty strings
        updateFields.technologies = Array.isArray(body.technologies)
            ? body.technologies.map((tech: string) => String(tech).trim()).filter(Boolean)
            : typeof body.technologies === 'string' && body.technologies.length > 0
                ? body.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
                : [];
    } else if (body.technologies === '') { // Explicitly handle empty string to clear technologies
        updateFields.technologies = [];
    }

    if (body.order !== undefined) {
        const parsedOrder = parseInt(body.order as string);
        if (!isNaN(parsedOrder)) {
            updateFields.order = parsedOrder;
        } else {
            res.status(400);
            console.error(`Validation Error (Line ${getLineNumber()}): Display order must be a valid number for update. Received:`, body.order);
            throw new Error('Display order must be a valid number.');
        }
    }

    // Handle optional links: set to undefined if an empty string is provided, otherwise use value
    if (body.githubLink !== undefined) {
        updateFields.githubLink = body.githubLink === '' ? undefined : body.githubLink;
    }
    if (body.liveLink !== undefined) {
        updateFields.liveLink = body.liveLink === '' ? undefined : body.liveLink;
    }

    // --- 1. Handle Thumbnail Update ---
    console.log(`--- Thumbnail Update Processing (Line ${getLineNumber()}) ---`);
    // Check for `file.buffer` property
    console.log('New Thumbnail file present:', !!files?.thumbnail && files.thumbnail.length > 0 && !!files.thumbnail[0].buffer);
    console.log('Clear Thumbnail flag from body:', body.clearThumbnail);

    if (files?.thumbnail && files.thumbnail.length > 0 && files.thumbnail[0].buffer) {
        if (currentProject.thumbnail && currentProject.thumbnail.public_id) {
            console.log(`Deleting old thumbnail: ${currentProject.thumbnail.public_id}`);
            await deleteImageFromCloudinary(currentProject.thumbnail.public_id);
        }
        try {
            // DIRECTLY USE THE BUFFER FROM MULTER
            const newThumbnailBuffer = files.thumbnail[0].buffer;
            console.log(`Uploading new thumbnail: ${files.thumbnail[0].originalname}`);
            const newThumbnailInfo = await uploadImageToCloudinary(newThumbnailBuffer, 'portfolio-projects');
            updateFields.thumbnail = newThumbnailInfo;
            console.log('New thumbnail upload successful:', newThumbnailInfo);
        } catch (error: any) {
            console.error(`Failed to upload new thumbnail to Cloudinary (Line ${getLineNumber()}):`, error);
            res.status(500);
            throw new Error('Failed to upload new thumbnail image.');
        }
    } else if (body.clearThumbnail === 'true' && currentProject.thumbnail) { // Added explicit clear thumbnail flag
        console.log(`Clearing existing thumbnail: ${currentProject.thumbnail.public_id}`);
        await deleteImageFromCloudinary(currentProject.thumbnail.public_id);
        updateFields.thumbnail = undefined; // Set to undefined to clear it
        console.log('Existing thumbnail cleared.');
    }

    // --- 2. Handle Additional Images Update ---
    console.log(`--- Additional Images Update Processing (Line ${getLineNumber()}) ---`);
    let currentImages: IImageInfo[] = [...currentProject.images || []];
    console.log('Current images before update:', currentImages.map(img => img.public_id));

    // Handle specific image deletions requested from frontend by public_id
    const imagesToDelete: string[] = Array.isArray(body.imagesToDelete)
        ? body.imagesToDelete.map((id: string) => String(id).trim()).filter(Boolean)
        : (typeof body.imagesToDelete === 'string' && body.imagesToDelete.length > 0
            ? body.imagesToDelete.split(',').map((id: string) => id.trim()).filter(Boolean)
            : []);

    if (imagesToDelete.length > 0) {
        console.log('Images to delete:', imagesToDelete);
        const publicIdsToDeleteSet = new Set(imagesToDelete);
        const imagesToKeep = [];
        const imagesToActuallyDelete = [];

        for (const img of currentImages) {
            if (publicIdsToDeleteSet.has(img.public_id)) {
                imagesToActuallyDelete.push(img);
            } else {
                imagesToKeep.push(img);
            }
        }
        await deleteProjectImages(imagesToActuallyDelete); // Delete from Cloudinary
        currentImages = imagesToKeep; // Update currentImages to reflect deletions
        console.log('Images deleted and currentImages updated. Remaining:', currentImages.map(img => img.public_id));
    }

    // Handle the 'clearImages' flag from frontend to remove ALL additional images
    if (body.clearImages === 'true') {
        console.log('Clearing all existing additional images.');
        await deleteProjectImages(currentProject.images); // Delete all existing images from Cloudinary
        currentImages = []; // Reset the array
        console.log('All additional images cleared.');
    }

    // Add new image uploads
    if (files?.images && files.images.length > 0) {
        console.log('New additional images to upload:', files.images.length);
        for (const file of files.images) {
            // Check for `file.buffer` property
            if (file.buffer) {
                try {
                    // DIRECTLY USE THE BUFFER FROM MULTER
                    const imageBuffer = file.buffer;
                    console.log(`Uploading new additional image ${file.originalname}`);
                    const image = await uploadImageToCloudinary(imageBuffer, 'portfolio-projects');
                    currentImages.push(image);
                    console.log('New additional image uploaded:', image);
                } catch (error: any) {
                    console.warn(`Warning (Line ${getLineNumber()}): Failed to upload new additional image ${file.originalname}:`, error);
                }
            } else {
                console.warn(`Warning (Line ${getLineNumber()}): Skipping new additional image ${file.originalname} due to missing buffer data.`);
            }
        }
    }
    updateFields.images = currentImages; // Assign the potentially modified images array

    console.log('--- updateProject: Final Cloudinary Upload Results (after processing) ---');
    console.log('Final thumbnailInfo (in updateFields):', updateFields.thumbnail);
    console.log('Final imagesInfo (in updateFields):', updateFields.images);
    console.log('-----------------------------------------------------------------');

    // --- 3. Update Project in Database ---
    console.log(`--- Updating Project in DB (Line ${getLineNumber()}) ---`);
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateFields }, // Use $set to update only specified fields
        {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on update
            overwrite: false // Prevent accidental overwrite of the entire document
        }
    );

    if (!updatedProject) {
        res.status(404);
        throw new Error('Project not found after update attempt.');
    }

    console.log(`Project updated successfully (Line ${getLineNumber()}):`, updatedProject._id);
    res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
});

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin API Key required)
 */
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(projectId)) {
        res.status(400);
        throw new Error('Invalid project ID format.');
    }

    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404);
        throw new Error('Project not found.');
    }

    // --- 1. Delete associated images from Cloudinary ---
    console.log(`--- Deleting Project Images from Cloudinary (Line ${getLineNumber()}) ---`);
    // Delete thumbnail if it exists
    if (project.thumbnail && project.thumbnail.public_id) {
        console.log(`Attempting to delete thumbnail: ${project.thumbnail.public_id}`);
        await deleteImageFromCloudinary(project.thumbnail.public_id).catch((err: any) => // <--- Add : any
        console.warn(`Failed to delete thumbnail ${project.thumbnail?.public_id || 'unknown'}:`, err)
        );
    }
    // Delete additional images
    console.log(`Attempting to delete ${project.images?.length || 0} additional images.`);
    await deleteProjectImages(project.images);
    console.log('Cloudinary images deletion process complete.');

    // --- 2. Delete Project from MongoDB ---
    console.log(`--- Deleting Project from MongoDB (Line ${getLineNumber()}) ---`);
    await Project.deleteOne({ _id: projectId }); // Use deleteOne() on the model
    console.log(`Project ${projectId} deleted from MongoDB.`);

    res.status(200).json({ message: 'Project deleted successfully!' });
});