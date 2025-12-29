const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail
      pass: process.env.EMAIL_PASS, // Your 16-digit App Password
    },
  });

  const mailOptions = {
    from: `"ArivoHomes Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // Fallback for old email clients
    html: options.html,    // Rich text email
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;