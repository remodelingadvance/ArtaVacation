import fetch from 'node-fetch';
import { emailConfig } from '../config/email.js';

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': emailConfig.apiKey,
      },
      body: JSON.stringify({
        to: [
          {
            email: to,
          },
        ],
        sender: {
          email: emailConfig.senderEmail,
          name: emailConfig.senderName,
        },
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};