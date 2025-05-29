import express from "express";
import { protectRoute } from "../middleware/protectroute.js";
import { updateUserWallpaper } from "../controllers/wallpaperController.js";

const router = express.Router();

router.put("/wallpaper", protectRoute, updateUserWallpaper);

export default router;