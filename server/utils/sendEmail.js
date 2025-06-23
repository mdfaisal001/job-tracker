// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // Your Gmail
    pass: process.env.EMAIL_PASSWORD, // Your App Password (NOT Gmail password)
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Job Pilot" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.response);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

module.exports = sendEmail;
