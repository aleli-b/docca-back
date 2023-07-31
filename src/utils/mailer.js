const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: process.env.MAILER_MAIL,
      pass: process.env.MAILER_PASS,
    },
  });
  
  module.exports = transporter;