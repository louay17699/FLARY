import jwt from "jsonwebtoken";

export const generateToken =(userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d",
    })

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "none",  // ← Must be "none" for cross-site
    secure: true,      // ← Must be true with sameSite: none
    domain: "flary-frontend.onrender.com" // ← Your exact domain
  });
    return token;
}