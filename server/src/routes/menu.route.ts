import express from "express" 
import upload from "../middlewares/multer.middleware";
import { addMenu,editMenu } from "../controllers/menu.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add-menu").post(verifyToken,upload.fields([{name:'profilePicture',maxCount:1}]),addMenu);
router.route("/edit/:id").put(verifyToken,upload.fields([{name:'profilePicture',maxCount:1}]), editMenu);
 
export default router;


