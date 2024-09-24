const express = require('express');
const router = express.Router();
const auth = require('../middleware/token');
const { transferMoney } = require('../controller/pineVest');




router.post('/transfer', auth, transferMoney );

module.exports = router;
