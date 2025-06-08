import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/messagemodel.js";
import User from "../models/usermodel.js";

export const getUsers = async (req,res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:loggedInUser}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error trying to get users:", error.message);
         res.status(500).json({message : "server error"});
    }
}

export const getMessages = async (req,res)=> {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("error trying to get messages",error.message);
        res.status(500).json({message: "server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image, voice, duration } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image && !voice) {
            return res.status(400).json({message: "Message content is required"});
        }

        let imageURL;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "auto",
                    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "svg", "bmp", "tiff"],
                    quality: "auto",
                    transformation: [
                        { width: 1000, height: 1000, crop: "limit" }
                    ]
                });
                imageURL = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(400).json({
                    message: "Failed to upload image",
                    details: uploadError.message
                });
            }
        }

        let voiceURL;
        if (voice) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(voice, {
                    resource_type: "video",
                    format: "mp3",
                    timeout: 60000, // 1 minute timeout
                });
                voiceURL = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error for voice:", uploadError);
                return res.status(400).json({
                    message: "Failed to upload voice message",
                    details: uploadError.message
                });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
            voice: voiceURL,
            duration: duration || 0,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
        
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}