const express = require("express");
const router = express.Router();
const auth = require("../middleware/token");
const {createTrade,pendingTrade} = require("../controller/trade");

// Register route
//router.post("/createTrade",auth, createTrade);
router.get("/getPendingTrade",auth, pendingTrade);


module.exports = router;