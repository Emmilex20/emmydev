// packages/backend/src/@types/express/index.d.ts

// This file extends Express's Request interface to include Multer's 'files' property
// so TypeScript knows about it without conflicting with express-async-handler.

declare namespace Express {
  export interface Request {
    // Multer's 'files' property can be an object (for upload.fields),
    // an array (for upload.array), or a single file (for upload.single - though req.file is used then),
    // or undefined if no files were uploaded.
    files?: {
      [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
    // If you use upload.single(), you might also need req.file:
    file?: Express.Multer.File;
  }
}