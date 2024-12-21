import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
console.log("Hello");
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.UberEatsAppPassword,
  },
});

const mailOptions = {
  from: {
    name: "Google Summer Internship Program",
    address: process.env.SENDER_GMAIL, // Your email address
  }, // Sender address
  to: process.env.RECIVER_GMAIL_TRAIL, 
  subject:
    "Congratulations! You are selected for the Google Summer Internship Program", 
  text: "Hello! Congratulations on being selected for the Google Summer Internship Program.",
  html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 10px 0;
              background: #007bff;
              color: #ffffff;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              text-align: left;
            }
            .content h2 {
              color: #007bff;
              margin-bottom: 10px;
            }
            .content p {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #888888;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Congratulations!</h1>
            </div>
            <div class="content">
              <h2>Welcome to the Google Summer Internship Program!</h2>
              <p>Dear Praveen Ramisetti,<p>
              <p>
                We are thrilled to inform you that you have been selected for the
                prestigious Google Summer Internship Program. This is a fantastic
                opportunity to work with some of the brightest minds in the
                industry and make a real impact.
              </p>
              <p>
                Please review the attached documents and follow the instructions
                to confirm your participation.
              </p>
              <p>We look forward to having you onboard!</p>
              <p>Best regards,</p>
              <p><strong>Google Summer Internship Team</strong></p>
            </div>
            <div class="footer">
              <p>
                This is an automated email. Please do not reply to this email.
              </p>
              <p>&copy; 2024 Google Summer Internship Program</p>
            </div>
          </div>
        </body>
      </html>
    `,
};

const sendMail = async (transporter: any, mailOptions: any) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has Been Sent");
  } catch (error) {
    console.error(error);
  }
};

sendMail(transporter, mailOptions);
