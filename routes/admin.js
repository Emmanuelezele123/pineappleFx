const express = require("express");
const router = express.Router()
const auth = require('../middleware/admin');
const {login,signup, getAllUsers,getUserById,updateUserById,getTransactionsForUser,
    getAllTransactionsByType,getAllTransactionsSummary,getAllTransactions } = require("../controller/admin");

// Register route
router.post("/login", login);

// Login route
router.post("/register", signup);


router.get("/getAllUsers", auth,getAllUsers);


router.put("/updateUserById/:id", updateUserById);


router.get("/getUserById", getUserById);



// Route to get transactions for a user
router.get('/transactions/user/:userId',auth, getTransactionsForUser);

// Route to get transactions by type
router.get('/transactions/type/:type',auth, getAllTransactionsByType);

router.get('/transactions/',auth, getAllTransactions);

// Route to get summary of transactions by type for a user
router.get('/transactions/summary',auth, getAllTransactionsSummary);

module.exports = router;