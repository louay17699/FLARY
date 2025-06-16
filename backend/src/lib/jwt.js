export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Set cookie with proper mobile-friendly settings
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Prevents JavaScript access
    sameSite: "none", // Allows cross-site cookies (for mobile)
    secure: true, // Requires HTTPS
    domain: ".onrender.com", // Allows cookies for all subdomains
    path: "/", // Available on all routes
  });

  // Also return the token in the response (for mobile fallback)
  return { token, userId };
};