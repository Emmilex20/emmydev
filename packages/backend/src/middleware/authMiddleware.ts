// packages/backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler'; // <-- Import asyncHandler

// Extend the Request interface to include an optional 'user' or 'apiKey' field if needed later
// This is fine to keep commented out or active based on your needs
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any; // Example if you add user auth later
//     }
//   }
// }

/**
 * @desc    Protect routes by checking for a valid ADMIN_API_KEY
 * @param   req Request
 * @param   res Response
 * @param   next NextFunction
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { // <-- Wrap with asyncHandler
  let apiKey: string | undefined;

  // Check for 'x-api-key' in headers
  if (req.headers['x-api-key']) {
    apiKey = Array.isArray(req.headers['x-api-key'])
      ? req.headers['x-api-key'][0]
      : req.headers['x-api-key'];
  }

  // If no API key is provided
  if (!apiKey) {
    // Set status and throw error; asyncHandler will catch and pass to error middleware
    res.status(401);
    throw new Error('Not authorized, no API key provided.');
  }

  // Check if API key matches the one in environment variables
  // IMPORTANT: Ensure process.env.ADMIN_API_KEY is loaded (e.g., in your main server file)
  if (apiKey !== process.env.ADMIN_API_KEY) {
    res.status(401);
    throw new Error('Not authorized, invalid API key.');
  }

  // If valid, proceed to the next middleware/route handler
  next();
});