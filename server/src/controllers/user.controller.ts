import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../prismaClient";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationCode,
} from "../utils/TokenGenerate";
import { cookieOptions, STATUS_CODES } from "../constants";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../NodeMailer/email";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { TUserFiles } from "../types";

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
    console.log("Generated Verification Code ", verificationToken);

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
    console.log("Token Expiry: ", user.verificationTokenExpiry);
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
        profilePicture:true,
        isVerified:true
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
        profilePicture:true,
        isVerified:true
      },
    });
    console.log("Logged In Successfully!");

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

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    console.log("Inside Email Verification");
    const { verificationCode } = req.body;

    console.log(new Date());
    console.log("Verification Code in Input: ", verificationCode);
    const Human = await prisma.user.findFirst({
      where: {
        verificationToken: verificationCode,
      },
    });
    console.log("Verification Code in Database:", Human);

    let userDetails = await prisma.user.findFirst({
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
    console.log(userDetails);

    if (!userDetails) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        "User not found or token expired"
      );
    }

   userDetails =  await prisma.user.update({
      where: { id: userDetails.id },
      data: {
        isVerified: true,
        verificationToken: "",
        verificationTokenExpiry: null,
      },
      select:{
        id: true,
        fullname: true,
        email: true,
        verificationToken: true,
        verificationTokenExpiry: true,
        isVerified: true,
        profilePicture:true,
        country:true,
        city:true
      }
    });

    await sendWelcomeEmail(userDetails.email, userDetails.fullname);
    console.log(userDetails)

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Email verified successfully.",
      user: userDetails,
    });
  }
);

export const logOut = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  }
);
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      console.log("Inside Forgot Password Controller")
      const { email } = req.body;
      const userDetails = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!userDetails) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: "User doesn't Exist" });
      }

      const resetToken = crypto.randomBytes(40).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: userDetails.id },
        data: {
          resetToken: resetToken,
          resetTokenExpiry: resetTokenExpiry,
        },
      });
      console.log(process.env.FRONTEND_URL)
      await sendPasswordResetEmail(
        userDetails.email,
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        
      );
      console.log(resetToken);

      return res.status(STATUS_CODES.OK).json({
        sucess:true,
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        sucess:true,
        message: "Something went wrong, please try again later.",
      });
    }
  }
);
export const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Enter Your New Password",
      });
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!userDetails) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: userDetails.id,
      },
      data: {
        password: hashedPassword,
        resetToken: "",
        resetTokenExpiry: null,
      },
    });

    await sendResetSuccessEmail(userDetails.email);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Password reset successfully",
    });
  }
);

//data url no need of multer upload directly to cloudinary Or else if u have mulitpart/form-data then u need multer

export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    console.log("In updateProfile Controller");
    console.log("Files: ", req.files);

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Extract form data from body
    const { fullname, email, address, city, country } = req.body;

    // Check if required fields are provided
    if (!fullname || !email || !address || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Handle file upload
    console.log("Logging Request files",req.files)

    const profilePicturePath = (<TUserFiles>req.files)?.profilePicture?.[0]?.path;
    console.log(profilePicturePath);

    if (!profilePicturePath)
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        "Profile Picture is required"
      );

    // Upload to Cloudinary
    const profilePictureData = await uploadFileToCloudinary(profilePicturePath, {
      folder: "Images",
      retries: 1,
    });

    if (!profilePictureData)
      throw new ApiError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Failed to Upload Profile Picture, Try Again"
      );

    // Prepare the data to update
    const updatedData = {
      fullname,
      email,
      address,
      city,
      country,
      profilePicture: profilePictureData.secure_url
    };
    console.log("Updated Profile Picture: ",updatedData.profilePicture);

    // Update user in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select:{
        id:true,
        fullname:true,
        email:true,
        address:true,
        city:true,
        country:true,
        profilePicture:true
      }
    });

    console.log("Uploaded Successfully!");
    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  }
);
export const checkAuth = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    console.log("Inside Check Auth");

    const userId = Number(req.user?.id);
    console.log(userId);

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id:true,
        fullname:true,
        email:true,
        address:true,
        city:true,
        country:true,
        profilePicture:true
      },
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const generateSession = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const incomingToken: string = req.signedCookies.refreshToken;
    // console.log("Incoming Token:", incomingToken);
    if (!incomingToken)
      throw new ApiError(STATUS_CODES.BAD_REQUEST, "Refresh token not present");
    const decodedPayload = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    // console.log("Decoded Payload:", decodedPayload);

    const userId =
      typeof decodedPayload === "object" &&
      decodedPayload !== null &&
      "userId" in decodedPayload
        ? Number(decodedPayload.userId)
        : undefined;
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      
    });
    if (!userDetails)
      throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
    const accessToken = generateAccessToken(userDetails);
    const refreshToken = generateRefreshToken(userDetails);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Session generated successfully",
    });
  }
);
