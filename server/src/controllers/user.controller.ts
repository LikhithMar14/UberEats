import { Request, Response } from "express";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs"
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../prismaClient";
import jwt from "jsonwebtoken"
import { generateAccessToken,generateVerificationCode,generateRefreshToken } from "../utils/TokenGenerate";
import { cookieOptions, STATUS_CODES } from "../constants";



export const signup = asyncHandler(async(req:Request,res:Response) => {
    const {contact,email,password,fullname} = req.body;

    const userDetails = [contact,email,password,fullname];

    if(!userDetails.every(Boolean))throw new ApiError(400,"All fields are required!")
    
    const userExist = await prisma.user.findUnique({
        where:{email:email}
    })
    if(userExist)throw new ApiError(400,"User already exist with this email")
    const hashedPassword = await bcrypt.hash(password,10);
    const verificationToken = generateVerificationCode();

    const user = await prisma.user.create({
        data:{
            fullname,
            email,
            password:hashedPassword,
            contact:Number(contact),
            verificationToken,
            verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
        }
    })
    const accessToken = generateAccessToken(user)
    res.status(STATUS_CODES.CREATED).cookie('accessToken',accessToken,cookieOptions)
    


        
    

})

