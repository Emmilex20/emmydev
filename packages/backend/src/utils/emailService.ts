// packages/backend/src/utils/emailService.ts
import nodemailer from 'nodemailer';

// Configure your Nodemailer transporter
// Use environment variables for sensitive data!
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,      // e.g., 'smtp.mailtrap.io' for development, or 'smtp.gmail.com'
  port: parseInt(process.env.EMAIL_PORT || '587', 10), // e.g., 587 or 465
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' if port is 465, 'false' for 587 (TLS)
  auth: {
    user: process.env.EMAIL_USER,    // Your email address (e.g., your_email@gmail.com)
    pass: process.env.EMAIL_PASS     // Your email password or app-specific password
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string; // Optional: sender email address
}

/**
 * Sends an email using the configured Nodemailer transporter.
 * @param options Email options including recipient, subject, and HTML content.
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: options.from || process.env.EMAIL_USER, // Default to sender email if not provided
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    // In a real application, you might want to log this error
    // or use a dedicated error logging service.
    throw new Error('Failed to send email notification.');
  }
};