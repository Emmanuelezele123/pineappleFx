const express = require("express");
const router = express.Router();
const auth = require("../middleware/token");
const { registerUser, loginUser,getUser,getTopUsers, getReferralCount } = require("../controller/user");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user details route
router.get("/getUser", auth, getUser);

router.get("/getTopUsers", getTopUsers);

router.get("/getReferralCount/:username", getReferralCount);

module.exports = router;
