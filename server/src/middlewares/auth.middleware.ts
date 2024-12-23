import { NextFunction, Request } from "express";
import { STATUS_CODES } from "../constants";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../prismaClient";

export const verifyToken = asyncHandler(async (req: Request, _, next: NextFunction) => {
    try {
        const token: string = req.signedCookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized request');

        const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)

        
        const userId = typeof decodedPayload === 'object' && decodedPayload !== null && 'userId' in decodedPayload
            ? Number(decodedPayload.userId)
            : null;

            

        if (userId === null || isNaN(userId)) {
            throw new ApiError(401, 'Invalid token payload');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new ApiError(401, "User not found");

        req.user = user;
        console.log("verified successufully");
        
        next();
    } catch (error) {
        throw new ApiError(
            401,
            error instanceof Error ? error.message : 'Invalid token'
        );
    }
})
