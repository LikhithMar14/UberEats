import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../prismaClient";
import crypto from "crypto"
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationCode,
} from "../utils/TokenGenerate";
import { cookieOptions, STATUS_CODES } from "../constants";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../NodeMailer/email";
import { ApiResponse } from "../utils/ApiResponse";


export const signup = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { contact, email, password, fullname } = req.body;

    if (![contact, email, password, fullname].every(Boolean)) {
      throw new ApiError(400, "All fields are required!");
    }

    const userExist = await prisma.user.findFirst({
      where: { email },
    });
    if (userExist) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "User already exists with this email"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        contact: contact,
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    const accessToken = generateAccessToken(user);

    res
      .status(STATUS_CODES.CREATED)
      .cookie("accessToken", accessToken, cookieOptions);

    await sendVerificationEmail(email, verificationToken);

    const userWithoutPassword = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullname: true,
        address: true,
        contact: true,
        city: true,
        country: true,
      },
    });

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Account created successfully",
      user: userWithoutPassword,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {

      const { email, password } = req.body;
      if (![email, password].every(Boolean))
        throw new ApiError(STATUS_CODES.BAD_REQUEST);
      const userExist = await prisma.user.findFirst({
        where: { email: email },
      });
      if (!userExist) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Incorrect email or password",
        });
      }
      const user = userExist;

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          sucess: false,
          message: "Incorrect email or password",
        });

      user.lastLogin = new Date();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const userWithoutPassword = await prisma.user.findUnique({
        where: { email: email },
        select: {
          id: true,
          email: true,
          fullname: true,
          address: true,
          contact: true,
          city: true,
          country: true,
        },
      });

      res
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({
          success: true,
          message: `Welcome back ${user.fullname}`,
          user: userWithoutPassword,
        });
    } 
    
  
);


export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { verificationCode } = req.body;

  // Find the user based on the verification token and expiry
  const userDetails = await prisma.user.findFirst({
    where: {
      verificationToken: verificationCode,
      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      verificationToken: true,
      verificationTokenExpiry: true,
      isVerified: true,
    },
  });

  console.log("I am here inside userDetails");

  if (!userDetails) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found or token expired");
  }


  await prisma.user.update({
    where: { id: userDetails.id },
    data: {
      isVerified: true,
      verificationToken: "",
      verificationTokenExpiry: null,
    },
  });


  await sendWelcomeEmail(userDetails.email, userDetails.fullname);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "Email verified successfully.",
    userDetails,
  });
});

export const logOut = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    return res.clearCookie("accessToken").clearCookie("refreshToken").status(STATUS_CODES.OK).json({
        success:true,
        message:"Logged Out Successfully"
    })
})
export const forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;
        const userDetails = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!userDetails) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "User doesn't Exist" });
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: userDetails.id },
            data: {
                resetToken: resetToken,
                resetTokenExpiry: resetTokenExpiry,
            },
        });

        await sendPasswordResetEmail(userDetails.email, "github.com/LikhithMar14");

        return res.status(STATUS_CODES.OK).json({
            message: "Password reset link sent to your email",
        });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong, please try again later.",
        });
    }
});
