import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send password reset email
export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: `"Hirelink Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Hirelink — Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your Hirelink password. 
           Click the button below to reset it. This link expires in 
           <strong>15 minutes.</strong>
        </p>
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 24px; 
                  background-color: #4F46E5; color: white; 
                  text-decoration: none; border-radius: 5px; 
                  margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, you can safely ignore this email. 
           Your password will not be changed.
        </p>
        <p>— The Hirelink Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};