import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authroute.js";
import messageRoutes from "./routes/messageroute.js";
import { connectDB } from "./lib/db.js";
import { server, app } from "./lib/socket.js";  
import wallpaperRoute from "./routes/wallpaperRoute.js";


dotenv.config();

const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", wallpaperRoute);


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});