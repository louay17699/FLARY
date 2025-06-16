import jwt from "jsonwebtoken";

export const generateToken =(userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: "7d",
    })

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",  // Allow cross-site cookies (for mobile)
    secure: true,      // Required for HTTPS
    domain: ".onrender.com"  // Allow cookies for all Render subdomains
  });
    return token;
}