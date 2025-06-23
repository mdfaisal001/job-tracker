require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

sendEmail({
  to: 'mdfaisalsyed2310gmail@gmail.com',
  subject: '📬 Nodemailer Test',
  html: '<p>This is a working test using Nodemailer!</p>'
});
console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);