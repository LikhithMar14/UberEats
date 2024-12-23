import express from "express" 
import upload from "../middlewares/multer.middleware";  
import { verifyToken } from "../middlewares/auth.middleware";
import { getOrders } from "../controllers/order.controller";


const router = express.Router();


router.route("/").get(verifyToken, getOrders);
router.route("/checkout/create-checkout-session").post(verifyToken, getOrders);


export default router;
