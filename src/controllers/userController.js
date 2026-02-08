const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function getProfile(req, res) {
  return res.json({ user: req.user });
}

async function updateProfile(req, res) {
  const { username, email, password } = req.body;

  const update = {};
  if (username) update.username = username;
  if (email) update.email = email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(password, salt);
  }

  // если меняем email — проверим уникальность
  if (email) {
    const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (exists) return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  return res.json({ message: "Profile updated", user });
}

module.exports = { getProfile, updateProfile };
