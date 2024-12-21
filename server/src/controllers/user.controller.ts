import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../prismaClient";
import { generateAccessToken, generateVerificationCode } from "../utils/TokenGenerate";
import { cookieOptions, STATUS_CODES } from "../constants";
import { sendVerificationEmail } from "../NodeMailer/email";

export const signup = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { contact, email, password, fullname } = req.body;

    if (![contact, email, password, fullname].every(Boolean)) {
        throw new ApiError(400, "All fields are required!");
    }

    const userExist = await prisma.user.findFirst({
        where: { email },
    });
    if (userExist) {
        throw new ApiError(400, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    const user = await prisma.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            contact: (contact),
            verificationToken,
            verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
    });

    const accessToken = generateAccessToken(user);
    res.status(STATUS_CODES.CREATED).cookie('accessToken', accessToken, cookieOptions);

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
            country: true
        }
    });

    return res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword
    });
});
