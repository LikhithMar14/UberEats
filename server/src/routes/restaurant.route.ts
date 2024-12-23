import express from "express"
import { createRestaurant, getRestaurant, getRestaurantorder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controllers/restaurant.controller";
import upload from "../middlewares/multer.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create").post(verifyToken,upload.fields([{name:'restaurantImage',maxCount:1}]), createRestaurant);//Testing Completed
router.route("/get").get(verifyToken,getRestaurant);//Testing Completed
router.route("/update").put(verifyToken,upload.fields([{name:'restaurantImage',maxCount:1}]), updateRestaurant);//Testing Completed
router.route("/orders").get(verifyToken,getRestaurantorder);//Testing Completed
router.route("/order/:orderId/update/status").put(verifyToken,updateOrderStatus);
router.route("/search/:searchText").get(verifyToken,searchRestaurant);//Testing Completed
router.route("/:id").get(verifyToken,getSingleRestaurant);//Testing Completed

export default router;


