const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,

    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "E-shop App <abdelrahman31277009@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
    return await transporter.sendMail(mailOptions);
  
};

module.exports = sendEmail;
