import express from "express";
import { protectRoute } from "../middleware/protectroute.js";
import { updateUserWallpaper, deleteCustomWallpaper } from "../controllers/wallpaperController.js";

const router = express.Router();

router.put("/wallpaper", protectRoute, updateUserWallpaper);
router.delete("/wallpaper/:wallpaperId", protectRoute, deleteCustomWallpaper);

export default router;