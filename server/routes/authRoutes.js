const express = require("express");
const router = express.Router();
const { login, verifyOTP } = require("../controllers/authController");

router.post("/login", login);
router.post("/verify", verifyOTP);

module.exports = router;
