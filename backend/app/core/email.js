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

// Notify jobseeker when application is accepted or rejected
export const sendApplicationStatusEmail = async ({
  toEmail,
  jobseekerName,
  jobTitle,
  employerName,
  status,
}) => {
  const isAccepted = status === "accepted";
  const subject = isAccepted
    ? `Hirelink — Your application was accepted`
    : `Hirelink — Update on your application`;

  const headline = isAccepted ? "Application Accepted" : "Application Update";
  const bodyText = isAccepted
    ? `Great news! <strong>${employerName}</strong> has accepted your application for <strong>${jobTitle}</strong>.`
    : `Thank you for applying. Your application for <strong>${jobTitle}</strong> at <strong>${employerName}</strong> was not selected at this time.`;

  const accentColor = isAccepted ? "#16a34a" : "#6b7280";

  const mailOptions = {
    from: `"Hirelink" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${accentColor};">${headline}</h2>
        <p>Hi ${jobseekerName},</p>
        <p>${bodyText}</p>
        <p>Log in to Hirelink to view your applications and stay updated on new opportunities.</p>
        <a href="${process.env.CLIENT_URL}/applications"
           style="display: inline-block; padding: 12px 24px;
                  background-color: #4F46E5; color: white;
                  text-decoration: none; border-radius: 5px;
                  margin: 20px 0;">
          View My Applications
        </a>
        <p>— The Hirelink Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Notify employer when a jobseeker applies
export const sendNewApplicationEmail = async ({
  toEmail,
  employerName,
  jobseekerName,
  jobTitle,
  jobId,
}) => {
  const applicationsUrl = `${process.env.CLIENT_URL}/applications/job/${jobId}`;

  const mailOptions = {
    from: `"Hirelink" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Hirelink — New application for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Application Received</h2>
        <p>Hi ${employerName},</p>
        <p><strong>${jobseekerName}</strong> has applied for your job posting <strong>${jobTitle}</strong>.</p>
        <p>Log in to review their application and profile.</p>
        <a href="${applicationsUrl}"
           style="display: inline-block; padding: 12px 24px;
                  background-color: #4F46E5; color: white;
                  text-decoration: none; border-radius: 5px;
                  margin: 20px 0;">
          View Applicants
        </a>
        <p>— The Hirelink Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};