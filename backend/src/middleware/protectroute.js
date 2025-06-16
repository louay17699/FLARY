import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";


export const protectRoute = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // Debug line
    const token = req.cookies.jwt;
    
    if (!token) {
      console.log("No token found"); // Debug line
      return res.status(401).json({ message: "Unauthorized 🚫" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decode); // Debug line

    const user = await User.findById(decode.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message); // Debug line
    res.status(500).json({ message: "Server error" });
  }
};