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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { token } = generateToken(user._id, res);

    res.status(200).json({
      token, // Send token in response (for mobile fallback)
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("error trying to logout ❌", error.message)
        res.status(500).json({message:"Server error trying to logout  🛠️"})
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

    if (!profilePic && !fullName && bio === undefined) {
      return res.status(400).json({ message: "At least one field is required for update" });
    }

    const updateData = {};
    
    if (profilePic) {
      const user = await User.findById(userId);
      if (user.profilePic) {
        const publicId = user.profilePic.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
        } catch (error) {
          console.log("Error deleting old image:", error.message);
        }
      }

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

    if (fullName) {
      if (fullName.trim().length < 2) {
        return res.status(400).json({ message: "Full name must be at least 2 characters" });
      }
      updateData.fullName = fullName.trim();
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({ message: "Bio must be 500 characters or less" });
      }
      updateData.bio = bio;
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
            res.status(200).json({
  ...req.user.toObject(), 
  password: undefined 
})
        } catch (error) {
            console.log("error in auth check",error.message)
            res.status(500).json({message:"server error"})
        }
}


