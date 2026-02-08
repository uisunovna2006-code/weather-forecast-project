const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "No token. Unauthorized." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found. Unauthorized." });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token. Unauthorized." });
  }
}

module.exports = protect;
