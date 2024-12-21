import { htmlContent, generateWelcomeEmailHtml, generatePasswordResetEmailHtml, generateResetSuccessEmailHtml } from "./htmlEmail";
import { transporter, From, To, sendMail } from "./NodeMailer";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  try {
    const { name, address } = From;
    const { to } = To;

    const mailOptions = {
      from: { name, address },
      to: email,
      subject: 'Verify your email',
      html: htmlContent.replace("{verificationToken}", verificationToken),
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send email verification");
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const mailOptions = {
      from: From,
      to: email,
      subject: 'Welcome to UberEats Food',
      html: generateWelcomeEmailHtml(name),
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send welcome email");
  }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  try {
    const mailOptions = {
      from: From,
      to: email,
      subject: 'Reset Your Password',
      html: generatePasswordResetEmailHtml(resetURL),
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email: string) => {
  try {
    const mailOptions = {
      from: From,
      to: email,
      subject: 'Password Reset Successful',
      html: generateResetSuccessEmailHtml(),
    };

    sendMail(transporter, mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send password reset success email");
  }
};
