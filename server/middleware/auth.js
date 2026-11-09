const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET || "dev_only_secret");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Not authorized, user not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.usertype === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
}

module.exports = { protect, adminOnly };
