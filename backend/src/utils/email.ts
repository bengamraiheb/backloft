import nodemailer from 'nodemailer';

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send password reset email with link
export const sendResetPasswordEmail = async (
  to: string,
  name: string,
  resetUrl: string
) => {
  const mailOptions = {
    from: `"Jira Clone" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset',
    html: `
      <div>
        <h1>Password Reset Request</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #0052cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link is valid for 1 hour.</p>
        <p>Thank you,</p>
        <p>Jira Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send password reset OTP email
export const sendPasswordResetOTPEmail = async (
  to: string,
  name: string,
  otp: string
) => {
  const mailOptions = {
    from: `"Jira Clone" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Code',
    html: `
      <div>
        <h1>Password Reset Verification Code</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Use the verification code below to complete the process:</p>
        <div style="text-align: center; margin: 20px 0;">
          <div style="font-size: 24px; letter-spacing: 8px; font-weight: bold; background-color: #f2f2f2; padding: 15px; border-radius: 4px; display: inline-block;">
            ${otp}
          </div>
        </div>
        <p>This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Jira Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
    throw new Error('Failed to send password reset OTP email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: `"Jira Clone" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Welcome to Jira Clone',
    html: `
      <div>
        <h1>Welcome to Jira Clone!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Jira Clone. We're excited to have you on board.</p>
        <p>
          <a href="${process.env.CLIENT_URL}" style="background-color: #0052cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Go to Dashboard
          </a>
        </p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Thank you,</p>
        <p>Jira Clone Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
