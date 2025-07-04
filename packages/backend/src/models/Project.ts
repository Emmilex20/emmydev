// packages/backend/src/models/Project.ts
import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for image information (url and public_id from Cloudinary)
export interface IImageInfo {
  url: string;
  public_id: string;
}

// Define the Mongoose sub-schema for IImageInfo
const ImageInfoSchema = new Schema<IImageInfo>({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
}, { _id: false }); // Do not create a separate _id for subdocuments if not needed

// Define the main interface for a Project document
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string; // Optional
  liveLink?: string;   // Optional
  category: 'web' | 'mobile' | 'ui-ux' | 'game' | 'other';
  order: number; // For display order on the frontend
  thumbnail?: IImageInfo; // Optional thumbnail image
  images?: IImageInfo[]; // Optional array of additional images
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for the Project model
const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Project title must be at least 3 characters long'],
      maxlength: [100, 'Project title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      minlength: [10, 'Project description must be at least 10 characters long'],
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies are required'],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Please provide at least one technology.',
      },
    },
    githubLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string | undefined) {
          if (!v) return true; // Optional field, allow empty string
          // Basic URL validation
          return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+(\/.*)?$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid GitHub URL!`,
      },
    },
    liveLink: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string | undefined) {
          if (!v) return true; // Optional field, allow empty string
          // Basic URL validation (more robust regex for production if needed)
          return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid live URL!`,
      },
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: {
        values: ['web', 'mobile', 'ui-ux', 'game', 'other'],
        message: 'Invalid project category. Must be one of: web, mobile, ui-ux, game, other',
      },
    },
    order: {
      type: Number,
      required: [true, 'Display order is required'],
      min: [0, 'Order must be a non-negative number'],
      unique: false, // Can have same order, sorting will use createdAt as tie-breaker
    },
    thumbnail: {
      type: ImageInfoSchema,
      required: [true, 'Thumbnail image is required'], // Thumbnail is required for new projects
    },
    images: {
      type: [ImageInfoSchema], // Array of image info objects
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Project model
const Project = model<IProject>('Project', ProjectSchema);

export default Project;