import { STATUS_CODES } from "../constants";
import { prisma } from "../prismaClient";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import Stripe from "stripe";
import { ApiResponse } from "../utils/ApiResponse";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutSessionRequest {
    cartItems:{
        menuId:number,
        name:string,
        image:string,
        price:number,
        quantity:number
    }[],
    deliveryDetails:{
        name:string,
        email:string,
        address:string,
        city:string
    },
    restaurantId:number
}


export const getOrders = asyncHandler(async(req:Request,res:Response):Promise<any> => {
    if(!req.user)throw new ApiError(STATUS_CODES.UNAUTHORIZED,"User not found")
    const orders = await prisma.order.findMany({
        where:{
            id:req.user.id
        },
        include:{
            restaurant:true,
            user:true
        }
    })
    return res.status(STATUS_CODES.OK).json({success:true,orders})
})
export const createCheckoutSesion = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurantDetails = await prisma.restaurant.findFirst({
        where: {
            id: Number(checkoutSessionRequest.restaurantId)
        },
        include: {
            menus: true
        }
    });

    if (!restaurantDetails) {
        throw new ApiError(STATUS_CODES.NOT_FOUND, "Restaurant not found");
    }

    const order = await prisma.order.create({
        data: {
            userId: Number(req?.user?.id),
            restaurantId: Number(restaurantDetails.id),
            deliveryDetails: {
                create: {
                    email: checkoutSessionRequest.deliveryDetails.email,
                    address: checkoutSessionRequest.deliveryDetails.address,
                    city: checkoutSessionRequest.deliveryDetails.city,
                },
            },
            cartItems: {
                create: checkoutSessionRequest.cartItems.map((item) => ({
                    menuId: Number(item.menuId),
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: Number(item.quantity),
                })),
            },
            status: "pending",
        },
    });

    const menuItems = restaurantDetails.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'FR'],
        },
        line_items: lineItems,
        mode: "payment",
        metadata: {
            orderId: order.id.toString(),
            images: menuItems.map((item) => item.image).join(','),
        },
        success_url: `https://yourapp.com/success`,
        cancel_url: `https://yourapp.com/cancel`, 
    });

    if (!session.url) {
        throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Session creation failed");
    }

    return res.status(STATUS_CODES.OK).json({ success: true, url: session.url });
});

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item.id === Number(cartItem.menuId));
        if (!menuItem) {
            throw new Error(`Menu item with id ${cartItem.menuId} not found`);
        }

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100, 
            },
            quantity: cartItem.quantity,
        };
    });

    return lineItems;
};
