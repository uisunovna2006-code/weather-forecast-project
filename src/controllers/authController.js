const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

async function register(req, res) {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ username, email, password: hashed });

  return res.status(201).json({
    message: "User registered",
    token: generateToken(user._id),
    user: { id: user._id, username: user.username, email: user.email }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: { id: user._id, username: user.username, email: user.email }
  });
}

module.exports = { register, login };
