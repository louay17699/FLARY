import express from "express";
import { protectRoute } from "../middleware/protectroute.js";
import { getMessages, getUsers, sendMessage } from "../controllers/messagecontroller.js";

const router = express.Router();

router.get("/users", protectRoute , getUsers )
router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage)
export default router;