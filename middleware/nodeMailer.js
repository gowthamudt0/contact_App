// utils/nodemailer.js
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      return info; // Resolve with the information about the sent email
    })
    .catch((error) => {
      throw error; // Reject with the error if there is one
    });
}

module.exports = { sendEmail };
