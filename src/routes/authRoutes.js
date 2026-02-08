const express = require("express");
const router = express.Router();

const Joi = require("joi");
const validate = require("../middleware/validate");
const { register, login } = require("../controllers/authController");

// validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// 🔴 ЭТА СТРОКА ОБЯЗАТЕЛЬНА
module.exports = router;
