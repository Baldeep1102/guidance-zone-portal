import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function logEmailSkip(to: string, subject: string) {
  console.log(`[EMAIL SKIP] No Resend API key. Would send to ${to}: "${subject}"`);
}

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

  if (!resend) {
    logEmailSkip(to, 'Verify your email');
    console.log(`  → Verify URL: ${verifyUrl}`);
    return;
  }

  await resend.emails.send({
    from: env.FROM_EMAIL,
    to,
    subject: 'Verify your email — Guidance Zone',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0;">Guidance Zone</h1>
          <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">A space for seekers</p>
        </div>
        <div style="background: #f9fafb; border-radius: 16px; padding: 32px; text-align: center;">
          <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">Welcome, ${name}!</h2>
          <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for joining the Guidance Zone community. Please verify your email address to get started.
          </p>
          <a href="${verifyUrl}" style="display: inline-block; background: #7B6CFF; color: white; text-decoration: none; padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 500;">
            Verify Email
          </a>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendRegistrationConfirmation(
  to: string,
  name: string,
  courseTitle: string,
  joinLink?: string | null,
  calendarUrl?: string,
) {
  if (!resend) {
    logEmailSkip(to, `You're registered: ${courseTitle}`);
    return;
  }

  await resend.emails.send({
    from: env.FROM_EMAIL,
    to,
    subject: `You're registered: ${courseTitle} — Guidance Zone`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0;">Guidance Zone</h1>
        </div>
        <div style="background: #f9fafb; border-radius: 16px; padding: 32px;">
          <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">Registration Confirmed!</h2>
          <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
            Hi ${name}, you've been registered for:
          </p>
          <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 24px;">
            ${courseTitle}
          </p>
          ${joinLink ? `
          <a href="${joinLink}" style="display: inline-block; background: #7B6CFF; color: white; text-decoration: none; padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            Join Session
          </a>` : ''}
          ${calendarUrl ? `
          <br/><a href="${calendarUrl}" style="display: inline-block; color: #7B6CFF; text-decoration: none; font-size: 14px; margin-top: 12px;">
            Add to Calendar
          </a>` : ''}
          <p style="color: #9CA3AF; font-size: 13px; margin-top: 24px;">
            Visit your <a href="${env.CLIENT_URL}/dashboard" style="color: #7B6CFF;">dashboard</a> for course materials and details.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  if (!resend) {
    logEmailSkip(to, 'Reset your password');
    console.log(`  → Reset URL: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: env.FROM_EMAIL,
    to,
    subject: 'Reset your password — Guidance Zone',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #111827; font-size: 24px; margin: 0;">Guidance Zone</h1>
        </div>
        <div style="background: #f9fafb; border-radius: 16px; padding: 32px; text-align: center;">
          <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">Password Reset</h2>
          <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name}, click below to reset your password. This link expires in 1 hour.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #7B6CFF; color: white; text-decoration: none; padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 500;">
            Reset Password
          </a>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
