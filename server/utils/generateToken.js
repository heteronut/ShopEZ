const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "dev_only_secret", { expiresIn: "7d" });
}

module.exports = generateToken;
