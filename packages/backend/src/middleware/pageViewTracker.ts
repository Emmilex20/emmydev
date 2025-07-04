// packages/backend/src/middleware/pageViewTracker.ts
import { Request, Response, NextFunction } from 'express';
import PageView from '@models/PageView'; // Import the PageView model

/**
 * @desc    Express middleware to track page views.
 * Logs the requested path and timestamp to the database.
 * @param   req Request
 * @param   res Response
 * @param   next NextFunction
 */
export const pageViewTracker = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Exclude certain paths (e.g., favicon, health checks, or specific admin API calls)
    // You might want to refine this list based on your needs.
    const excludedPaths = [
      '/favicon.ico',
      '/robots.txt',
      '/api/health', // If you add a health check endpoint later
      '/api/contact', // Don't track contact form submissions as page views
      // '/api/projects' // Depending on if you want to track API calls as page views or just frontend routes
    ];

    // Only track GET requests that are not to excluded paths or directly to static assets
    // If your frontend directly accesses /api routes for content, you might want to adjust this.
    const isApiRoute = req.path.startsWith('/api/');
    const isExcluded = excludedPaths.some(path => req.path.startsWith(path));

    // For a portfolio, you typically want to track visits to the *frontend* routes.
    // When your frontend loads sections, it makes requests to /api/projects etc.
    // If you only want to track frontend *page* loads, this middleware
    // should ideally be on the frontend, or you need to specifically
    // track the actual "page" (e.g., root, /about, /projects) rather than every API call.
    // For now, this will track *any* incoming GET request to the backend not in excludedPaths.
    // If the frontend makes a GET to /api/projects to fetch data, this will log it.
    // To track actual *frontend route views*, you might send a custom event from the frontend.

    if (req.method === 'GET' && !isExcluded) {
      await PageView.create({
        path: req.path,
        timestamp: new Date(),
        // ipAddress: req.ip, // if you choose to store IP and handle privacy
        // userAgent: req.headers['user-agent'],
        // referrer: req.headers.referer
      });
      // console.log(`PageView logged: ${req.path}`); // Optional: for debugging
    }
  } catch (error) {
    // Log the error but don't stop the request flow
    console.error('Error tracking page view:', error);
  } finally {
    // Always call next() to pass the request to the next middleware/route handler
    next();
  }
};