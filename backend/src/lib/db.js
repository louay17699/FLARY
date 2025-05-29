import mongoose from "mongoose";

export const connectDB = async ()=> {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to mongodb✅")
    } catch (error) {
        console.log("error trying to connect❌",error)
    }

};