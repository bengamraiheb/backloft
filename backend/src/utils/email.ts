
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (
  email: string,
  name: string,
  resetUrl: string
) => {
  const mailOptions = {
    from: `"Jira Clone" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Hello ${name},</h2>
        <p>You requested a password reset for your Jira Clone account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0052cc; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link is valid for 1 hour.</p>
        <p>Thank you,<br>The Jira Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const mailOptions = {
    from: `"Jira Clone" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Welcome to Jira Clone',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2>Welcome to Jira Clone, ${name}!</h2>
        <p>Thank you for creating an account.</p>
        <p>You can now start creating and managing tasks.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background-color: #0052cc; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started</a>
        </div>
        <p>Thank you,<br>The Jira Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Just log the error but don't throw - welcome email is not critical
  }
};
