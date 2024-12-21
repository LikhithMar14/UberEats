import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.UberEatsAppPassword,
  },
});
export const From = {
    name:"UberEats",
    address:process.env.SENDER_GMAIL
}
export const To = {
    to:process.env.RECIVER_GMAIL
}
export const sendMail = async (transporter: any, mailOptions: any) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email has Been Sent");
    } catch (error) {
      console.error(error);
    
}}




