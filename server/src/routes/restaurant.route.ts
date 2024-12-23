import express from "express"
import { createRestaurant, getRestaurant, getRestaurantorder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controllers/restaurant.controller";
import upload from "../middlewares/multer.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create").post(verifyToken,upload.fields([{name:'restaurantImage',maxCount:1}]), createRestaurant);
router.route("/get").get(verifyToken,getRestaurant);
router.route("/update").put(verifyToken,upload.fields([{name:'restaurantImage',maxCount:1}]), updateRestaurant);
router.route("/order").get(verifyToken,getRestaurantorder);
router.route("/order/:orderId/status").put(verifyToken,updateOrderStatus);
router.route("/search/:searchText").get(verifyToken,searchRestaurant);
router.route("/:id").get(verifyToken,getSingleRestaurant);

export default router;


