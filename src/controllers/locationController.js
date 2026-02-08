const Location = require("../models/Location");

async function createLocation(req, res) {
  const { name, country, notes } = req.body;
  const location = await Location.create({ user: req.user._id, name, country, notes });
  return res.status(201).json({ message: "Location created", location });
}

async function getLocations(req, res) {
  const locations = await Location.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json({ locations });
}

async function getLocationById(req, res) {
  const location = await Location.findOne({ _id: req.params.id, user: req.user._id });
  if (!location) return res.status(404).json({ message: "Location not found" });
  return res.json({ location });
}

async function updateLocation(req, res) {
  const location = await Location.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!location) return res.status(404).json({ message: "Location not found" });
  return res.json({ message: "Location updated", location });
}

async function deleteLocation(req, res) {
  const location = await Location.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!location) return res.status(404).json({ message: "Location not found" });
  return res.json({ message: "Location deleted" });
}

module.exports = {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};
