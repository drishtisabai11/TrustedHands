import { env } from '../config/env';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const emailService = {
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    console.log(`[EmailService] Sending email to ${payload.to} | Subject: "${payload.subject}"`);
    // Production email integration (Resend / SendGrid / Nodemailer) will use env variables
    if (env.NODE_ENV === 'development') {
      console.log(`[EmailService] Dev Output Content:\n${payload.html}`);
    }
    return true;
  },

  async sendRegistrationWelcome(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Trusted Hands — Your Account is Ready',
      html: `<p>Hello ${name},</p><p>Welcome to Trusted Hands. Good work starts with the right hands.</p>`,
    });
  },

  async sendBookingConfirmation(email: string, bookingNumber: string, serviceTitle: string, scheduledDate: string, timeSlot: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Booking Confirmed #${bookingNumber} — Trusted Hands`,
      html: `<p>Your booking for <strong>${serviceTitle}</strong> on <strong>${scheduledDate} (${timeSlot})</strong> is confirmed.</p>`,
    });
  },
};
