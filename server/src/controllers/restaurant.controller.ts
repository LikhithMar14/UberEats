import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { uploadFileToCloudinary } from "../utils/cloudinary";
import { TUserFiles } from "../types";
import { STATUS_CODES } from "../constants";

export const createRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any>=>{
        const {restaurantName,city,country,deliveryTime} = req.body
        const {cuisines} = req.body
        // console.log(cuisines)
        // console.log(typeof cuisines)
        let parsedCuisines: string[] = [];
        if (typeof cuisines === 'string') {
            try {
                parsedCuisines = JSON.parse(cuisines); 
            } catch (error) {
                throw new ApiError(400, "Invalid format for cuisines");
            }
        } else if (Array.isArray(cuisines)) {
            parsedCuisines = cuisines;
        }

    
        //Assuming  an user can have only one  restaurant
        const existingRestaurant = await prisma.restaurant.findFirst({
            where:{
                userId:req?.user?.id
            }
        })
        if(existingRestaurant){
            throw new ApiError(400,"User already has a restaurent")
        }

        if(typeof restaurantName !== "string"){
            throw new ApiError(400,"Invalid restaurant name")
        }
        const userId = req?.user?.id;
        const restaurantImagePath = (<TUserFiles>req.files)?.restaurantImage?.[0]?.path;
        // console.log(restaurantImagePath)

        if(!restaurantImagePath)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Restaurant Image is required");

        const restaurantImageData = await uploadFileToCloudinary(restaurantImagePath, {
            folder: "Images",
            retries: 1,
        })
        if(!restaurantImageData){
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR,"Error uploading Restaurantimage")
        }
        console.log(typeof cuisines)
        const newRestaurent = await prisma.restaurant.create({
            data:{
                restaurantName : restaurantName,
                city,
                country,
                deliveryTime:Number(deliveryTime),
                cuisines:parsedCuisines,
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
export const updateRestaurant = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    console.log(req.body)
    const { restaurantName, city, country, deliveryTime } = req.body;
    const { cuisines } = req.body;

    // Parse cuisines
    let parsedCuisines: string[] = [];
    if (typeof cuisines === 'string') {
        try {
            parsedCuisines = JSON.parse(cuisines);
        } catch (error) {
            throw new ApiError(400, "Invalid format for cuisines");
        }
    } else if (Array.isArray(cuisines)) {
        parsedCuisines = cuisines;
    }

    // Find the user's restaurant
    const userId = req?.user?.id;
    const existingRestaurant = await prisma.restaurant.findFirst({
        where: { userId },
    });

    if (!existingRestaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // Validate restaurantName
    if (restaurantName && typeof restaurantName !== "string") {
        throw new ApiError(400, "Invalid restaurant name");
    }

    // Handle image upload
    const restaurantImagePath = (<TUserFiles>req.files)?.restaurantImage?.[0]?.path;
    let restaurantImageData;
    if (restaurantImagePath) {
        restaurantImageData = await uploadFileToCloudinary(restaurantImagePath, {
            folder: "Images",
            retries: 1,
        });

        if (!restaurantImageData) {
            throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Error uploading restaurant image");
        }
    }

    // Update restaurant details
    const updatedRestaurant = await prisma.restaurant.update({
        where: { id: existingRestaurant.id },
        data: {
            restaurantName: restaurantName || existingRestaurant.restaurantName,
            city: city || existingRestaurant.city,
            country: country || existingRestaurant.country,
            deliveryTime: deliveryTime ? Number(deliveryTime) : existingRestaurant.deliveryTime,
            cuisines: parsedCuisines.length > 0 ? parsedCuisines : existingRestaurant.cuisines,
            imageUrl: restaurantImageData?.secure_url || existingRestaurant.imageUrl,
        },
    });

    return res.status(200).json({
        success: true,
        message: "Restaurant updated successfully!",
        data: updatedRestaurant,
    });
});

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
            restaurantId:restaurantDetails.id
        },
        include:{
            restaurant:true,
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

export const  searchRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const searchText = req.params.searchText || "";
    const searchQuery = req.query.searchQuery as string || "";
    const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
    
    const query: any = {};

    if (searchText) {
        query.OR = [
            { restaurantName: { contains: searchText, mode: 'insensitive' } },
            { city: { contains: searchText, mode: 'insensitive' } },
            { country: { contains: searchText, mode: 'insensitive' } },
        ];
    }

    if (searchQuery) {
        query.OR = [
            { restaurantName: { contains: searchQuery, mode: 'insensitive' } },
            { cuisines: { contains: searchQuery, mode: 'insensitive' } }
        ];
    }

    if (selectedCuisines.length > 0) {
        query.cuisines = {
            hasSome: selectedCuisines
        };
    }

    const restaurants = await prisma.restaurant.findMany({
        where: query
    });

    return res.status(200).json({
        success: true,
        data: restaurants
    });
    
})

export const getSingleRestaurant = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    const restaurantId = req.params.id;
    if(!restaurantId)throw new ApiError(STATUS_CODES.BAD_REQUEST,"Restaurant Id is required")
    const restaurantDetails = await prisma.restaurant.findFirst({
        where:{
            id:Number(restaurantId)
        },
        include:{
            menus:{
                orderBy:{
                    createdAt:"desc"
                }
            }
        }

    });

    if(!restaurantDetails)throw new ApiError(STATUS_CODES.NOT_FOUND,"Restaurant not found")
    return res.status(STATUS_CODES.OK).json({success:true,data:restaurantDetails})
})  