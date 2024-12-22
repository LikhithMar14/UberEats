import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { TUserFiles } from "../types";
import { STATUS_CODES } from "../constants";
export const createRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any>=>{
        const {restaurantName,city,country,deliveryTime,cuisines} = req.body
        const file = req.file;
        //Assuming  an user can have only one  restaurant
        const existingRestaurant = await prisma.restaurant.findFirst({
            where:{
                userId:req?.user?.id
            }
        })
        if(existingRestaurant){
            throw new ApiError(400,"User already has a restaurent")
        }
        if(!file){
            throw new ApiError(400,"Image is required!")
        }
        if(typeof restaurantName !== "string"){
            throw new ApiError(400,"Invalid restaurant name")
        }
        const userId = req?.user?.id;
        const restaurantImagePath = (<TUserFiles>req.files)?.restaurantImage?.[0]?.path;

        if(!restaurantImagePath)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Restaurant Image is required");

        const restaurantImageData = await uploadFileToCloudinary(restaurantImagePath, {
            folder: "Images",
            retries: 1,
        })
        if(!restaurantImageData){
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,"Error uploading Restaurantimage")
        }

        const newRestaurent = await prisma.restaurant.create({
            data:{
                RestaurantName : restaurantName,
                city,
                country,
                deliveryTime,
                cuisines,
                imageUrl:restaurantImageData.secure_url,
                user: {connect:{id:userId}}
            }
        })
        return res.status(201).json({
            success:true,
            message:"Restaurent created successfully!",
            data:newRestaurent
        })
})
export const getRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const restuarantDetails = await prisma.restaurant.findFirst({
        where:{
            userId:req?.user?.id
        },
        include:{
            menus:true
        }
    })
    if(!restuarantDetails)return res.status(STATUS_CODES.NOT_FOUND).json({
        success:false,
        message:"Restaurant not found",
        restaurant:[]
    })
    return res.status(STATUS_CODES.OK).json({success:true,restaurant:restuarantDetails})
    
})
export const updateRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const {restaurantName,city,country,deliveryTime,cuisines} = req.body;
    const file = req.file;

    const restaurantDetails = await prisma.restaurant.findFirst({
        where:{
            userId:req.user?.id,
        }
    })
    if(!restaurantDetails)throw new ApiError(STATUS_CODES.NOT_FOUND,"Restaurant not found")
    const restaurantImagePath = (<TUserFiles>req.files)?.restaurantImage?.[0]?.path;

    if(!restaurantImagePath)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Restaurant Image is required");

    const restaurantImageData = await uploadFileToCloudinary(restaurantImagePath, {
        folder: "Images",
        retries: 1,
    })
    if(!restaurantImageData){
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,"Error uploading Restaurantimage")
    }

    const updatedRestaurent = await prisma.restaurant.update({
        where:{
            id:restaurantDetails.id
        },
        data:{
            RestaurantName : restaurantName,
            city,
            country,
            deliveryTime,
            cuisines,
            imageUrl:restaurantImageData.secure_url,
        }
    })
    return res.status(201).json({
        success:true,
        message:"Restaurent updated successfully!",
        data:updatedRestaurent
    })

})
export const getRestaurantorder = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const restaurantDetails = await prisma.restaurant.findFirst({
        where:{
            userId:req?.user?.id
        }
    })
    if(!restaurantDetails)return res.status(STATUS_CODES.NOT_FOUND).json({
        success:false,
        message:"Restaurant not found",
    })
    const orders = await prisma.order.findMany({
        where:{
            RestaurantId:restaurantDetails.id
        },
        include:{
            Restaurant:true,
            user:true
        }
    })
    return res.status(STATUS_CODES.OK).json({success:true,orders})
})

export const updateOrderStatus = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const {orderId} = req.params;
    const{status} = req.body;
    const orderDetails = await prisma.order.findFirst({
        where:{
            id:Number(orderId)
        }
    })
    if(!orderDetails)throw new ApiError(STATUS_CODES.NOT_FOUND,"Order not found")
    
    const updatedOrderDetails = await prisma.order.update({
        where:{
            id:Number(orderDetails.id)
        },
        data:{
            status
        }
    })
    return res.status(STATUS_CODES.OK).json({success:true,data:updatedOrderDetails})
    
})