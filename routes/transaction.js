const express = require("express");
const router = express.Router();
const auth = require("../middleware/token");
const {getTransactions} = require("../controller/transaction");

// Register route
router.get("/getTransactions",auth, getTransactions);



module.exports = router;
