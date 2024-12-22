import express from "express" 
import upload from "../middlewares/multer.middleware";
import { addMenu,editMenu } from "../controllers/menu.controller";

const router = express.Router();

router.route("/").post(upload.single("image"), addMenu);
router.route("/:id").put(upload.single("image"), editMenu);
 
export default router;


