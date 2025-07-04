// packages/backend/src/models/PageView.ts
import { Schema, model, Document } from 'mongoose';

// Define the interface for a Page View document
export interface IPageView extends Document {
  path: string; // The URL path that was visited
  timestamp: Date;
  // Optional additions (consider privacy implications for storing IP):
  // ipAddress?: string; // Anonymized or full IP address (be mindful of GDPR/privacy)
  // userAgent?: string; // User-Agent header (browser, OS, etc.)
  // referrer?: string;  // The referring URL
}

// Define the Mongoose Schema
const PageViewSchema = new Schema<IPageView>({
  path: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
  // Add these if you decide to include them:
  // ipAddress: { type: String, trim: true },
  // userAgent: { type: String, trim: true, maxlength: 500 },
  // referrer: { type: String, trim: true, maxlength: 500 }
});

// Create and export the Mongoose Model
const PageView = model<IPageView>('PageView', PageViewSchema);

export default PageView;