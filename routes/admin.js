const express = require("express");
const router = express.Router();
const {login,signup } = require("../controller/admin");

// Register route
router.post("/login", login);

// Login route
router.post("/register", signup);


module.exports = router;