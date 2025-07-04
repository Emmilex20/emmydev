// packages/backend/src/controllers/contactController.ts
import { Request, Response } from 'express';
import ContactMessage, { IContactMessage } from '@models/ContactMessage';
import { sendEmail } from '@utils/emailService';
import asyncHandler from 'express-async-handler'; // <-- Import asyncHandler

/**
 * @desc    Submit a new contact message
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => { // <-- Wrap with asyncHandler
  const { name, email, subject, message } = req.body;

  // Basic validation (Mongoose schema provides more detailed validation)
  if (!name || !email || !subject || !message) {
    res.status(400); // Set status before throwing
    throw new Error('Please fill in all fields.'); // <-- Throw error instead of returning response
  }

  // 1. Save message to database
  const newContactMessage: IContactMessage = await ContactMessage.create({
    name,
    email,
    subject,
    message,
  });

  // 2. Send email notification to yourself
  const ownerEmail = process.env.OWNER_EMAIL || process.env.EMAIL_USER; // Your email for notifications
  if (!ownerEmail) {
    console.error("OWNER_EMAIL environment variable is not set. Email notification will not be sent.");
    // Optionally, you could throw an error here if email notification is critical
    // res.status(500);
    // throw new Error("Email notification setup incomplete.");
  } else {
    // This part should also be robust. If sendEmail can throw, consider a try-catch for it
    // or let asyncHandler catch it from here.
    try {
      await sendEmail({
        to: ownerEmail,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h1>New Message from Portfolio Contact Form</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr/>
          <small>Received on: ${newContactMessage.createdAt.toLocaleString()}</small>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Decide if email sending failure should fail the whole request
      // For a contact form, you might still want to return 201 even if email fails,
      // as long as the message is saved. If not, throw here.
    }
  }

  res.status(201).json({
    message: 'Message sent successfully!',
    data: {
      id: newContactMessage._id,
      name: newContactMessage.name,
      email: newContactMessage.email,
      subject: newContactMessage.subject,
    },
  });

  // No explicit return statement here; asyncHandler ensures correct Promise<void> behavior.
});