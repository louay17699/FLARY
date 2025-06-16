export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  // Set cookie with mobile-friendly settings
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "none", // Critical for mobile
    secure: true, // Must be true for sameSite=none
    domain: "flary.onrender.com", // Your backend domain
    path: "/"
  });

  // ALWAYS return token in response for mobile fallback
  return { token, userId };
};