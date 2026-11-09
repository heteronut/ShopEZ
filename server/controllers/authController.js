const User = require("../models/User");
const generateToken = require("../utils/generateToken");

function publicUser(user) {
  return { _id: user._id, username: user.username, email: user.email, usertype: user.usertype };
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are all required" });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "An account with this email already exists" });
    // usertype is never taken from the request body: public registration is
    // always a customer. The admin account is created by the seed script.
    const user = await User.create({ username, email, password });
    res.status(201).json({ user: publicUser(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({ user: publicUser(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout (stateless JWT: the client discards the token)
function logout(req, res) {
  res.json({ message: "Logged out" });
}

// GET /api/users/profile
async function getProfile(req, res) {
  res.json(publicUser(req.user));
}

// PUT /api/users/profile
async function updateProfile(req, res, next) {
  try {
    const { username } = req.body;
    if (username) req.user.username = username.trim();
    await req.user.save();
    res.json(publicUser(req.user));
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, getProfile, updateProfile };
