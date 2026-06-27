const nodemailer = require('nodemailer');

/**
 * Sends an email using SMTP credentials from .env
 * @param {{ to: string, subject: string, html: string }} options
 */
async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for port 465, false for 587/others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"To-Do App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;