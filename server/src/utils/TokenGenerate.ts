import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const generateAccessToken = ( user: User): string => {
  const payload = {
    userId: user.id,
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};

const generateRefreshToken = ( user: User): string => {
  const payload = {
    userId: user.id,
  };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return token;
};

const generateVerificationCode = (length = 6): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let verificationCode = ""; 
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    verificationCode += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return verificationCode;
};

export { generateAccessToken, generateRefreshToken, generateVerificationCode };
