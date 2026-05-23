import axios from 'axios';
import { emailConfig } from '../config/email.js';

const brevoApi = axios.create({
  baseURL: 'https://api.brevo.com/v3',
  headers: {
    'api-key': emailConfig.apiKey,
    'Content-Type': 'application/json',
  },
});

// @desc    Send transactional email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await brevoApi.post('/smtp/email', {
      to: [{ email: to }],
      sender: {
        email: emailConfig.senderEmail,
        name: emailConfig.senderName,
      },
      subject: subject,
      htmlContent: htmlContent,
      replyTo: {
        email: emailConfig.senderEmail,
        name: emailConfig.senderName,
      },
    });

    console.log(`Email sent to ${to} with ID: ${response.data.messageId}`);
    return {
      success: true,
      messageId: response.data.messageId,
    };
  } catch (error) {
    console.error('Email service error:', error.response?.data || error.message);
    throw new Error(`Failed to send email: ${error.response?.data?.message || error.message}`);
  }
};

// @desc    Send booking confirmation email to admin
export const sendAdminBookingNotification = async (booking) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a2e; margin-bottom: 20px;">New Booking Received</h2>
        
        <div style="background-color: #f0f4ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #0088ff;">
          <h3 style="color: #0088ff; margin-top: 0;">Booking Reference: ${booking.bookingReference}</h3>
          <p>A new booking has been made and requires your attention.</p>
        </div>

        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Guest Name:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${booking.contactInfo.firstName} ${booking.contactInfo.lastName}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Property:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${booking.property?.title || 'N/A'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Check-in:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${booking.checkInDate.toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Check-out:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              ${booking.checkOutDate.toLocaleDateString()}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong>Total Amount:</strong>
            </td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
              <strong style="color: #51cf66;">$${booking.pricing.totalPrice.toFixed(2)}</strong>
            </td>
          </tr>
        </table>

        <p style="color: #666;">
          Please log in to your admin dashboard to view and manage this booking.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2024 Luxury Vacation Rental. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail(
    emailConfig.adminEmail,
    `New Booking - ${booking.bookingReference}`,
    emailHtml
  );
};

// @desc    Send check-in reminder email
export const sendCheckInReminderEmail = async (booking, userEmail) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a2e; margin-bottom: 20px;">Your Check-in is Tomorrow!</h2>
        
        <p>Hi ${booking.contactInfo.firstName},</p>
        <p>We're excited to welcome you! Your check-in is tomorrow.</p>

        <div style="background-color: #f0f4ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #0088ff; margin-top: 0;">Check-in Details</h3>
          <p><strong>Property:</strong> ${booking.property?.title}</p>
          <p><strong>Address:</strong> ${booking.property?.location?.address}</p>
          <p><strong>Check-in Time:</strong> ${booking.property?.checkInTime} (24 hours from arrival)</p>
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
        </div>

        <h3 style="color: #0088ff;">Important Information</h3>
        <ul style="color: #666;">
          <li>Check-in instructions have been sent separately</li>
          <li>Please have a valid ID ready at check-in</li>
          <li>Our team is available 24/7 for any questions</li>
          <li>Review the house rules and amenities</li>
        </ul>

        <p style="color: #666; margin-top: 20px;">
          Need help? Contact us at support@luxuryvacationrental.com or call +1-800-LUXURY-1
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2024 Luxury Vacation Rental. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail(
    userEmail,
    'Your Check-in is Tomorrow! - Luxury Vacation Rental',
    emailHtml
  );
};

// @desc    Send review reminder email
export const sendReviewReminderEmail = async (booking, userEmail) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1a1a2e; margin-bottom: 20px;">Share Your Experience!</h2>
        
        <p>Hi ${booking.contactInfo.firstName},</p>
        <p>Thank you for staying with us! We'd love to hear about your experience.</p>

        <div style="background-color: #f0f4ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>Your review helps other travelers make informed decisions and helps us improve our service.</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="https://luxuryvacationrental.com/review/${booking._id}" 
               style="background-color: #0088ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Leave a Review
            </a>
          </p>
        </div>

        <p style="color: #666;">
          Your feedback is valuable and will be published on your booking confirmation page within 24 hours of submission.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © 2024 Luxury Vacation Rental. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail(
    userEmail,
    'Share Your Stay Experience - Luxury Vacation Rental',
    emailHtml
  );
};

// @desc    Send newsletter email
export const sendNewsletterEmail = async (emails, subject, content) => {
  try {
    const response = await brevoApi.post('/contacts/lists/{list_id}/contacts/add', {
      emails: emails.map(email => ({ email })),
    });

    return {
      success: true,
      message: 'Newsletter sent successfully',
    };
  } catch (error) {
    throw new Error(`Failed to send newsletter: ${error.message}`);
  }
};