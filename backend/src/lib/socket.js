import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/usermodel.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://flary-frontend.onrender.com",
      "http://localhost:3000" // For local testing
    ],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {}; 

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    
    
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { lastOnline: null },
        { new: true }
      );
      io.emit("userStatusUpdate", updatedUser);
    } catch (error) {
      console.error("Error updating user online status:", error);
    }
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", async () => {
  console.log("A user disconnected", socket.id);
  
  if (userId) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { lastOnline: new Date() },
        { new: true }
      );
      
      
      io.emit("userStatusUpdate", {
        _id: updatedUser._id,
        lastOnline: updatedUser.lastOnline,
        isOnline: false
      });
      
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } catch (error) {
      console.error("Error updating user offline status:", error);
    }
  }
});
});

export { io, app, server };