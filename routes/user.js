const express = require("express");
const router = express.Router();
const auth = require("../middleware/token");
const { registerUser, loginUser,getUser,getTopUsers, getReferralCount,updateBankAccount } = require("../controller/user");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get user details route
router.get("/getUser", auth, getUser);

router.get("/getTopUsers", getTopUsers);

router.post("/updateBankAccount",auth,updateBankAccount);


router.get("/getReferralCount/:username", getReferralCount);

module.exports = router;
