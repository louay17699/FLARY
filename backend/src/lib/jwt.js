import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",  // Required for cross-site
    secure: true,      // Must be true for SameSite=None
    domain: ".onrender.com"  // Wildcard domain for all subdomains
  });

  return token;
};