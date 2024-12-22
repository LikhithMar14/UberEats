import express from "express"
import { createRestaurant, getRestaurant, getRestaurantorder, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controllers/restaurant.controller";
import upload from "../middlewares/multer.middleware";


const router = express.Router();

router.route("/").post(upload.single("imageFile"), createRestaurant);
router.route("/").get(getRestaurant);
router.route("/").put(upload.single("imageFile"), updateRestaurant);
router.route("/order").get(getRestaurantorder);
router.route("/order/:orderId/status").put(updateOrderStatus);
router.route("/search/:searchText").get(searchRestaurant);
router.route("/:id").get(getSingleRestaurant);

export default router;


