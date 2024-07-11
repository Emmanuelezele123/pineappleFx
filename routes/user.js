const express = require("express");
const router = express.Router();
const auth = require("../middleware/token");
const { registerUser, loginUser,getUser } = require("../controller/user");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user details route
router.get("/getUser", auth, getUser);

module.exports = router;
