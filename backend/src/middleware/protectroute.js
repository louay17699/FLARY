import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";


export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Unauthorized 🚫" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token userId:", decode.userId); // Debug

    const user = await User.findById(decode.userId).select("-password");
    
    if (!user) {
      console.log("User not found for ID:", decode.userId); // Debug
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};