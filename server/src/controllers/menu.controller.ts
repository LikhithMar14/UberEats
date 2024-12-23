import { STATUS_CODES } from "../constants";
import { TUserFiles } from "../types";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request,Response } from "express";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { prisma } from "../prismaClient";


export const addMenu = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const {name,description,price} = req.body;


    const menuImagePath = (<TUserFiles>req.files)?.menuImage?.[0]?.path;

    if(!menuImagePath)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Menu image is required")
        if (!menuImagePath)
            throw new ApiError(
              STATUS_CODES.BAD_REQUEST,
              "Menu Image is required"
            );
    const menuImage = await uploadFileToCloudinary(menuImagePath, {
        folder: "Images",
        retries: 1,
    })
    const restaurant = await prisma.restaurant.findFirst({
        where:{
            userId:req?.user?.id
        }
    })

    if(!restaurant)throw new ApiError(STATUS_CODES.NOT_FOUND,"Restaurant not found")
    

    const menu = await prisma.menu.create({
        data:{
            name,
            description,
            price,
            restaurantId:restaurant.id,
            image:menuImage?.secure_url!,

        }
    })
    return res.status(201).json({
        success:true,
        message:"Menu added successfully",
        menu
    });
    
})

export const editMenu = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const {menuId} = req.params;
    const {name,description,price} = req.body;
    const menuDetails = await prisma.user.findFirst({
        where:{id:Number(menuId)},
    })
    if(!menuDetails)throw new ApiError(STATUS_CODES.NOT_FOUND,"Menu not found")
    const menuImageFile = req.file
    if(!menuImageFile)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Menu image is required")
    const menuImagePath = (<TUserFiles>req.files)?.menuImage?.[0]?.path;
    if(!menuImagePath)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Menu image is required")
    const menuImage = await uploadFileToCloudinary(menuImagePath,{
        folder:"Images",
        retries:1,
    })
    const updatedMenu = await prisma.menu.update({
        where:{id:menuDetails.id},
        data:{
            name,
            description,
            price,
            image:menuImage?.secure_url!,
        }
    })
    return res.status(STATUS_CODES.OK).json({
        success:true,
        message:"Menu updated successfully",
        updatedMenu
    })
})