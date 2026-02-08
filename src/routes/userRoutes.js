const router = require("express").Router();
const Joi = require("joi");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { getProfile, updateProfile } = require("../controllers/userController");

const updateSchema = Joi.object({
  username: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional()
}).min(1);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(updateSchema), updateProfile);

module.exports = router;
