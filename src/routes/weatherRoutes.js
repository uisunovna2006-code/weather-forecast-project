const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const { getWeatherByCity } = require("../controllers/weatherController");

router.get("/", protect, getWeatherByCity);

module.exports = router;
