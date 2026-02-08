const router = require("express").Router();
const Joi = require("joi");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} = require("../controllers/locationController");

const createSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  country: Joi.string().max(80).optional().allow(""),
  notes: Joi.string().max(200).optional().allow("")
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(80).optional(),
  country: Joi.string().max(80).optional().allow(""),
  notes: Joi.string().max(200).optional().allow("")
}).min(1);

router.post("/", protect, validate(createSchema), createLocation);
router.get("/", protect, getLocations);
router.get("/:id", protect, getLocationById);
router.put("/:id", protect, validate(updateSchema), updateLocation);
router.delete("/:id", protect, deleteLocation);

module.exports = router;
