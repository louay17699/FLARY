import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";


export const protectRoute = async ( req,res,next ) => {
    try {
        
        const token = req.cookies.jwt;
        if ( !token ) {
            return res.status( 400 ).json({message : "Unauthorized 🚫"});
        }

        const decode = jwt.verify( token, process.env.JWT_SECRET );

        if(!decode) {
            return res.status( 400 ).json({message : "Unauthorized 🚫"});
        }

        const user = await  User.findById( decode.userId ).select("-password");

        if ( !user ) {
            return res.status(404).json({message : "User not found"});
        }

        req.user = user
        next()

    } catch (error) {
        console.log("error in protectrouter",error.message);
        res.status(500).json({message : "server error"});
    }
}