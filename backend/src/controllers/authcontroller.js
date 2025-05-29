import { generateToken } from "../lib/jwt.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const {fullName,email,password} = req.body;
    try {
        
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "💡All fields are required"});
        }

        
        if (password.length < 8){
            return res.status(400).json({message: "💡Password need to be at least 8 characters"});
        }
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({message : "💡Email already exists"}); 
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })


        if (newUser){
            generateToken(newUser._id,res);
            await newUser.save(); 

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }
        else{
            return res.status(400).json({message: "Invalid User❌"})
        }

    } catch (error) {
        console.log("error trying to sign up ❌", error.message)
        res.status(500).json({message:"Server error trying to signup 🛠️"})
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message : "Invalid Credentials❌ "})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect){
            return res.status(400).json({message : "Invalid Credentials❌ "})
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

        
    } catch (error) {
        console.log("error trying to login ❌", error.message)
        res.status(500).json({message:"Server error trying to login 🛠️"})
    }
}


export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("error trying to logout ❌", error.message)
        res.status(500).json({message:"Server error trying to logout  🛠️"})
    }
}

// Update in authcontroller.js
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    // Validate at least one field is being updated
    if (!profilePic && !fullName) {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

    const updateData = {};
    
    // Handle profile picture update
    if (profilePic) {
      // Remove any existing Cloudinary image if needed
      const user = await User.findById(userId);
      if (user.profilePic) {
        const publicId = user.profilePic.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
        } catch (error) {
          console.log("Error deleting old image:", error.message);
        }
      }

      // Upload new image with optimized settings
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pictures",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto:best" }
        ]
      });
      updateData.profilePic = uploadResponse.secure_url;
    }

    // Handle name update
    if (fullName) {
      if (fullName.trim().length < 2) {
        return res.status(400).json({ message: "Full name must be at least 2 characters" });
      }
      updateData.fullName = fullName.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ 
      message: error.response?.data?.message || "Failed to update profile",
      error: error.message 
    });
  }
};


export const checkAuth = (req, res) => {
        try {
            res.status(200).json(req.user)
        } catch (error) {
            console.log("error in auth check",error.message)
            res.status(500).json({message:"server error"})
        }
}


