import { STATUS_CODES } from "../constants";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Stripe from "stripe";



export const getOrders = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    if(!req.user)throw new ApiError(STATUS_CODES.UNAUTHORIZED,"User not found")
    const orders = await prisma.order.findMany({
        where:{
            id:req.user.id
        },
        include:{
            Restaurant:true,
            user:true
        }
    })
    return res.status(STATUS_CODES.OK).json({success:true,orders})
})

