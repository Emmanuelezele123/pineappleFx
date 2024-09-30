const express = require('express');
const router = express.Router();
const auth = require('../middleware/token');
const { deposit, withdraw,adminDeposit,adminWithdraw, transferMoney } = require('../controller/pineWallet');


router.post('/deposit', auth, deposit);


router.post('/withdraw', auth, withdraw);

router.post('/admindeposit', auth, adminDeposit);


router.post('/adminwithdraw', auth, adminWithdraw);

router.post('/transfer', auth, transferMoney );



module.exports = router;
