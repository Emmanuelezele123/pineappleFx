const express = require("express");
const router = express.Router()
const auth = require('../middleware/admin');
const {login,signup, getAllUsers,getUserById,updateUserById,getTransactionsForUser,
    getAllTransactionsByType,getAllTransactionsSummary,getAllTransactions,toggleBlockUser,depositToUser,withdrawFromUser } = require("../controller/admin");

const { upsertRates, getRates } = require("../controller/rateController");

// Register route
router.post("/login", login);

// Login route
router.post("/register", signup);


router.get("/getAllUsers", auth,getAllUsers);


router.put("/updateUserById/:id", updateUserById);


router.post("/togglebanUser",auth, toggleBlockUser);


router.post("/depositById", auth,depositToUser);


router.post("/withdrawById",auth, withdrawFromUser);


router.post("/getUserById", getUserById);


// Route to get transactions for a user
router.get('/transactions/user/:userId',auth, getTransactionsForUser);

// Route to get transactions by type
router.get('/transactions/type/:type',auth, getAllTransactionsByType);

router.get('/transactions/',auth, getAllTransactions);

// Route to get summary of transactions by type for a user
router.get('/transactions/summary',auth, getAllTransactionsSummary);


// Create or update rates
router.post("/upsertRate", upsertRates);

// Get rates
router.get("/getRate", getRates);

module.exports = router;